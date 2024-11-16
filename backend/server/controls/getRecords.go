package controls

import (
	"backend-app/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// ログインが完了するとこのエンドポイントがよばれてreduxに格納される。
func GetRecords(c echo.Context) {
	var attendanceRecords []models.AttendanceRecord
	db := models.GetDB()

	current_time := time.Now()
	twentyFourHoursLater := current_time.Add(24 * time.Hour)

	//クエリの実行
	err := db.Preload("TimeRecords", "plan_time >= ? AND plan_time <= ?", current_time, twentyFourHoursLater).Find(&attendanceRecords).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "対象となるレコードが存在しませんでした。"})
	}

	return c.JSON(http.StatusOK, attendanceRecords)
}

// 今から24時間の対称となる管制実績レコードの配信を行う。
func GetAttendanceRecord() []models.AttendanceRecord {
	var attendance_records []models.AttendanceRecord
	db := models.GetDB()
	current_time := time.Now()
	twentyFourHoursLater := current_time.Add(24 * time.Hour)
	if err := db.Preload("TimeRecords", "plan_time >= / AND plan_time <= ?", current_time, twentyFourHoursLater).Find(&attendance_records); err != nil {
		return nil
	}

	return attendance_records
}
