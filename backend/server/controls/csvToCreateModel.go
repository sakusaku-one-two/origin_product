package controls

import (
	"backend-app/server/models"
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

func CreateDepartPlanTime(row map[string]*Value) time.Time {
	// location_id := row["勤務地場所"].as_int
	// emp_id := row["隊員番号"].as_int

	//勤務先と社員の通勤時間が一時間半以外の指定ある場合、その値がキャッシュから取得もしくはDBから取得される
	//もしDB・キャッシュになければ双方に新規作成されて、一時間半のdurationがかえってくる。
	// duration := cash.LocationToEmployeeStore.GetDuration(emp_id, location_id)
	duration := time.Duration(time.Minute * -90)
	date_str := row["管制日付"].as_string
	time_str := row["勤務開始時刻"].as_string
	job_start_time := CreateDateTime(date_str, time_str)
	return job_start_time.Add(duration) //勤務開始1時間30分前に自宅を出ているか
}

// 勤務地到着時刻
func CreateReachPlanTime(row map[string]*Value) time.Time {
	date_str := row["管制日付"].as_string
	time_str := row["勤務開始時刻"].as_string
	job_start_time := CreateDateTime(date_str, time_str)
	return job_start_time.Add(-10 * time.Minute) //勤務開始10分前に到着しているか
}

func CreateStartTime(row map[string]*Value) time.Time {
	date_str := row["管制日付"].as_string
	time_str := row["勤務開始時刻"].as_string
	return CreateDateTime(date_str, time_str)
}

func CreateFinalyPlanTime(row map[string]*Value) time.Time {
	date_str := row["管制日付"].as_string
	time_str := row["勤務終了時刻"].as_string
	return CreateDateTime(date_str, time_str)
}

// Timeレコードを作製する。
func CreateTimeRecord(row map[string]*Value) ([]*models.TimeRecord, error) {

	manage_id := row["管制番号"].as_int

	result := []*models.TimeRecord{
		&models.TimeRecord{ //自宅出発予定時刻
			ManageID:   manage_id,
			PlanNo:     1,
			PlanTime:   CreateDepartPlanTime(row),
			IsAlert:    false,
			PreAlert:   false,
			IsOver:     false,
			IsIgnore:   false,
			IsComplete: false,
		},

		&models.TimeRecord{ //現場到着予定時刻
			ManageID:   manage_id,
			PlanNo:     2,
			PlanTime:   CreateReachPlanTime(row),
			IsAlert:    false,
			PreAlert:   false,
			IsOver:     false,
			IsIgnore:   false,
			IsComplete: false,
		},

		&models.TimeRecord{ //勤務開始予定時刻
			ManageID:   manage_id,
			PlanNo:     3,
			PlanTime:   CreateStartTime(row),
			IsAlert:    false,
			PreAlert:   false,
			IsOver:     false,
			IsIgnore:   false,
			IsComplete: false,
		},

		&models.TimeRecord{ //勤務終了予定時刻
			ManageID:   manage_id,
			PlanNo:     4,
			PlanTime:   CreateFinalyPlanTime(row),
			IsAlert:    false,
			PreAlert:   false,
			IsOver:     false,
			IsIgnore:   false,
			IsComplete: false,
		},
	}

	return result, nil
}
