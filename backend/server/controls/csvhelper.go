package controls

import (
	"backend-app/server/models"
	"errors"
	"log"
)

/*
csvの取り込みフロー

	・フロントエンドからCSVファイルをアップロード
	・エンドポイントから直にDBに格納するのではなくて、一旦モデル構造体に変換し、既存のレコードと重複情報と一緒に返す。
	・フロントエンド側で重複情報を確認してどちらかを選択
	・その結果情報をAttendanceRecord配列として再度サーバーに送付
	・model配列をDBに保存と更新を行う。
	・保存と更新の際に現在クライアント側で参照しているレコード範囲に該当している場合は、DB保存・websocketで配信。

csvの取り込み条件
・列名の存在確認
・重複がないレコードは更新する。その際
・追加であれ、更新であれ、破棄以外の場合でかつ現在フロントエンドに渡している範囲内であればWEBSOCKETで配信する。
・
*/

type ComfirmationRecords struct {
	IsLeft       bool
	FromCsv      map[uint]*models.AttendanceRecord
	FromDb       map[uint]*models.AttendanceRecord
	UniqueRecord []*models.AttendanceRecord
}

// 確認が必要なレコードと必要ないレコードを仕分ける。
func AttendanceSorting(csv_table *CsvTable) (*ComfirmationRecords, error) {

	min_ID, max_ID, ok := csv_table.BetweenMaxAndMin()
	if !ok {
		return nil, errors.New("csvから管制実績番号の最小値と最大値の取得ができませんでした")
	}

	range_records, ok := GetRangeRecords(min_ID, max_ID) //CSV内にある管制実績IDの最小値と最大値からその範囲にあるレコードをDBから取得
	if !ok {
		return nil, errors.New("DBから管制実績番号の最大値と最小値から取得できませんでした。")
	}
	// 取得したレコードを辞書に変換
	range_records_dict, err := RecordToDictionary(range_records)
	if err != nil {
		return nil, err
	}

	records_from_csv, err := csv_table.To_AttendanceRecords()
	if err != nil {
		return nil, err
	}
	// 取得したレコードを辞書に変換
	records_from_csv_dict, err := RecordToDictionary(records_from_csv)
	if err != nil {
		return nil, err
	}
	//双方のレコード構造体辞書からManageIDの重複があり、かつ構造体の各種要素に相異があるレコードの辞書をcsvからのとDBからのを返す

	return findDuplicateRecords(records_from_csv_dict, range_records_dict), nil
}

func RecordToDictionary(records []*models.AttendanceRecord) (map[uint]*models.AttendanceRecord, error) {
	result := make(map[uint]*models.AttendanceRecord)

	for _, record := range records {
		result[record.ManageID] = record
	}

	return result, nil
}

// CSVの管制実績番号の最小値から管制実績番号の最大値の範囲内にあるレコードをいったん取得
func GetRangeRecords(min_id uint, max_id uint) ([]*models.AttendanceRecord, bool) {

	var result_array []*models.AttendanceRecord

	if err := models.NewQuerySession().Where("ManageID >= ?", min_id).Where("ManageID <= ?", max_id).Find(&result_array).Error; err != nil {
		log.Println(err)
		return nil, false
	}

	return result_array, true
}

// 重複するレコードを見つけて、内容が異なるものを抽出する関数
func findDuplicateRecords(csvRecords, dbRecords map[uint]*models.AttendanceRecord) *ComfirmationRecords {
	csvDuplicates := make(map[uint]*models.AttendanceRecord)
	dbDuplicates := make(map[uint]*models.AttendanceRecord)
	unique_records := make([]*models.AttendanceRecord, 0)
	isLeft := false

	// CSVレコードをループして、DBレコードと比較
	for manageID, csvRecord := range csvRecords {
		if dbRecord, exists := dbRecords[manageID]; exists {
			// レコードの内容を比較（ManageID以外の全フィールドを比較）
			if !recordsEqual(csvRecord, dbRecord) {
				csvDuplicates[manageID] = csvRecord
				dbDuplicates[manageID] = dbRecord
				isLeft = true
			} else {
				unique_records = append(unique_records, csvRecord)
			}
		} else {
			unique_records = append(unique_records, csvRecord)
		}
	}

	return &ComfirmationRecords{
		IsLeft:       isLeft,         // 重複レコードがあるかどうか
		FromCsv:      csvDuplicates,  // CSVからの重複レコード
		FromDb:       dbDuplicates,   // DBからの重複レコード
		UniqueRecord: unique_records, // 重複しないレコード
	}
}

// 2つのレコードの内容を比較する関数
func recordsEqual(record1, record2 *models.AttendanceRecord) bool {
	return record1.EmpID == record2.EmpID &&
		record1.LocationID == record2.LocationID &&
		TimerecordsEqual(record1.TimeRecords, record2.TimeRecords)
}

func TimerecordsEqual(recordArray1, recordArray2 []models.TimeRecord) bool {
	for _, item := range recordArray1 {
		flag := false
		for _, item2 := range recordArray2 {
			if item.PlanNo == item2.PlanNo {
				flag = true
				if !TimeRecordEqual(item, item2) {
					return false
				}
			}
		}
		if !flag {
			return false
		}
	}
	return true
}

func TimeRecordEqual(record1, record2 models.TimeRecord) bool {
	return record1.PlanTime.Equal(record2.PlanTime) &&
		record1.ResultTime.Equal(record2.ResultTime)
}

// -------------------[社員の取得]-------------------

// 社員の取得とキャッシュへの登録
func GetAndCreateEmployee(row map[string]*Value) *models.EmployeeRecord {
	//存在したばあいはキャッシュから取得して返す
	if employee, ok := models.EMPLOYEE_RECORD_REPOSITORY.Cache.Load(row["隊員番号"].as_int); ok {
		return employee
	}

	employee := models.NewEmployeeRecord(row["隊員番号"].as_int, row["隊員名"].as_string, "")

	if ok, _ := models.EMPLOYEE_RECORD_REPOSITORY.Cache.Insert(row["隊員番号"].as_int, employee); !ok {
		return nil
	}
	return employee
}

// -------------------[得意先の取得]-------------------

func GetAndCreateLocation(row map[string]*Value) *models.LocationRecord {
	//存在したばあいはキャッシュから取得して返す
	if location, ok := models.LOCATION_RECORD_REPOSITORY.Cache.Load(row["配置先番号"].as_int); ok {
		return location
	}

	location := models.NewLocationRecord(row["配置先番号"].as_int, row["配置先名"].as_string, row["得意先番号"].as_int, "")

	if ok, _ := models.LOCATION_RECORD_REPOSITORY.Cache.Insert(row["配置先番号"].as_int, location); !ok {
		return nil
	}
	return location
}
