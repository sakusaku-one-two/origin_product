package models

/*
このモジュールは管制実績ＣＳＶを分割したテーブル（モデル）を定義しています。

・ManageRcord => 管制実績レコード　業務システムが管制と実績集計ように吐き出すCSV　おおよそ40カラムほどある
・ReportActionRecord => 管制実績レコードを更新するreduxActionの履歴を格納するテーブル兼,構造体
・EmployeeRecord => 管制実績の中に含まれた社員情報を抽出したテーブル　別途業務システムから社員マスタのCSVを取り込むことも可能だが、業務システムとスコープが被るので今回は管制実績から作成する。
・LocationRecrod => 管制実績の中に含まれる勤務先の情報を抽出したテーブル
・PostRecord=> 管制実績の中に含まれる勤務ポストの情報を抽出したテーブル
*/

import (
	"time"

	"gorm.io/gorm"
)

// マイグレーションする関数
func mingrate(DB *gorm.DB) error {
	return DB.AutoMigrate(
		&EmployeeRecord{},
		&LocationRecord{},
		&PostRecord{},
		&TimeRecord{},
		&User{}).Error
}

//--------------------------------[社員テーブル]-------------------------------------------

type EmployeeRecord struct {
	gorm.Model
	ID    uint `gorm:"primaryKey"`
	Name  string
	Email string `gorm:"type:varchar(255)"`
}

//--------------------------------[勤務地テーブル]-------------------------------------------

type LocationRecord struct { //配置場所のエンティティ
	gorm.Model
	LocationID   uint   `gorm:"primarykey;index not null"`
	LocationName string `gorm:"varchar(50) not null"`
	IsAlsokAlert bool   `gorm:"default:false"` //アルソックに報告が必要な現場か判定
}

//--------------------------------[勤務地・社員テーブル]-------------------------------------------
/*
	勤務地と社員の自宅距離が近く、規程の1：30前に発報では早すぎるケース
	アルソックに登録した時刻にアラートがなるようにしたい場合。
*/

type LocationToEmployee struct {
	gorm.Model
	LocaitonID   uint      `gorm:"index;not null"`
	EmployeeID   uint      `gorm:"index;not null"`
	TimeDuration time.Time //指定時間
}

//--------------------------------[勤務ポストテーブル]-------------------------------------------

type PostRecord struct { //勤務ポストのエンティティ
	gorm.Model
	PostID   int    `gorm:"primaryKey;index;not null"`
	PostName string `gorm:"type:varchar(255);not null"`
}

//--------------------------------[時間管理テーブル]-------------------------------------------
/*
このレコードで時間を管理する。
無限ループのゴルーチンでこの構造体を配列（スライス）に格納し一分おきに時間確認してする。もし内容に更新があれば、この構造体の要素を
更新してDBのupdateに入れる。そのあと、websocektでサブスクラブを行う。

以下　データフロー
発火ユーザーがredux actionを作製 => websocketでactionをサーバーに送信 => TimeRecordが格納されたsync.Mapの中から対象を取得　=> ↓
=> TimeRecordの要素を更新　=> DB.update()でDBに更新　=> websocketに各ユーザーにactionを配信=> その他ユーザーのredux storeを更新


大枠のデータフロー
1.特定のユーザーがreduxの状態を更新するためにactionを発火しサーバーに通知
2.サーバー側でDBを更新し、websocketで全クライアントにactionを通知
3．全クライアントのredux storeが更新される

*/

type ActionDTO struct { //ウェブソケットで各クライアントのreduxとサーバーのDBをつなげるobject
	Type    string      //reducerの条件分岐で処理をStore更新処理を決めるためのキー
	Payload interface{} // action.Payloadとなる値　各種モデルを
}

type TimeRecord struct {
	gorm.Model
	//親テーブルの管制実績レコードの参照
	AttendanceID     uint             `gorm:"index;not null"`
	attendanceRecord AttendanceRecord `gorm:"foreignKey:AttendanceID"`
	PlanType         string           `gorm:"varchar(50);not null"`
	PlanTime         time.Time        `gorm:"not null"`
	ResultTime       time.Time        `gorm:"default:null"`
	IsPreOver        bool             `gorm:"default:false"`           //予備アラートの状態を表すフラグ　現在時刻が予定時刻の5分目になったら発報する。
	IsOver           bool             `gorm:"default:fasle"`           //　アラート発報しているかのフラグ、このフラグをし真にするとクライアント側でアラート
	IsIgnore         bool             `gorm:"default:false"`           //　30分を過ぎたまたは、意図的にアラートを終了させるためのフラグ　このフラグを真にすると、アラーム対象外になり画面から消える。
	IsComplete       bool             `gorm:"default:false"`           //　打刻が完了したかどうかのフラグ
	Comments         string           `gorm:"type:text"`               // 備考欄
	UpdateUserID     *uint            `gorm:"default null"`            //ポインタ型にすることでnullを許可
	UpdateUser       *User            `gorm:"foreignKey:UpdateUserID"` //同じくポインタ型にすることでnullを許可
}

func (tr *TimeRecord) Check(db *gorm.DB, broadcast chan ActionDTO, currentTime time.Time) {
	/*
		IsIgnoreがファルス（無視する対称ではない）でかつIsComplete(打刻完了ではない)状態で、PlanTimeの5分前に現在時刻が入っていたらIsOverを真にしてDBに保存し配信する。
	*/
	//完了状態　または　無視する状態であるならばスルー
	if tr.IsComplete || tr.IsIgnore {
		return
	}

	PlanTime := tr.PlanTime.Add(-5 * time.Minute) //予定時間の5分前の値

	//予定時間の前に現在時刻がある場合はスルー
	if PlanTime.Before(currentTime) {
		return
	}

	//予定時間の30分を過ぎていた場合。アラートを無視したと判断
	if tr.PlanTime.Add(30 * time.Minute).After(currentTime) {
		tr.IsIgnore = true
		db.Save(tr) //
		broadcast <- tr.to_DTO("timeRecord_Ignore")
		return
	}

	//予定時間の5分前を過ぎていてかつ予定時間を越してない、かつ事前予告アラート状態がfalse場合。
	if PlanTime.After(currentTime) && tr.PlanTime.Before(currentTime) && !tr.IsPreOver {
		tr.IsPreOver = true
		db.Save(tr)
		broadcast <- tr.to_DTO("timeRecord_PreOverTime")
		return
	}

	//予定時間を超える場合
	if tr.PlanTime.After(currentTime) {
		tr.IsOver = true
		db.Save(tr)
		broadcast <- tr.to_DTO("timeRecord_OverTime")
		return
	}
}

func (tr *TimeRecord) to_DTO(action_name string) *ActionDTO {
	return &ActionDTO{
		Type:    action_name,
		Payload: *tr, //デリファレンスすることで、構造体の値を格納。
	}
}

// --------------------------------------------------------------------------------------------
// 管制実績レコード
type AttendanceRecordDTO struct { //これをログイン後に返す。
	AttendanceRecord AttendanceRecord
	TimeRecords      []TimeRecord
}

func CreateAttendacneRecrodDTO(atr *AttendanceRecord) *AttendanceRecordDTO {
	return &AttendanceRecordDTO{
		AttendanceRecord: *atr,
		TimeRecords:      atr.TimeRecords,
	}
}

type AttendanceRecord struct {
	gorm.Model
	ManageID uint `gorm:"primaryKey;index;not null"` //管制実績番号　隊員・配置先・配置ポストが一連のまとまりとなったエンティティのＩＤ

	//対象社員
	EmpID uint           `gorm:"index not null"`
	Emp   EmployeeRecord `gorm:"foreignkey:EmpId"`

	//勤務先情報
	LocationID uint           `gorm:"index;not null"`
	Location   LocationRecord `gorm:"foreignkey:LocationID"`

	//勤務ポスト
	PostID uint       `gorm:"index;not null"`
	Post   PostRecord `gorm:"foreignkey:PostID"`

	TimeRecords []TimeRecord `gorm:"foreignKey:ManageID"`

	EarlyOverTime      float64 //出勤前残業
	LunchBreakWorkTime float64 //昼残業
	ExtraHours         float64 //退勤時(の残業
}

func CreateAttendacneRecrod(db *gorm.DB, record AttendanceRecord) error {
	return db.Create(&record).Error
}

func GetAttendanceRecord(db *gorm.DB, id uint) (AttendanceRecord, error) {
	var record AttendanceRecord
	err := db.Preload("TimeRecords").First(&record, id).Error
	return record, err
}

func GetRencentAttendanceRecord(db *gorm.DB, time uint) ([]AttendanceRecord, error) {
	/*
		新しくログインしたクライアントに現在管理対象となる勤務データを返す為のメソッド
	*/

	//返り値となる変数
	var return_records []AttendanceRecord

	var minPlanTime time.Time
	err := db.Model(&TimeRecord{}).
		Select("MIN(Plan_time").Group("manage_id").Scan(&minPlanTime).Error
	//最小のPlanTimeを取得
	if err != nil {
		return nil, err
	}

	//現在時刻から24時間以内のAttendanceRecordを取得
	now := time.Now()
	twentyFourHoursAgo := now.Add(-24 * time.Hour)

	err := db.Joins("JOIN time_records ON time_records.manage_id = attendance_records.manage_id").Find(&return_records).Error
	return return_records, err
}

func DeleteAttendanceRecord(db *gorm.DB, record AttendanceRecord) error {
	return db.Save(&record).Error
}

func CreateTimeRecord(db *gorm.DB, record TimeRecord) error {
	return db.Create(&record).Error
}

func GetTimeRecord(db *gorm.DB, id uint) (TimeRecord, error) {
	var record TimeRecord
	err := db.First(&record, id).Error
	return record, err
}

func UpdateTimeRecord(db *gorm.DB, record TimeRecord) error {
	return db.Save(&record).Error
}

func (adr *AttendanceRecord) to_DTO(DB *gorm.DB) *AttendanceRecordDTO {
	return &AttendanceRecordDTO{
		AttendanceRecord: *adr,
		TimeRecords:      adr.TimeRecords,
	}
}

// type AttendanceRecord struct {
// 	gorm.Model
// 	ManageID int `gorm:"primarykey;index not null"`

// 	EmpID int      `gorm:"index not null"`
// 	Emp   Employee `gorm:"foreignkey:EmpID"`

// 	LocationID   int    `gorm:"index not null"`
// 	LocationName string `gorm:"type:varchar(255);not null"`

// 	LocationPostID string `gorm:"type:varchar(50);index;not null"`

// 	PlanHomeDepartureTime      time.Time `gorm:"type:datetime;not null"`
// 	HomeDepartureTimeStamp     *time.Time
// 	IsOverTimeAsDeparture      bool
// 	HomeDepartureStampByUserID *uint
// 	HomeDepartureStampByUser   *User `gorm:"foreignkey:HomeDepartureStampByUserID"`

// 	PlanReachTime      time.Time `gorm:"type:datetime;not null"`
// 	ReachTimeStamp     *time.Time
// 	IsOverTimeAsReach  bool
// 	ReachStampByUserID *uint
// 	ReachStampByUser   *User `gorm:"foreignkey:ReachStampByUserID"`

// 	PlanStartTime          time.Time `gorm:"type:datetime;not null"`
// 	StartTime              *time.Time
// 	IsOverTimeAsStartTime  bool
// 	StartTimeStampByUserID *uint
// 	StartTimeStampByUser   *User `gorm:"foreignkey:StartTimeStampByUserID"`

// 	PlanFinishTime          time.Time `gorm:"type:datetime;not null"`
// 	FinishTimeStamp         *time.Time
// 	IsOverTimeAsFinishTime  bool
// 	FinishTimeStampByUserID *uint
// 	FinishTimeStampByUser   *User `gorm:"foreignkey:FinishTimeStampByUserID"`

// 	EarlyOverTime      float64
// 	LunchBreakWorkTime float64
// 	ExtraHours         float64
// }

// type ReportAction struct {
// 	gorm.Model
// 	AttendanceRecordID int              `gorm:"foreignKey:AttendanceRecordID"`
// 	AttendanceRecord   AttendanceRecord `gorm:"foreignkey:AttendanceRecordID"`
// 	ID                 int
// 	UserID             int
// 	WorkType           string
// 	Content            string
// }
