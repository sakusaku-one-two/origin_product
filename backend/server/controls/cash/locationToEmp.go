package cash

import (
	"backend-app/server/models"
	"fmt"
	"sync"
	"time"

	"gorm.io/gorm"
)

/*
社員と勤務地の中間テーブルのキャッシュを定義

新しい予定レコードを一括で作成するために作製
*/

var LocationToEmployeeStore *LocationToEmployeeCash

type LocationToEmployeeCash struct {
	Map sync.Map
	db  *gorm.DB
}

func CreateLTEC() *LocationToEmployeeCash {
	return &LocationToEmployeeCash{
		db: models.DB,
	}
}

// 社員番号と勤務地番号から予定時間の間隔を取得。もし存在しない場合は、一時間半前を指定
func (ltec *LocationToEmployeeCash) GetDuration(emp_id uint, location_id uint) time.Duration {
	var location_emp_record models.LocationToEmployee

	unique_key := fmt.Sprintf("%s-%s", emp_id, location_id)
	duration, exists := ltec.Map.Load(unique_key)

	if !exists {
		if ltec.db.Where("EmpolyeeID=? LocationID=?", emp_id, location_id).First(&location_emp_record).Error != nil {
			setup := time.Duration(time.Minute * -90)
			new_location_emp_record := models.LocationToEmployee{
				EmployeeID:   emp_id,
				LocaitonID:   location_id,
				TimeDuration: setup,
			}
			ltec.db.Create(&new_location_emp_record)
			ltec.Map.Store(unique_key, new_location_emp_record)
			return setup //一時間半前ん設定
		} else {
			return location_emp_record.TimeDuration
		}
	}

	return_value, ok := duration.(models.LocationToEmployee)
	if !ok {
		return time.Duration(time.Minute * -90)
	}

	return return_value.TimeDuration

}

// 差分時間を更新します。
func (ltec *LocationToEmployeeCash) UpdateDuration(emp_id uint, location_id uint, new_duration time.Duration) bool {

}

func init() {
	LocationToEmployeeStore = CreateLTEC()
}
