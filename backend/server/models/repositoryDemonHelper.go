package models

import (
	"errors"
	"time"
)

// 指定されたPlanNoのレコードを返す。
func FetchTimeRecord(records []TimeRecord, target_plan_no uint) (*TimeRecord, error) {
	if len(records) == 0 {
		return nil, errors.New("時間レコードが存在しません")
	}

	for _, record := range records {
		if record.PlanNo == target_plan_no {
			return &record, nil
		}
	}
	return nil, errors.New("指定されたレコードが存在しません")
}

// 開始時間を取得する関数
func GetEntryTime(attendanceRecord *AttendanceRecord) (time.Time, bool) {

	result, err := FetchTimeRecord(attendanceRecord.TimeRecords, 1)
	if err != nil {
		return time.Time{}, false
	}

	return *result.PlanTime, true
}

// 終了時刻の取得
func GetEndTime(targetRecord *AttendanceRecord) (time.Time, bool) {

	result, err := FetchTimeRecord(targetRecord.TimeRecords, 4)
	if err != nil {
		return time.Time{}, false
	}

	return *result.PlanTime, true
}
