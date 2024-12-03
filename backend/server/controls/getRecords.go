package controls

import (
	"backend-app/server/models"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// ログインが完了するとこのエンドポイントがよばれてreduxに格納される。
func GetRecords(c echo.Context) error {
	attendance_records := GetAttendanceRecord()

	if attendance_records == nil {
		return c.JSON(http.StatusBadRequest, "取得に失敗しました。")
	}
	return c.JSON(http.StatusOK, attendance_records)
}

// 今から24時間の対称となる管制実績レコードをDBから取得する。
func GetAttendanceRecord() []models.AttendanceRecord {
	var attendance_records []models.AttendanceRecord
	db := models.GetDB()
	current_time := time.Now()
	twentyFourHoursLater := current_time.Add(24 * time.Hour)
	before_time := current_time.Add(-40 * time.Minute)
	if err := db.Preload("TimeRecords", "plan_time >= ? AND plan_time <= ?", before_time, twentyFourHoursLater).Find(&attendance_records).Error; err != nil {
		log.Println(err)
		return nil
	}

	return attendance_records
}
