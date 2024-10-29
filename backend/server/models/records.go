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
	"sync"
)

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
}

//--------------------------------[勤務ポストテーブル]-------------------------------------------

type PostRecord struct { //勤務ポストのエンティティ
	gorm.Model
	PostID   int    `gorm:"primarykey;index not null"`
	PostName string `gorm:"varchar(255) not null"`
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
	ManageID uint             `gorm:"index;not null"`
	Manage   AttendanceRecord `gorm:"foreignKey:ManageID"`

	PlanNo     uint // 1=> 出発報告　2=>到着報告 3=>上番報告 4=>下番報告
	PlanTime   time.Time
	ResultTime time.Time
	IsAlert bool `gorm:"defalt:fasle"` // このフラグでクライアント側でアラートを発報する。
	IsOver     bool `gorm:"defalt:fasle"` //このフラグは予定時刻を超えた事を表す
	IsIgnore   bool `gorm:"defalt:fasle"`// このフラグはアラートや無視を表す
	IsComplete bool `gorm:"defalt:fasle"` 
	selfMutex sync.Mutex
}

func (t *TimeRecord) CheckTime(current_time time.Time,pub_channel <- chan TimeRecord){
	if t.IsIgnore {return} //無視する対象なら抜ける
	
	t.selfMutex.Lock()
	defer t.selfMutex.Unlock()
	const duration := current_time.Sub(t.PlanTime)

	//30分を超えたら自動でアラートを切る　
	if duration > 30*time.Minute {
		t.IsIgnore = true //無視する対象にする。
		pub_channel <- t
		return 	
	}

	// 予定時間の5分前にアラートを発報する
	if t.PlanTime.Add(-5*time.Minute).Before(current_time) && current_time.Before(t.PlanTime) {
		t.IsArert = true
		pub_channel <- t
		return  
	}

	//予定時間を超えたらアラートを発報する。
	if t.PlanTime.Before(current_time) {
		t.IsOver = true
		
	}


}

func (t *TimeRecord) checkTime(current_time time.Time) bool {
	if t.IsIgnore { return false }
	// 30分をオーバーしたら自動でIsIgnoreを
	defer t.selfMutex.Unlock()
	t.selfMutex.Lock()
	
	duration := current_time.Sub(t.PlanTime)
	if duration > 30* time.Minute {
		t.IsIgnore = true
		return true
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
	Location   LocationRecord `gorm:"foreignkey:LocationID"`

	//勤務ポスト
	PostID uint       `gorm:"index;not null"`
	Post   PostRecord `gorm:"foreignkey:PostID"`

	EarlyOverTime      float64 //出勤前残業
	LunchBreakWorkTime float64 //昼残業
	ExtraHours         float64 //退勤時の残業

}

type AttendanceRecord_ struct {
	gorm.Model
	ManageID uint `gorm:"primaryKey;index;not null"`

	EmpID int            `gorm:"index not null"`
	Emp   EmployeeRecord `gorm:"foreignkey:EmpID"`

	LocationID   int    `gorm:"index not null"`
	LocationName string `gorm:"type:varchar(255);not null"`

	LocationPostID string `gorm:"type:varchar(50);index;not null"`

	Time          time.Time `gorm:"type:datetime;not null"`
	TimeStamp     time.Time
	IsOverTimeAs  bool
	StampByUserID uint
	StampByUser   *User `gorm:"foreignkey:HomeDepartureStampByUserID"`

	Type String //homeとかが入る

	EarlyOverTime      float64
	LunchBreakWorkTime float64
	ExtraHours         float64
}

type AttendanceRecord struct {
	gorm.Model
	ManageID int `gorm:"primarykey;index not null"`

	EmpID int      `gorm:"index not null"`
	Emp   Employee `gorm:"foreignkey:EmpID"`

	LocationID   int    `gorm:"index not null"`
	LocationName string `gorm:"type:varchar(255);not null"`

	LocationPostID string `gorm:"type:varchar(50);index;not null"`

	PlanHomeDepartureTime      time.Time `gorm:"type:datetime;not null"`
	HomeDepartureTimeStamp     *time.Time
	IsOverTimeAsDeparture      bool
	HomeDepartureStampByUserID *uint
	HomeDepartureStampByUser   *User `gorm:"foreignkey:HomeDepartureStampByUserID"`

	PlanReachTime      time.Time `gorm:"type:datetime;not null"`
	ReachTimeStamp     *time.Time
	IsOverTimeAsReach  bool
	ReachStampByUserID *uint
	ReachStampByUser   *User `gorm:"foreignkey:ReachStampByUserID"`

	PlanStartTime          time.Time `gorm:"type:datetime;not null"`
	StartTime              *time.Time
	IsOverTimeAsStartTime  bool
	StartTimeStampByUserID *uint
	StartTimeStampByUser   *User `gorm:"foreignkey:StartTimeStampByUserID"`

	PlanFinishTime          time.Time `gorm:"type:datetime;not null"`
	FinishTimeStamp         *time.Time
	IsOverTimeAsFinishTime  bool
	FinishTimeStampByUserID *uint
	FinishTimeStampByUser   *User `gorm:"foreignkey:FinishTimeStampByUserID"`

	EarlyOverTime      float64
	LunchBreakWorkTime float64
	ExtraHours         float64
}

type ReportAction struct {
	gorm.Model
	AttendanceRecordID int              `gorm:"foreignKey:AttendanceRecordID"`
	AttendanceRecord   AttendanceRecord `gorm:"foreignkey:AttendanceRecordID"`
	ID                 int
	UserID             int
	WorkType           string
	Content            string
}
