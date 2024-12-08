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
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. EmployeeRecordの生成
		var employees []EmployeeRecord
		for i := 1; i <= numRecords; i++ {
			employee := NewEmployeeRecord(
				uint(i),
				fmt.Sprintf("Employee_%d", i),
				fmt.Sprintf("employee_%d@example.com", i),
				false,
			)
			employees = append(employees, *employee)
		}
		if err := tx.Create(&employees).Error; err != nil {
			return err
		}
		log.Printf("Inserted %d EmployeeRecords\n", len(employees))

		// 2. LocationRecordの生成
		var locations []LocationRecord
		for i := 1; i <= numRecords; i++ {
			location := NewLocationRecord(
				uint(i),
				fmt.Sprintf("Location_%d", i),
				uint(i),
				fmt.Sprintf("Client_%d", i),
			)
			locations = append(locations, *location)
		}
		if err := tx.Create(&locations).Error; err != nil {
			return err
		}
		log.Printf("Inserted %d LocationRecords\n", len(locations))

		// 3. PostRecordの生成
		var posts []PostRecord
		for i := 1; i <= 10; i++ { // 10種類のポストを生成
			post := NewPostRecord(
				uint(i),
				fmt.Sprintf("Post_%d", i),
			)
			posts = append(posts, *post)
		}
		if err := tx.Create(&posts).Error; err != nil {
			return err
		}
		log.Printf("Inserted %d PostRecords\n", len(posts))

		// 4. AttendanceRecordの生成
		var attendanceRecords []AttendanceRecord
		for i := 1; i <= numRecords; i++ {
			attendance := NewAttendanceRecord(
				uint(i),
				uint(i),        // EmpID
				uint(i),        // LocationID
				uint((i%10)+1), // PostID (1〜10)
				[]TimeRecord{}, // 初期は空
			)
			attendanceRecords = append(attendanceRecords, *attendance)
		}
		if err := tx.Create(&attendanceRecords).Error; err != nil {
			return err
		}
		log.Printf("Inserted %d AttendanceRecords\n", len(attendanceRecords))

		// 5. TimeRecordの生成
		var timeRecords []TimeRecord
		currentTime := time.Now()
		for _, attendance := range attendanceRecords {
			for planNo := 1; planNo <= 4; planNo++ {
				planTime := currentTime.Add(time.Duration(planNo) * time.Minute)
				timeRecord := NewTimeRecord(
					attendance.ManageID,
					uint(planNo),
					&planTime,
					nil,
				)
				timeRecords = append(timeRecords, *timeRecord)
			}
		}
		if err := tx.Create(&timeRecords).Error; err != nil {
			return err
		}
		log.Printf("Inserted %d TimeRecords\n", len(timeRecords))

		return nil
	})
}
