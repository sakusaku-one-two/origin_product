package models

import (
	"fmt"
	"log"
	"time"
)

// CreateSampleRecords はすべてのサンプルレコードを作成します。
func CreateSampleRecords() {
	CreateSampleEmployeeRecords()   // 従業員レコードのサンプルを作成
	CreateSampleLocationRecords()   // ロケーションレコードのサンプルを作成
	CreateSampleTimeRecords()       // タイムレコードのサンプルを作成
	CreateSampleAttendanceRecords() // 出席レコードのサンプルを作成
}

// CreateSampleEmployeeRecords は従業員レコードのサンプルデータを生成し、リポジトリに挿入します。
func CreateSampleEmployeeRecords() {
	var employeeRecordSample []*EmployeeRecord // 従業員レコードのスライスを初期化

	// 1から20までループしてサンプル従業員を生成
	for i := 1; i <= 20; i++ {
		name := fmt.Sprintf("sample%d", i)                                                                     // 名前を "sample1", "sample2", ... と生成
		email := fmt.Sprintf("sample%d@sample.com", i)                                                         // メールアドレスを "sample1@sample.com", ... と生成
		isActive := i%2 == 1                                                                                   // 奇数ならアクティブ、偶数なら非アクティブ
		employeeRecordSample = append(employeeRecordSample, NewEmployeeRecord(uint(i), name, email, isActive)) // 新しい従業員レコードを追加
	}

	// レコードのIDを取得するためのgetter関数を定義
	getter := func(record *EmployeeRecord) (uint, bool) {
		return record.ID, true
	}

	// リポジトリのキャッシュに複数レコードを挿入し、エラーがあればログを出力して終了
	if err := EMPLOYEE_RECORD_REPOSITORY.Cache.InsertMany(employeeRecordSample, getter); err != nil {
		log.Fatalf("Failed to insert employee records: %v", err)
	}
}

// CreateSampleLocationRecords はロケーションレコードのサンプルデータを生成し、リポジトリに挿入します。
func CreateSampleLocationRecords() {
	var locationRecordSample []*LocationRecord // ロケーションレコードのスライスを初期化

	// 1から20までループしてサンプルロケーションを生成
	for i := 1; i <= 20; i++ {
		name := fmt.Sprintf("sample%d", i)                                                                         // 名前を "sample1", "sample2", ... と生成
		locationID := uint(i)                                                                                      // ロケーションIDを設定
		locationRecordSample = append(locationRecordSample, NewLocationRecord(locationID, name, locationID, name)) // 新しいロケーションレコードを追加
	}

	// レコードのLocationIDを取得するためのgetter関数を定義
	getter := func(record *LocationRecord) (uint, bool) {
		return record.LocationID, true
	}

	// リポジトリのキャッシュに複数レコードを挿入し、エラーがあればログを出力して終了
	if err := LOCATION_RECORD_REPOSITORY.Cache.InsertMany(locationRecordSample, getter); err != nil {
		log.Fatalf("Failed to insert location records: %v", err)
	}
}

var timeRecordSample []*TimeRecord

// CreateSampleTimeRecords はタイムレコードのサンプルデータを生成し、リポジトリに挿入します。
func CreateSampleTimeRecords() {
	baseTime := time.Now()                                        // 現在時刻を基準時間として取得
	timeRecordSample = GenerateSampleTimeRecords(1, 21, baseTime) // サンプルタイムレコードを生成

	// レコードのManageIDを取得するためのgetter関数を定義
	getter := func(record *TimeRecord) (uint, bool) {
		return record.ManageID, true
	}

	// リポジトリのキャッシュに複数レコードを挿入し、エラーがあればログを出力して終了
	if err := TIME_RECORD_REPOSITORY.Cache.InsertMany(timeRecordSample, getter); err != nil {
		log.Fatalf("Failed to insert time records: %v", err)
	}
}

// CreateSampleAttendanceRecords は出席レコードのサンプルデータを生成し、リポジトリに挿入します。
func CreateSampleAttendanceRecords() {
	var attendanceRecordSample []*AttendanceRecord // 出席レコードのスライスを初期化

	// 0から19までループしてサンプル出席レコードを生成
	for i := 0; i < 20; i++ {
		attendanceRecordSample = append(attendanceRecordSample, NewAttendanceRecord(
			uint(i+1), // ManageIDを設定
			uint(i+1), // その他のIDを設定
			uint(i+1),
			uint(i+1),
			convertToNonPointer(timeRecordSample[i*4:(i+1)*4]), // タイムレコードのポインタを値に変換して設定
		))
	}

	// レコードのManageIDを取得するためのgetter関数を定義
	getter := func(record *AttendanceRecord) (uint, bool) {
		return record.ManageID, true
	}

	// リポジトリのキャッシュに複数レコードを挿入し、エラーがあればログを出力して終了
	if err := ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(attendanceRecordSample, getter); err != nil {
		log.Fatalf("Failed to insert attendance records: %v", err)
	}
}

// convertToNonPointer はポインタのスライスを値のスライスに変換します。
func convertToNonPointer(records []*TimeRecord) []TimeRecord {
	nonPointerRecords := make([]TimeRecord, len(records)) // 値のスライスを作成
	for i, record := range records {
		nonPointerRecords[i] = *record // 各ポインタから値を取得して代入
	}
	return nonPointerRecords // 変換後のスライスを返す
}

// GenerateSampleTimeRecords は指定された範囲でタイムレコードのサンプルを生成します。
func GenerateSampleTimeRecords(startNo int, endNo int, baseTime time.Time) []*TimeRecord {
	var result []*TimeRecord                                // タイムレコードのスライスを初期化
	for manageID := startNo; manageID < endNo; manageID++ { // 指定範囲でループ
		for planNo := 1; planNo <= 4; planNo++ { // 各管理IDごとに4つのプラン番号でループ
			time := addTime(manageID, baseTime)  // 基準時間に管理ID分の分を追加
			result = append(result, &TimeRecord{ // 新しいタイムレコードを追加
				ManageID:       uint(manageID),
				PlanNo:         uint(planNo),
				PlanTime:       time,
				IsAlert:        false,
				PreAlert:       false,
				PreAlertIgnore: false,
				IsOver:         false,
				IsIgnore:       false,
				IsComplete:     false,
			})
		}
	}
	return result // 生成したタイムレコードのスライスを返す
}

// addTime は基準時間に指定された分を追加し、新しい時間を返します。
func addTime(minutes int, baseTime time.Time) *time.Time {
	result := baseTime.Add(time.Minute * time.Duration(minutes)) // 分を追加
	return &result                                               // 新しい時間のポインタを返す
}
