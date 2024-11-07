package controls

import (
	"backend-app/server/models"
	"gorm.io/gorm"
	"time"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo-contrib/session"
	"github.com/gorilla/sessions"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
)


//ログインが完了するとこのエンドポイントがよばれてreduxに格納される。
func GetRecords(c echo.Context) {
	var attendanceRecords []models.AttendanceRecord
	var timeRecrod modles.TimeRecord

	current_time := time.Now()
	twentyFourHoursLater := current_time.Add(24*time.Hour)

	//クエリの実行
	err = models.DB.Preload("TimeRecords","plan_time >= ? AND plan_time <= ?",current_time,twentyFourHoursLater).Find(&attendanceRecords)
	if err != nil {
		return c.JSON(http.StatusNotFound,map[string]string{"message":"対象となるレコードが存在しませんでした。"})
	}

	return c.JSON(http.StatusOK,attendanceRecords)
}
