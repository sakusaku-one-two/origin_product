package controls

import (
	"backend-app/server/models"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

var ATTENDANCE_RECORD_REPOSITORY *models.Repository[models.AttendanceRecord] = models.ATTENDANCE_RECORD_REPOSITORY
var EMPLOYEE_RECORD_REPOSITORY *models.Repository[models.EmployeeRecord] = models.EMPLOYEE_RECORD_REPOSITORY
var LOCATION_RECORD_REPOSITORY *models.Repository[models.LocationRecord] = models.LOCATION_RECORD_REPOSITORY
var TIME_RECORD_REPOSITORY *models.Repository[models.TimeRecord] = models.TIME_RECORD_REPOSITORY

type RegistoryData struct {
	InsertRecords []models.AttendanceRecord `json:"insertRecords"`
}

// 各種アソシエーションを含んだデータ一旦ばらして個別に登録し最後にAttendanceRecordを登録する。
func InsertRecordsHandler(c echo.Context) error {
	var registoryData RegistoryData

	err := c.Bind(&registoryData)
	if err != nil {
		fmt.Println("InsertRecordsHandlerでc.Bindでエラー", err.Error(), registoryData)
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	fmt.Println("InsertRecordsHandlerでregistoryData", registoryData)
	//キャッシュに登録するためのデータを作成
	time_records := []*models.TimeRecord{}
	employee_records := []*models.EmployeeRecord{}
	location_records := []*models.LocationRecord{}
	insert_records := []*models.AttendanceRecord{}
	for _, target := range registoryData.InsertRecords {
		for _, time_record := range target.TimeRecords {
			time_records = append(time_records, &time_record)
		}

		temp_target := target
		if ok := EMPLOYEE_RECORD_REPOSITORY.Cache.Exists(temp_target.EmpID); !ok {
			employee_records = append(employee_records, &temp_target.Emp)
		}
		if ok := LOCATION_RECORD_REPOSITORY.Cache.Exists(temp_target.LocationID); !ok {
			location_records = append(location_records, &temp_target.Location)
		}
		insert_records = append(insert_records, &temp_target)
	}

	err = EMPLOYEE_RECORD_REPOSITORY.Cache.InsertMany(employee_records, func(target *models.EmployeeRecord) (uint, bool) {
		return target.EmpID, true
	})

	if err != nil {
		fmt.Println("InsertRecordsHandlerでEMPLOYEE_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	err = LOCATION_RECORD_REPOSITORY.Cache.InsertMany(location_records, func(target *models.LocationRecord) (uint, bool) {
		return target.LocationID, true
	})

	if err != nil {
		fmt.Println("InsertRecordsHandlerでLOCATION_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	err = TIME_RECORD_REPOSITORY.Cache.InsertMany(time_records, func(target *models.TimeRecord) (uint, bool) {
		return target.ID, true
	})

	if err != nil {
		fmt.Println("InsertRecordsHandlerでTIME_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	err = ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(insert_records, func(target *models.AttendanceRecord) (uint, bool) {
		return target.ManageID, true
	})

	if err != nil {
		fmt.Println("InsertRecordsHandlerでATTENDANCE_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	//キャッシュに登録したデータをクライアントに配信
	go func() {
		time.Sleep(5 * time.Second) //遅延して配信する。
		for _, target := range insert_records {
			time.Sleep(1 * time.Second) //一秒ごとに配信
			//キャッシュに登録したデータをクライアントに配信
			fmt.Println("配信内容", target)
			ATTENDANCE_RECORD_REPOSITORY.Sender <- models.ActionDTO[models.AttendanceRecord]{
				Action:  "ATTENDANCE_RECORD/INSERT",
				Payload: target,
			}
		}
	}()

	return c.JSON(http.StatusOK, "OK")
}
