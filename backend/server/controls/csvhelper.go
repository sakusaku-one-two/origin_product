package controls

import (
	"backend-app/server/models"
	"errors"
)

func UpdateAttendanceTable(csv_table *CsvTable) (*ReturnJson, error) {

	min_ID, max_ID, ok := csv_table.BetweenMaxAndMin()
	if !ok {
		return nil, errors.Error("csvから管制実績番号の最小値と最大値の取得ができませんでした")
	}

	range_records, ok := GetRangeRecords(min_ID, max_ID) //CSV内にある管制実績IDの最小値と最大値からその範囲にあるレコードをDBから取得
	if !ok {
		return nil, errors.Error("DBから管制実績番号の最大値と最小値から取得できませんでした。")
	}

	records_from_csv, err := csv_table.To_AttendanceRecords()
	if err != nil {
		return nil, err
	}

	// 管制実績番号のリストから重複しているレコードを抽出

	// 重複内容が全くの同一は無視。

	//確認の必要なものを返す

	//重複してないレコードは登録

	//
}

// CSVの管制実績番号の最小値から管制実績番号の最大値の範囲内にあるレコードをいったん取得
func GetRangeRecords(min_id uint, max_id uint) ([]models.AttendanceRecord, bool) {
	new_qs := models.NewQuerySession()
	var result_array []models.AttendanceRecord

	if err := new_qs.Where("ManageID >= ?", min_id).Where("ManageID <= ?", max_id).Find(&result_array).Error; err != nil {
		return result_array, false
	}

	return result_array, true
}
