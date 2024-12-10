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

var (
	TIME_UPDATE_BROADCAST       chan ActionDTO[TimeRecord]
	ATTENDANCE_UPDATE_BROADCAST chan ActionDTO[AttendanceRecord]
)

// func init() {
// 	if errMessage := Mingrate(); errMessage != "" {
// 		panic(errMessage)
// 	}
// }

// マイグレーションする関数
func Mingrate() error {
	DB := NewQuerySession()
	mygrate_models := []interface{}{ //ここにテーブルモデルを書き連ねる。

		&EmployeeRecord{},
		&LocationRecord{},
		&PostRecord{},
		&TimeRecord{},
		&User{},
		&AttendanceRecord{},
		&LocationToEmployee{},
	}
	for _, model := range mygrate_models {
		if err := DB.AutoMigrate(model); err != nil {
			return err
		}
	}
	return nil
}

//--------------------------------[社員テーブル]-------------------------------------------

type EmployeeRecord struct {
	EmpID    uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:100"`
	Email    string `gorm:"size:100"`
	IsInTerm bool   `gorm:"default:false"` //外個人技能実習生かのフラグ
}

func NewEmployeeRecord(
	emp_ID uint,
	name string,
	email string,
	isInTerm bool,
) *EmployeeRecord {
	return &EmployeeRecord{
		EmpID:    emp_ID,
		Name:     name,
		Email:    email,
		IsInTerm: isInTerm,
	}
}

//--------------------------------[配置先テーブル]-------------------------------------------

type LocationRecord struct { //配置場所のエンティティ
	ID           uint   `gorm:"primaryKey"`
	LocationID   uint   `gorm:"not null"` // ロケーションID（主キーの一部）
	ClientID     uint   `gorm:"not null"` // クライアントID（主キーの一部）
	LocationName string `gorm:"size:100"` // ロケーションの名前
	ClientName   string `gorm:"size:100"` //得意先正名称　（会社名）
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

	PostID   uint   `gorm:"primaryKey;autoIncrement:false"`
	PostName string `gorm:"size:100"`
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
	ManageID uint `gorm:"index;not null"`

	PlanNo         uint // 1=> 出発報告　2=>到着報告 3=>上番報告 4=>下番報告
	PlanTime       *time.Time
	ResultTime     *time.Time `gorm:"default:null"`
	IsAlert        bool       `gorm:"default:false"` // このフラグでクライアント側でアラートを発報する。
	PreAlert       bool       `gorm:"default:false"` //このフラグは予定時刻の5分前に予備アラートの発報フラグ
	IsOver         bool       `gorm:"default:false"` //このフラグは予定時刻を超えた事を表す
	IsIgnore       bool       `gorm:"default:false"` // このフラグはアラートや無視を表す
	PreAlertIgnore bool       `gorm:"default:false"` // このフラグは予定時刻の5分前に無視を表す
	IsComplete     bool       `gorm:"default:false"` //完了フラグ
}

func NewTimeRecord(
	Manage_ID uint,
	Plan_No uint,
	Plan_Time *time.Time,
	Result_Time *time.Time,
) *TimeRecord {
	return &TimeRecord{
		ManageID:       Manage_ID,
		PlanNo:         Plan_No,
		PlanTime:       Plan_Time,
		ResultTime:     Result_Time,
		IsAlert:        false,
		PreAlert:       false,
		IsOver:         false,
		IsIgnore:       false,
		PreAlertIgnore: false,
		IsComplete:     false,
	}
}

// --------------------------------------------------------------------------------------------
// 管制実績レコード
type AttendanceRecord struct {
	ManageID uint `gorm:"primaryKey;index;not null"` //管制実績番号　隊員・配置先・配置ポストが一連のまとまりとなったエンティティのＩＤ

	//対象社員
	EmpID uint           `gorm:"index;not null"`
	Emp   EmployeeRecord `gorm:"foreignKey:EmpID;references:EmpID"`

	//勤務先情報
	LocationID uint           `gorm:"index;not null"`                      // LocationRecord への外部キー（必須）                                               // LocationRecord への外部キー（必須）
	Location   LocationRecord `gorm:"foreignKey:LocationID;references:ID"` // LocationRecord への参照
	// 他のフィールド...

	//勤務ポスト
	PostID uint       `gorm:"index;not null"`
	Post   PostRecord `gorm:"foreignKey:PostID;references:PostID"`

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

//--------------------------------[ユーザーテーブル]-------------------------------------------

type LocationToEmployee struct {
	gorm.Model
	LocationID uint `gorm:"primaryKey;autoIncrement:false"`
	ClientID   uint `gorm:"primaryKey;autoIncrement:false"`
	EmpID      uint `gorm:"primaryKey;autoIncrement:false"`
}

func NewLocationToEmployee(
	Location_ID uint,
	Client_ID uint,
	Emp_ID uint,
) *LocationToEmployee {
	return &LocationToEmployee{
		LocationID: Location_ID,
		ClientID:   Client_ID,
		EmpID:      Emp_ID,
	}
}
