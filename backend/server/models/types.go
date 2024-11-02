// package models

// import (
// 	"time"

// 	"gorm.io/gorm"
// )

// // type User struct {
// // 	gorm.Model
// // 	UserID   uint   `gorm:"primaryKey;index;not null"`
// // 	Password string `gorm:"type:varchar(255);not null"`
// // 	UserName string `gorm:"type:varchar(255);not null"`
// // 	PermissionLevel uint `gorm:"default:1;not null"`
// // 	IsActive bool `gorm:"defalt:false;not null"`
// // }

// type EmployeeRecord struct {
// 	gorm.Model
// 	ID    uint `gorm:"primaryKey"`
// 	Name  string
// 	Email string `gorm:"type:varchar(255)"`
// }

// type LocationRecord struct { //配置場所のエンティティ
// 	gorm.Model
// 	LocationID   uint   `gorm:"primarykey;index not null"`
// 	LocationName string `gorm:"varchar(50) not null"`
// }

// type PostRecord struct { //勤務ポストのエンティティ
// 	gorm.Model
// 	PostID   int    `gorm:"primarykey;index not null"`
// 	PostName string `gorm:"varchar(255) not null"`
// }

// // 管制実績レコード
// type MnageRecord struct {
// 	gorm.Model
// 	ManageID uint `gorm:"primarykey;index not null"` //管制実績番号　隊員・配置先・配置ポストが一連のまとまりとなったエンティティのＩＤ

// 	//対象社員
// 	EmpID uint           `gorm:"index not null"`
// 	Emp   EmployeeRecord `gorm:"foreignkey:EmpId"`

// 	//勤務先情報
// 	LocationID uint           `gorm:"index;not null"`
// 	Location   LocationRecord `gorm:"foreignkey:locationRecord"`

// 	//勤務ポスト
// 	PostID uint       `gorm:"index;not null"`
// 	Post   PostRecord `gorm:"foreignkey:PostID"`
// }

// type AttendanceRecord struct {
// 	gorm.Model
// 	ManageID     int `gorm:"index not null"`
// 	ManageRecord MnageRecord

// 	EmpID int      `gorm:"index not null"`
// 	Emp   Employee `gorm:"foreignkey:EmpID"`

// 	LocationID   int    `gorm:"index not null"`
// 	LocationName string `gorm:"type:varchar(255);not null"`

// 	LocationPostID string `gorm:"type:varchar(50);index;not null"`

// 	Time          time.Time `gorm:"type:datetime;not null"`
// 	TimeStamp     time.Time
// 	IsOverTimeAs  bool
// 	StampByUserID uint
// 	StampByUser   *User `gorm:"foreignkey:HomeDepartureStampByUserID"`

// 	Type String //homeとかが入る

// 	EarlyOverTime      float64
// 	LunchBreakWorkTime float64
// 	ExtraHours         float64
// }

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
