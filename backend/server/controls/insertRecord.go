package controls

import (
	"backend-app/server/models"
	timeModule "backend-app/server/timeModlule"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

var ATTENDANCE_RECORD_REPOSITORY *models.Repository[models.AttendanceRecord] = models.ATTENDANCE_RECORD_REPOSITORY
var EMPLOYEE_RECORD_REPOSITORY *models.Repository[models.EmployeeRecord] = models.EMPLOYEE_RECORD_REPOSITORY
var LOCATION_RECORD_REPOSITORY *models.Repository[models.LocationRecord] = models.LOCATION_RECORD_REPOSITORY
var TIME_RECORD_REPOSITORY *models.Repository[models.TimeRecord] = models.TIME_RECORD_REPOSITORY
var POST_RECORD_REPOSITORY *models.Repository[models.PostRecord] = models.POST_RECORD_REPOSITORY

type RegistoryData struct {
	InsertRecords []models.AttendanceRecord `json:"insertRecords"`
}

// 各種アソシエーションを含んだデータ一旦ばらして個別に登録し最後にAttendanceRecordを登録する。
func InsertRecordsHandler(c echo.Context) error {
	var registoryData RegistoryData

	err := c.Bind(&registoryData)
	if err != nil {
		fmt.Println("InsertRecordsHandlerでc.Bindでエラー", err.Error(), registoryData)
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	//キャッシュに登録するためのデータを作成
	time_records := []*models.TimeRecord{}
	insert_records := []*models.AttendanceRecord{}

	for _, target := range registoryData.InsertRecords {
		//値渡しでコピー
		temp_target := target

		//未保存の時間レコードを一旦まとめる。（ポンタで渡すので後のDB保存した際、ID値が格納された状態になる）
		for _, time_record := range temp_target.TimeRecords {
			time_records = append(time_records, &time_record)
		}

		temp_target.Emp = models.EmployeeRecord{}
		temp_target.Location = models.LocationRecord{}
		temp_target.Post = models.PostRecord{}
		temp_target.TimeRecords = []models.TimeRecord{}
		insert_records = append(insert_records, &temp_target)
	}

	// dublicate_emps, err := DuplicateDelete[models.EmployeeRecord](employee_records, func(target models.EmployeeRecord) uint {
	// 	return target.EmpID
	// })

	// if err != nil {
	// 	fmt.Println("社員データの重複削除が失敗しました")
	// 	return c.JSON(http.StatusInternalServerError, map[string]string{
	// 		"status": "社員データの重複削除が失敗しました",
	// 	})
	// }

	// err = EMPLOYEE_RECORD_REPOSITORY.Cache.InsertMany(dublicate_emps, func(target *models.EmployeeRecord) (uint, bool) {
	// 	return target.EmpID, true
	// })

	// if err != nil {
	// 	fmt.Println("InsertRecordsHandlerでEMPLOYEE_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
	// 	return c.JSON(http.StatusInternalServerError, err.Error())
	// }

	// not_duplicate_locations, err := DuplicateDelete[models.LocationRecord](location_records, func(target models.LocationRecord) uint {
	// 	return target.LocationID
	// })

	//------------------------------------[LocationRecordを一括で登録する]----------------------------------------------------------------------------

	// getKeyForLocationRecord := func(InsertDataArray []*models.LocationRecord, tx *gorm.DB, rc *models.RecordsCache[models.LocationRecord]) (map[uint]*models.LocationRecord, error) {
	// 	MatchedRecords := map[uint]*models.LocationRecord{}
	// 	InsertRecord_as_array := []*models.LocationRecord{}

	// 	//重複削除の処理

	// 	duplicate_locations := []*models.LocationRecord{}
	// 	for _, record := range InsertDataArray {
	// 		flag := true
	// 		for _, location_record := range duplicate_locations {
	// 			if record.ClientID == location_record.ClientID && record.LocationID == location_record.LocationID {
	// 				flag = false
	// 			}
	// 		}
	// 		if flag {
	// 			duplicate_locations = append(duplicate_locations, record)
	// 		}
	// 	}

	// 	rc.Map.Range(func(_ any, value any) bool {

	// 		location, ok := value.(*models.LocationRecord)
	// 		if !ok {
	// 			fmt.Println("Locationのオブジェクトの型変換が失敗しました")
	// 			return false
	// 		}

	// 		flag := true
	// 		for _, record := range duplicate_locations {
	// 			if location.ClientID == record.ClientID && location.LocationID == record.LocationID {
	// 				flag = false
	// 			}
	// 		}
	// 		if flag {
	// 			InsertRecord_as_array = append(InsertRecord_as_array, location)
	// 		}
	// 		return true
	// 	})
	// 	fmt.Println("InsertRecord_as_array", len(InsertRecord_as_array))
	// 	saved_gorm_db := tx.Save(InsertRecord_as_array)
	// 	if err := saved_gorm_db.Error; err != nil {
	// 		return MatchedRecords, err
	// 	} else {
	// 		//辞書に挿入後（IDが入っているはず）のデータ

	// 		for _, record := range InsertRecord_as_array {
	// 			fmt.Println("InsertRecord_as_array-> ID", record.ID)
	// 			MatchedRecords[record.ID] = record
	// 		}
	// 	}

	// 	return MatchedRecords, nil
	// }

	// er := LOCATION_RECORD_REPOSITORY.Cache.MultiPrimaryKeyInsertMany(location_records, getKeyForLocationRecord)

	//------------------------------------------------------------------------------------------------------------------

	// if er != nil {
	// 	fmt.Println("InsertRecordsHandlerでLOCATION_RECORD_REPOSITORY.Cache.MultiPrimaryKeyInsertManyでエラー", er.Error())
	// 	return c.JSON(http.StatusInternalServerError, er.Error())
	// }

	// err = TIME_RECORD_REPOSITORY.Cache.InsertMany(time_records, func(target *models.TimeRecord) (uint, bool) {
	// 	return target.ID, true
	// })

	// if err != nil {
	// 	fmt.Println("InsertRecordsHandlerでTIME_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
	// 	return c.JSON(http.StatusInternalServerError, err.Error())
	// }

	// // //postデータの重複削除
	// // not_duplicate_posts, err := DuplicateDelete[models.PostRecord](post_records, func(target models.PostRecord) uint {
	// // 	return target.PostID
	// // })

	// // //ポストデータを登録
	// // err = POST_RECORD_REPOSITORY.Cache.InsertMany(not_duplicate_posts, func(target *models.PostRecord) (uint, bool) {
	// // 	return target.PostID, true
	// // })

	// if err != nil {
	// 	fmt.Println("InsertRecordsHandlerでPOST_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
	// 	return c.JSON(http.StatusInternalServerError, err.Error())
	// }

	// for _, record := range insert_records {
	// location, ok := LOCATION_RECORD_REPOSITORY.Cache.Get(record.LocationID)
	// if !ok {
	// 	fmt.Println("InsertRecordsHandlerでLOCATION_RECORD_REPOSITORY.Cache.Getでエラー", record.LocationID, record.Location)
	// 	return c.JSON(http.StatusInternalServerError, map[string]string{
	// 		"status": "LOCATION_RECORD_REPOSITORY.Cache.Getでエラー",
	// 	})
	// }
	// record.Location = *location
	// // emp, ok := EMPLOYEE_RECORD_REPOSITORY.Cache.Get(record.EmpID)
	// if !ok {
	// 	fmt.Println("InsertRecordsHandlerでEMPLOYEE_RECORD_REPOSITORY.Cache.Getでエラー", record.EmpID, record.Emp)
	// 	return c.JSON(http.StatusInternalServerError, map[string]string{
	// 		"status": "EMPLOYEE_RECORD_REPOSITORY.Cache.Getでエラー",
	// 	})
	// }
	// record.Emp = *emp
	// post, ok := POST_RECORD_REPOSITORY.Cache.Get(record.Post.PostID)
	// if !ok {
	// 	fmt.Println("InsertRecordsHandlerでPOST_RECORD_REPOSITORY.Cache.Getでエラー", record.PostID, record.Post)
	// 	return c.JSON(http.StatusInternalServerError, map[string]string{
	// 		"status": "POST_RECORD_REPOSITORY.Cache.Getでエラー",
	// 	})
	// }
	// record.Post = *post
	// }

	if err := models.TIME_RECORD_REPOSITORY.Cache.InsertMany(time_records, func(target *models.TimeRecord) (uint, bool) {
		return target.ID, true
	}); err != nil {
		fmt.Println("TimeReocrdの挿入に失敗しました。")
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	err = ATTENDANCE_RECORD_REPOSITORY.Cache.InsertMany(insert_records, func(target *models.AttendanceRecord) (uint, bool) {
		return target.ManageID, true
	})

	if err != nil {
		fmt.Println("InsertRecordsHandlerでATTENDANCE_RECORD_REPOSITORY.Cache.InsertManyでエラー", err.Error())
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	//キャッシュに登録したデータをクライアントに配信
	go func() {
		tick := time.NewTicker(time.Second) //一秒置きに配信する。
		attr_list := sanwitchRecords(registoryData.InsertRecords, time_records)

		current_tick_time := <-tick.C                                    //１秒置きに配信処理をおこなう。
		current_tick_time = timeModule.ToJapaneseTime(current_tick_time) //UTCから日本時間に変換

		for _, target := range attr_list {
			// <-tick.C //一秒待機

			endTime, ok := models.GetEndTime(target)
			if !ok { //時間の取得に失敗した場合はスキップ

				continue
			}

			depart_time, ok := models.GetEntryTime(target)
			if !ok { //時間の取得に失敗した場合はスキップ

				continue
			}

			//対象の範囲外であればスキップ 終了時間に+1ｈ時刻に対して現在時刻が後にある場合　又は　開始時間から-10ｈした時刻に対して現在時刻が前にある場合
			if endTime.Add(1 * time.Hour).Before(current_tick_time) {
				fmt.Println("終了時間", endTime, "出発時間", depart_time, "現在時間", current_tick_time)
				continue
			}

			fmt.Println("配信内容", target.Emp.Name, target.Location.ClientName, target.Location.LocationName, target.TimeRecords[0].PlanTime)
			//webSocketで送信
			ATTENDANCE_RECORD_REPOSITORY.Sender <- models.ActionDTO[models.AttendanceRecord]{
				Action:  "ATTENDANCE_RECORD/UPDATE",
				Payload: target,
			}
		}
	}()

	return c.JSON(http.StatusOK, "OK")
}

type getId[ModleType any] func(target ModleType) uint

// 重複削除を行う関数
func DuplicateDelete[ModelType any](targetArray []*ModelType, FetchID getId[ModelType]) ([]*ModelType, error) {
	id_map := map[uint]*ModelType{}
	//IDをキーにしてマッピング
	for _, record := range targetArray {
		id := FetchID(*record)
		id_map[id] = record
	}

	return_array := []*ModelType{}

	for _, value := range id_map {
		return_array = append(return_array, value)
	}
	return return_array, nil
}

//-------------------------------------[一旦分離したTimeRecordとAttendanceRecordを再度接合する。]--------------------------------------------------------

type Temp struct {
	Map map[uint]*models.AttendanceRecord
}

func NewTemp() *Temp {
	return &Temp{Map: map[uint]*models.AttendanceRecord{}}
}

func (t *Temp) AttendaceInsert(target models.AttendanceRecord) {
	_, ok := t.Map[target.ManageID]
	if !ok {
		target.TimeRecords = []models.TimeRecord{} //初期化して空にする。
		t.Map[target.ManageID] = &target
	}
}

func (t *Temp) TimeInsert(target *models.TimeRecord) {
	target_record, ok := t.Map[target.ManageID]
	if ok {
		target_record.TimeRecords = append(target_record.TimeRecords, *target)
	}
}

func (t *Temp) Dump() []*models.AttendanceRecord {
	result := []*models.AttendanceRecord{}
	for _, val := range t.Map {
		result = append(result, val)
	}
	return result
}

func sanwitchRecords(attRecords []models.AttendanceRecord, time_reocrds []*models.TimeRecord) []*models.AttendanceRecord {
	dict := NewTemp()

	for _, att := range attRecords {
		dict.AttendaceInsert(att)
	}

	for _, time := range time_reocrds {
		dict.TimeInsert(time)
	}
	result := dict.Dump()
	return result
}
