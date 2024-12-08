package models

import (
	"time"
)

var (
	employeeRecordSample   []*EmployeeRecord
	locationRecordSample   []*LocationRecord
	timeRecordSample       []*TimeRecord
	attendanceRecordSample []*AttendanceRecord
)

func CreateSampleRecords() {
	CreateSampleEmployeeRecords()
	CreateSampleLocationRecords()
	CreateSampleTimeRecords()
	CreateSampleAttendanceRecords()
}

func CreateSampleEmployeeRecords() {
	employeeRecordSample = []*EmployeeRecord{
		NewEmployeeRecord(1, "sample", "sample@sample.com", true),
		NewEmployeeRecord(2, "sample2", "sample2@sample.com", false),
		NewEmployeeRecord(3, "sample3", "sample3@sample.com", true),
		NewEmployeeRecord(4, "sample4", "sample4@sample.com", false),
		NewEmployeeRecord(5, "sample5", "sample5@sample.com", true),
		NewEmployeeRecord(6, "sample6", "sample6@sample.com", false),
		NewEmployeeRecord(7, "sample7", "sample7@sample.com", true),
		NewEmployeeRecord(8, "sample8", "sample8@sample.com", false),
		NewEmployeeRecord(9, "sample9", "sample9@sample.com", true),
		NewEmployeeRecord(10, "sample10", "sample10@sample.com", false),
		NewEmployeeRecord(11, "sample11", "sample11@sample.com", true),
		NewEmployeeRecord(12, "sample12", "sample12@sample.com", false),
		NewEmployeeRecord(13, "sample13", "sample13@sample.com", true),
		NewEmployeeRecord(14, "sample14", "sample14@sample.com", false),
		NewEmployeeRecord(15, "sample15", "sample15@sample.com", true),
		NewEmployeeRecord(16, "sample16", "sample16@sample.com", false),
		NewEmployeeRecord(17, "sample17", "sample17@sample.com", true),
		NewEmployeeRecord(18, "sample18", "sample18@sample.com", false),
		NewEmployeeRecord(19, "sample19", "sample19@sample.com", true),
		NewEmployeeRecord(20, "sample20", "sample20@sample.com", false),
	}

	getter := func(record *EmployeeRecord) (uint, bool) {
		return record.ID, true
	}

	EMPLOYEE_RECORD_REPOSITORY.Cache.InsertMany(employeeRecordSample, getter)
}

func CreateSampleLocationRecords() {
	locationRecordSample = []*LocationRecord{
		NewLocationRecord(1, "sample", 1, "sample"),
		NewLocationRecord(2, "sample2", 2, "sample2"),
		NewLocationRecord(3, "sample3", 3, "sample3"),
		NewLocationRecord(4, "sample4", 4, "sample4"),
		NewLocationRecord(5, "sample5", 5, "sample5"),
		NewLocationRecord(6, "sample6", 6, "sample6"),
		NewLocationRecord(7, "sample7", 7, "sample7"),
		NewLocationRecord(8, "sample8", 8, "sample8"),
		NewLocationRecord(9, "sample9", 9, "sample9"),
		NewLocationRecord(10, "sample10", 10, "sample10"),
		NewLocationRecord(11, "sample11", 11, "sample11"),
		NewLocationRecord(12, "sample12", 12, "sample12"),
		NewLocationRecord(13, "sample13", 13, "sample13"),
		NewLocationRecord(14, "sample14", 14, "sample14"),
		NewLocationRecord(15, "sample15", 15, "sample15"),
		NewLocationRecord(16, "sample16", 16, "sample16"),
		NewLocationRecord(17, "sample17", 17, "sample17"),
		NewLocationRecord(18, "sample18", 18, "sample18"),
		NewLocationRecord(19, "sample19", 19, "sample19"),
		NewLocationRecord(20, "sample20", 20, "sample20"),
	}

	getter := func(record *LocationRecord) (uint, bool) {
		return record.LocationID, true
	}

	LOCATION_RECORD_REPOSITORY.Cache.InsertMany(locationRecordSample, getter)
}

func convertToNonPointer(records []*TimeRecord) []TimeRecord {
	nonPointerRecords := make([]TimeRecord, len(records))
	for i, record := range records {
		nonPointerRecords[i] = *record
	}
	return nonPointerRecords
}

func GenageSampleTimeRecords(startNo int, endNo int) []*TimeRecord {
	result := []*TimeRecord{}
	for manage_id := startNo; manage_id < endNo; manage_id++ {
		for plan_no := 1; plan_no < 5; plan_no++ {
			result = append(result, &TimeRecord{
				ManageID:       uint(manage_id),
				PlanNo:         uint(plan_no),
				PlanTime:       addTime(manage_id),
				IsAlert:        false,
				PreAlert:       false,
				PreAlertIgnore: false,
				IsOver:         false,
				IsIgnore:       false,
				IsComplete:     false,
			})
		}
	}
	return result
}

func addTime(minutes int) *time.Time {
	now := time.Now()
	result := now.Add(time.Minute * time.Duration(minutes))
	return &result
}

func CreateSampleTimeRecords() {

	timeRecordSample = []*TimeRecord{
		NewTimeRecord(1, 1, addTime(5), nil),
		NewTimeRecord(1, 2, addTime(6), nil),
		NewTimeRecord(1, 3, addTime(7), nil),
		NewTimeRecord(1, 4, addTime(9), nil),
		NewTimeRecord(2, 1, addTime(10), nil),
		NewTimeRecord(2, 2, addTime(11), nil),
		NewTimeRecord(2, 3, addTime(12), nil),
		NewTimeRecord(2, 4, addTime(13), nil),
		NewTimeRecord(3, 1, addTime(14), nil),
		NewTimeRecord(3, 2, addTime(15), nil),
		NewTimeRecord(3, 3, addTime(16), nil),
		NewTimeRecord(3, 4, addTime(17), nil),
		NewTimeRecord(4, 1, addTime(18), nil),
		NewTimeRecord(4, 2, addTime(19), nil),
		NewTimeRecord(4, 3, addTime(20), nil),
		NewTimeRecord(4, 4, addTime(21), nil),
		NewTimeRecord(5, 1, addTime(22), nil),
		NewTimeRecord(5, 2, addTime(23), nil),
		NewTimeRecord(5, 3, addTime(24), nil),
		NewTimeRecord(5, 4, addTime(25), nil),
		NewTimeRecord(6, 1, addTime(26), nil),
		NewTimeRecord(6, 2, addTime(27), nil),
		NewTimeRecord(6, 3, addTime(28), nil),
		NewTimeRecord(7, 1, addTime(29), nil),
		NewTimeRecord(7, 2, addTime(30), nil),
		NewTimeRecord(7, 3, addTime(31), nil),
		NewTimeRecord(7, 4, addTime(32), nil),
		NewTimeRecord(8, 1, addTime(33), nil),
		NewTimeRecord(8, 2, addTime(34), nil),
		NewTimeRecord(8, 3, addTime(35), nil),
		NewTimeRecord(8, 4, addTime(36), nil),
		NewTimeRecord(8, 1, addTime(37), nil),
		NewTimeRecord(8, 2, addTime(38), nil),
		NewTimeRecord(8, 3, addTime(39), nil),
		NewTimeRecord(8, 4, addTime(40), nil),
	}

	getter := func(record *TimeRecord) (uint, bool) {
		return record.ID, true
	}

	TIME_RECORD_REPOSITORY.Cache.InsertMany(timeRecordSample, getter)
}

func CreateSampleAttendanceRecords() {
	attendanceRecordSample := []*AttendanceRecord{
		NewAttendanceRecord(1, 1, 1, 1, convertToNonPointer(timeRecordSample[:4])),
		NewAttendanceRecord(2, 2, 2, 2, convertToNonPointer(timeRecordSample[4:8])),
		NewAttendanceRecord(3, 3, 3, 3, convertToNonPointer(timeRecordSample[8:12])),
		NewAttendanceRecord(4, 4, 4, 4, convertToNonPointer(timeRecordSample[12:16])),
		NewAttendanceRecord(5, 5, 5, 5, convertToNonPointer(timeRecordSample[16:20])),
		NewAttendanceRecord(6, 6, 6, 6, convertToNonPointer(timeRecordSample[20:24])),
		NewAttendanceRecord(7, 7, 7, 7, convertToNonPointer(timeRecordSample[24:28])),
		NewAttendanceRecord(8, 8, 8, 8, convertToNonPointer(timeRecordSample[28:32])),
		NewAttendanceRecord(9, 9, 9, 9, convertToNonPointer(timeRecordSample[32:36])),
		NewAttendanceRecord(10, 10, 10, 10, convertToNonPointer(timeRecordSample[36:40])),
		NewAttendanceRecord(11, 11, 11, 11, convertToNonPointer(timeRecordSample[40:44])),
		NewAttendanceRecord(12, 12, 12, 12, convertToNonPointer(timeRecordSample[44:48])),
		NewAttendanceRecord(13, 13, 13, 13, convertToNonPointer(timeRecordSample[48:52])),
		NewAttendanceRecord(14, 14, 14, 14, convertToNonPointer(timeRecordSample[52:56])),
		NewAttendanceRecord(15, 15, 15, 15, convertToNonPointer(timeRecordSample[56:60])),
		NewAttendanceRecord(16, 16, 16, 16, convertToNonPointer(timeRecordSample[60:64])),
		NewAttendanceRecord(17, 17, 17, 17, convertToNonPointer(timeRecordSample[64:68])),
		NewAttendanceRecord(18, 18, 18, 18, convertToNonPointer(timeRecordSample[68:72])),
		NewAttendanceRecord(19, 19, 19, 19, convertToNonPointer(timeRecordSample[72:76])),
		NewAttendanceRecord(20, 20, 20, 20, convertToNonPointer(timeRecordSample[76:80])),
	}

	getter := func(record *AttendanceRecord) (uint, bool) {
		return record.ManageID, true
	}

	ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(attendanceRecordSample, getter)
}
