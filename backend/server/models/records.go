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
	"sync"
	"time"

	"gorm.io/gorm"
)

var (
	TIME_UPDATE_BROADCAST       chan ActionDTO[TimeRecord]
	ATTENDANCE_UPDATE_BROADCAST chan ActionDTO[AttendanceRecord]
)

func init() {

}

// マイグレーションする関数
func Mingrate() string {
	DB := GetDB()
	return DB.AutoMigrate(
		&EmployeeRecord{},
		&LocationRecord{},
		&PostRecord{},
		&TimeRecord{},
		&User{},
	).Error()
}

//--------------------------------[社員テーブル]-------------------------------------------

type EmployeeRecord struct {
	gorm.Model
	ID    uint `gorm:"primaryKey"`
	Name  string
	Email string `gorm:"type:varchar(255)"`
}

func NewEmployeeRecord(
	id uint,
	name string,
	email string,
) *EmployeeRecord {
	return &EmployeeRecord{
		ID:    id,
		Name:  name,
		Email: email,
	}
}

//--------------------------------[配置先テーブル]-------------------------------------------

type LocationRecord struct { //配置場所のエンティティ
	gorm.Model
	LocationID   uint   `gorm:"primarykey;autoIncrement:false"` //配置先番号　（配置先）
	ClientID     uint   `gorm:"primaryKey;autoIncrement:false"` //得意先番号　（会社ID）
	ClientName   string `gorm:"varchar(50) not null"`           //得意先正式名称　（会社名）
	LocationName string `gorm:"varchar(50) not null"`           //配置先正式名称
}

func NewLocationRecord(
	Location_ID uint,
	Location_Name string,
	Client_ID uint,
	Client_Name string,
) *LocationRecord {
	return &LocationRecord{
		LocationID:   Location_ID,
		ClientID:     Client_ID,
		LocationName: Location_Name,
		ClientName:   Client_Name,
	}
}

//--------------------------------[勤務ポストテーブル]-------------------------------------------

type PostRecord struct { //勤務ポストのエンティティ
	gorm.Model
	PostID   uint   `gorm:"primarykey;autoIncrement:false"`
	PostName string `gorm:"varchar(50) not null"`
}

func NewPostRecord(
	Post_ID uint,
	Post_Name string,
) *PostRecord {
	return &PostRecord{
		PostID:   Post_ID,
		PostName: Post_Name,
	}
}

//--------------------------------[時間管理テーブル]-------------------------------------------
/*
このレコードで時間を管理する。
無限ループのゴルーチンでこの構造体を配列（スライス）に格納し一分おきに時間確認してする。もし内容に更新があれば、この構造体の要素を
更新してDBのupdateに入れる。そのあと、websocektでサブスクラブを行う。

発火ユーザーがredux actionを作製 => websocketでactionをサーバーに送信 => TimeRecordが格納されたsync.Mapの中から対象を取得　=> ↓
=> TimeRecordの要素を更新　=> DB.update()でDBに更新　=> websocketに各ユーザーにactionを配信=> その他ユーザーのredux storeを更新


*/

type TimeRecord struct {
	gorm.Model
	//親テーブルの管制実績レコードの参照
	ManageID   uint `gorm:"index;not null"`
	PlanNo     uint // 1=> 出発報告　2=>到着報告 3=>上番報告 4=>下番報告
	PlanTime   time.Time
	ResultTime time.Time
	IsAlert    bool       `gorm:"defalt:fasle"` // このフラグでクライアント側でアラートを発報する。
	IsOver     bool       `gorm:"defalt:fasle"` //このフラグは予定時刻を超えた事を表す
	IsIgnore   bool       `gorm:"defalt:fasle"` // このフラグはアラートや無視を表す
	IsComplete bool       `gorm:"defalt:fasle"` //完了フラグ
	selfMutex  sync.Mutex `gorm:"-"`            //DBのスキーマからは無視
}

func (t *TimeRecord) CheckTime(current_time time.Time) {
	if t.IsIgnore || t.IsComplete {
		return
	} //無視する対象または完了していなら抜ける

	t.selfMutex.Lock()
	defer t.selfMutex.Unlock()
	duration := current_time.Sub(t.PlanTime)

	//30分を超えたら自動でアラートを切る
	if duration > 30*time.Minute {
		t.IsIgnore = true //無視する対象にする。
		DB.Save(t)
		TIMERECORD_DB_TO_CLIENTS <- NewActionDTO[TimeRecord]("TIME_UPDATE_BROADCAST", t)
		return
	}

	// 予定時間の5分前にアラートを発報する
	if t.PlanTime.Add(-5*time.Minute).Before(current_time) && current_time.Before(t.PlanTime) {
		t.IsAlert = true
		DB.Save(t)
		TIMERECORD_DB_TO_CLIENTS <- NewActionDTO[TimeRecord]("TIME_UPDATE_BROADCAST", t)
		return
	}

	//予定時間を超えたらアラートを発報する。
	if t.PlanTime.Before(current_time) {
		t.IsOver = true
		t.IsAlert = true
		DB.Save(t)
		TIMERECORD_DB_TO_CLIENTS <- NewActionDTO[TimeRecord]("TIME_UPDATE_BROADCAST", t)
		return
	}

}

// --------------------------------------------------------------------------------------------
// 管制実績レコード
type AttendanceRecord struct {
	gorm.Model
	ManageID uint `gorm:"primaryKey;index;not null"` //管制実績番号　隊員・配置先・配置ポストが一連のまとまりとなったエンティティのＩＤ

	//対象社員
	EmpID uint           `gorm:"index not null"`
	Emp   EmployeeRecord `gorm:"foreignkey:EmpId"`

	//勤務先情報
	LocationID uint           `gorm:"index;not null"`
	ClientID   uint           `gorm:"index;not null"`
	Location   LocationRecord `gorm:"foreignkey:LocationID,ClientID;references:LocationID,ClientID"`

	//勤務ポスト
	PostID uint       `gorm:"index;not null"`
	Post   PostRecord `gorm:"foreignKey:PostID"`

	TimeRecords []TimeRecord `gorm:"foreignKey:ManageID;references:ManageID"` //リレーションの設定

	Description string

	EarlyOverTime      float64 //出勤前残業　例　0.5　ー＞　30分の残業
	LunchBreakWorkTime float64 //昼残業
	ExtraHours         float64 //退勤時の残業

}

func NewAttendanceRecord(
	Manage_ID uint,
	Emp_ID uint,
	Location_ID uint,
	Post_ID uint,
	Time_Records []TimeRecord,
) *AttendanceRecord {
	return &AttendanceRecord{
		ManageID:    Manage_ID,
		EmpID:       Emp_ID,
		LocationID:  Location_ID,
		PostID:      Post_ID,
		TimeRecords: Time_Records,
	}
}
