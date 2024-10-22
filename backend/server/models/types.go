package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserID   uint   `gorm:"primaryKey;index;not null"`
	Password string `gorm:"type:varchar(255);not null"`
	UserName string `gorm:"type:varchar(255);not null"`
	UserType string `gorm:"type:varchar(255);not null"`
}


type Employee struct {
	gorm.Model
	ID    int `gorm:"primaryKey"`
	Name  string
	Email string `gorm:"type:varchar(255)"`
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
