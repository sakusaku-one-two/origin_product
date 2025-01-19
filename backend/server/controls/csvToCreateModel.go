package controls

import (
	"backend-app/server/models"
	timeModule "backend-app/server/timeModlule"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

func to_year(date_str string) int {
	reuslt, err := strconv.Atoi(date_str[:4])
	if err != nil {
		return 0
	}
	return reuslt
}

func to_month(date_str string) int {
	result, err := strconv.Atoi(date_str[4:6])
	if err != nil {
		return 0
	}
	return result
}

func to_day(date_str string) int {
	reuslt, err := strconv.Atoi(date_str[6:])
	if err != nil {
		return 0
	}
	return reuslt
}

func to_hour_minute(time_stirng string) (int, int) {
	parts := strings.Split(time_stirng, ":")
	hour, err := strconv.Atoi(parts[0])
	if err != nil {
		hour = 0
	}
	min, err := strconv.Atoi(parts[1])
	if err != nil {
		min = 0
	}
	return hour, min
}

func CreateDateTime(date_str string, time_string string) time.Time {

	year := to_year(date_str)
	month := time.Month(to_month(date_str))
	day := to_day(date_str)
	hour, minute := to_hour_minute(time_string)
	return time.Date(year, month, day, hour, minute, 0, 0, timeModule.JAPANESE_TIME_ZONE_OFFSET)
}

func CreateDepartPlanTime(row map[string]*Value) *time.Time {

	// fmt.Println("CreateDepartPlanTime開始")
	// var target_location_to_employee_record *models.LocationToEmployeeRecord
	// fmt.Println("CreateDepartPlanTime開始1")

	// if len(models.LOCATION_TO_EMPLOYEE_RECORD_REPOSITORY.Cache.Dump()) == 0 {
	// 	fmt.Println("CreateDepartPlanTimeループ", models.LOCATION_TO_EMPLOYEE_RECORD_REPOSITORY.Cache.Dump())
	// }

	// fmt.Println("CreateDepartPlanTimeループ", models.LOCATION_TO_EMPLOYEE_RECORD_REPOSITORY.Cache.Dump())
	// models.LOCATION_TO_EMPLOYEE_RECORD_REPOSITORY.Cache.Map.Range(func(key any, value any) bool {
	// 	fmt.Println("CreateDepartPlanTimeループ", key, value)
	// 	location_to_employee_record, ok := value.(*models.LocationToEmployeeRecord)
	// 	if ok && location_to_employee_record.LocationID == row["配置先番号"].To_int() && location_to_employee_record.EmpID == row["隊員番号"].To_int() && location_to_employee_record.ClientID == row["得意先番号"].To_int() {
	// 		target_location_to_employee_record = location_to_employee_record
	// 		return false
	// 	}
	// 	return true
	// })
	// fmt.Println("CreateDepartPlanTime終了")
	// var duration time.Duration
	// if target_location_to_employee_record == nil {
	// 	duration = time.Duration(time.Minute * -90)
	// 	err := models.LOCATION_TO_EMPLOYEE_RECORD_REPOSITORY.Cache.InsertNonID(models.NewLocationToEmployeeRecord(row["配置先番号"].To_int(), row["得意先番号"].To_int(), row["隊員番号"].To_int()), func(targetData *models.LocationToEmployeeRecord) (uint, error) {
	// 		return targetData.ID, nil
	// 	})
	// 	fmt.Println("CreateDepartPlanTime終了2")
	// 	if err != nil {
	// 		log.Println("配置先番号、得意先番号、隊員番号の組み合わせが存在しません。")
	// 	}
	// } else {
	// 	duration = time.Duration(time.Minute * time.Duration(target_location_to_employee_record.Duration))
	// 	fmt.Println("CreateDepartPlanTime終了3")
	// }
	duration := time.Duration(time.Minute * -90)
	fmt.Println("CreateDepartPlanTime終了4")
	date_str := row["管制日付"].To_string()
	time_str := row["基本開始時間"].To_string()
	job_start_time := CreateDateTime(date_str, time_str)
	fmt.Println("CreateDepartPlanTime終了5")
	result := job_start_time.Add(duration)
	fmt.Println("CreateDepartPlanTime終了6")
	return &result
}

// 勤務地到着時刻
func CreateReachPlanTime(row map[string]*Value) *time.Time {

	date_str := row["管制日付"].To_string()
	time_str := row["基本開始時間"].To_string()
	job_start_time := CreateDateTime(date_str, time_str)
	result := job_start_time.Add(-10 * time.Minute)
	return &result
}

func CreateStartTime(row map[string]*Value) *time.Time {

	date_str := row["管制日付"].To_string()
	time_str := row["基本開始時間"].To_string()
	result := CreateDateTime(date_str, time_str)
	return &result
}

func CreateFinalyPlanTime(row map[string]*Value) *time.Time {

	date_str := row["管制日付"].To_string()
	time_str := row["基本終了時間"].To_string()
	result := CreateDateTime(date_str, time_str)

	//もし開始時刻より前に終了時刻があった場合、終了時刻翌日の時間となる。
	start_time := CreateStartTime(row)
	if result.Before(*start_time) {
		result = result.Add(24 * time.Hour)
	}
	return &result
}

// Timeレコードを作製する IDは振らない。
func CreateTimeRecord(row map[string]*Value) ([]*models.TimeRecord, error) {

	mange_id_from_row := row["管制番号"]

	if mange_id_from_row == nil {
		for key, val := range row {
			log.Println(key, val)
		}
		log.Println("管制番号が取得できませんでした", mange_id_from_row)
		return nil, nil
	}

	manage_id := mange_id_from_row.To_int()

	result := []*models.TimeRecord{
		{ //自宅出発予定時刻
			ManageID:       manage_id,
			PlanNo:         1,
			PlanTime:       CreateDepartPlanTime(row),
			ResultTime:     nil,
			IsAlert:        false,
			PreAlert:       false,
			IsOver:         false,
			IsIgnore:       false,
			PreAlertIgnore: false,
			IsComplete:     false,
		},

		{ //現場到着予定時刻
			ManageID:       manage_id,
			PlanNo:         2,
			PlanTime:       CreateReachPlanTime(row),
			ResultTime:     nil,
			IsAlert:        false,
			PreAlert:       false,
			IsOver:         false,
			IsIgnore:       false,
			PreAlertIgnore: false,
			IsComplete:     false,
		},

		{ //勤務開始予定時刻
			ManageID:       manage_id,
			PlanNo:         3,
			PlanTime:       CreateStartTime(row),
			ResultTime:     nil,
			IsAlert:        false,
			PreAlert:       false,
			IsOver:         false,
			IsIgnore:       false,
			PreAlertIgnore: false,
			IsComplete:     false,
		},

		{ //勤務終了予定時刻
			ManageID:       manage_id,
			PlanNo:         4,
			PlanTime:       CreateFinalyPlanTime(row),
			ResultTime:     nil,
			IsAlert:        false,
			PreAlert:       false,
			IsOver:         false,
			IsIgnore:       false,
			PreAlertIgnore: false,
			IsComplete:     false,
		},
	}

	return result, nil
}
