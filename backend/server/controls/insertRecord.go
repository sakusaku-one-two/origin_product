package controls

import (
	"backend-app/server/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

var ATTENDANCE_RECORD_REPOSITORY models.Repository[models.AttendanceRecord] = models.ATTENDANCE_RECORD_REPOSITORY

type RegistoryData struct {
	InsertRecords []models.AttendanceRecord
}

func InsertRecordsHandler(c echo.Context) error {
	var registoryData RegistoryData

	err := c.Bind(&registoryData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	//キャッシュに登録するためのデータを作成
	insert_records := []*models.AttendanceRecord{}
	for _, target := range registoryData.InsertRecords {
		insert_records = append(insert_records, &target)
	}

	err = ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(insert_records, func(target *models.AttendanceRecord) (uint, bool) {
		return target.ID, true
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	//jsonをパース
	//レコード構造体に変換
	//各種レポジトリに登録　-＞　WEBSOCKETで配信
}
