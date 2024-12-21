package controls

import (
	"backend-app/server/models"
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
	return time.Date(year, month, day, hour, minute, 0, 0, time.Local)
}

func CreateDepartPlanTime(row map[string]*Value) *time.Time {
	duration := time.Duration(time.Minute * -90)
	date_str := row["管制日付"].To_string()
	time_str := row["基本開始時間"].To_string()
	job_start_time := CreateDateTime(date_str, time_str)
	result := job_start_time.Add(duration)
	return &result
}

// 勤務地到着時刻
func CreateReachPlanTime(row map[string]*Value) *time.Time {
	date_str := row["管制日付"].To_string()
	time_str := row["基本到着時間"].To_string()
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
	return &result
}

// Timeレコードを作製する。
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
