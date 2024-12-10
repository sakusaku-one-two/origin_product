package models

import (
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

// サンプルデータを生成してデータベースに挿入する関数
func GenerateSampleData(db *gorm.DB) error {
	const numRecords = 100

	// トランザクションの開始
	// 1. EmployeeRecordの生成
	var employees []*EmployeeRecord
	for i := 1; i <= numRecords; i++ {
		employee := NewEmployeeRecord(
			uint(i),
			fmt.Sprintf("Employee_%v", i),
			fmt.Sprintf("employee_%v@example.com", i),
			false,
		)
		employees = append(employees, employee)
	}
	if err := EMPLOYEE_RECORD_REPOSITORY.Cache.InsertMany(employees, func(target *EmployeeRecord) (uint, bool) {
		return target.ID, true
	}); err != nil {
		return err
	}
	log.Printf("Inserted %d EmployeeRecords\n", len(employees))
	time.Sleep(1 * time.Second)
	// 2. LocationRecordの生成
	var locations []*LocationRecord
	for i := 1; i <= numRecords; i++ {
		location := NewLocationRecord(
			uint(i),
			fmt.Sprintf("Location_%d", i),
			uint(i),
			fmt.Sprintf("Client_%d", i),
		)
		locations = append(locations, location)
	}
	if err := LOCATION_RECORD_REPOSITORY.Cache.InsertMany(locations, func(target *LocationRecord) (uint, bool) {
		return target.LocationID, true
	}); err != nil {
		return err
	}
	log.Printf("Inserted %d LocationRecords\n", len(locations))
	time.Sleep(1 * time.Second)
	// 3. PostRecordの生成
	var posts []*PostRecord
	for i := 1; i <= 20; i++ { // 10種類のポストを生成
		post := NewPostRecord(
			uint(i),
			fmt.Sprintf("Post_%d", i),
		)
		posts = append(posts, post)
	}

	if err := POST_RECORD_REPOSITORY.Cache.InsertMany(posts, func(target *PostRecord) (uint, bool) {
		return target.PostID, true
	}); err != nil {
		return err
	}
	log.Printf("Inserted %d PostRecords\n", len(posts))
	time.Sleep(1 * time.Second)
	// 4. AttendanceRecordの生成
	var attendanceRecords []*AttendanceRecord
	for i := 1; i <= numRecords-5; i++ {
		attendance := NewAttendanceRecord(
			uint(i),
			uint(i),        // EmpID
			uint(i),        // LocationID
			uint((i%10)+1), // PostID (1〜10)
			[]TimeRecord{}, // 初期は空
		)
		attendanceRecords = append(attendanceRecords, attendance)
	}
	if err := ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(attendanceRecords, func(target *AttendanceRecord) (uint, bool) {
		return target.ManageID, true
	}); err != nil {
		return err
	}
	log.Printf("Inserted %d AttendanceRecords\n", len(attendanceRecords))
	time.Sleep(1 * time.Second)
	// 5. TimeRecordの生成
	var timeRecords []*TimeRecord
	currentTime := time.Now().Local().Add(time.Minute * 10)
	for _, attendance := range attendanceRecords {
		for planNo := 1; planNo <= 4; planNo++ {
			planTime := currentTime.Add(time.Duration(planNo) * time.Minute)
			timeRecord := NewTimeRecord(
				attendance.ManageID,
				uint(planNo),
				&planTime,
				&time.Time{},
			)
			timeRecords = append(timeRecords, timeRecord)
		}
	}

	NewQuerySession().Save(timeRecords).Commit()

	if err := TIME_RECORD_REPOSITORY.Cache.InsertMany(timeRecords[0:50], func(target *TimeRecord) (uint, bool) {
		return target.ID, true
	}); err != nil {
		return err
	}
	log.Printf("Inserted %d TimeRecords\n", len(timeRecords))
	time.Sleep(1 * time.Second)
	return nil
}
