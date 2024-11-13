package controls

import (
	"backend-app/server/models"
	"strconv"
	"time"
)



func to_year(date_str string) int {
	reuslt,err := strconv.Atoi( date_str[:4])
	if  err != nil {
		return 0
	}
	return reuslt
}

func to_month(date_str string) int {
	result,err := strconv.Atoi(date_str[4:6])
	if err != nil {
		return 0
	}
	return result
}

func to_day(date_str string) int {
	reuslt ,err := strconv.Atoi(date_str[6:])
	if err != nil {
		return 0
	}
	return reuslt
}

func to_hour_minute(time_stirng string) (int,int) {
	parts := strings.Split(time_stirng,":")
	hour,err := strconv.Atoi(parts[0])
	if err  != nil {
		hort = 0
	}
	min,err := strconv.Atoi(parts[1]) 
	if err != nil {
		min = 0
	}
	return hour,min
}


func CreateDateTime(date_str string,time_string string) time.Time {
	year := to_year(date_str)
	month := time.Month( to_month(date_str) )
	day := to_day(date_str)
	hour,minute :=to_hour_minute(time_stirng)
	
	return time.Date(year,month,day,hour,minute,0)

}

//Timeレコードを作製する。
func CreateTimeRecord(row map[string]*Value) ([]*modles.TimeRecord,error) {

	manage_id := row["管制番号"].as_int



	result := make([]*modles.TimeRecord)

	result = append(result,&modles.TimeRecord{
		ManageID:manage_id,
		PlanTime:row[""]
	})
}

//勤怠レコードを生成
func CreateAttendacneRecord(row map[string]*Value) (*modles.AttendacneRecord,error) {

}