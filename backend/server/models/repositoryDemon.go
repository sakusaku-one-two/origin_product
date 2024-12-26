package models

import (
	timeModule "backend-app/server/timeModlule"
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

/*
	他のモジュールから呼び出されるスタート地点
	SENDER_ACTION_EMPLOYEE_RECORD
	RECIVER_ACTION_EMPLOYEE_RECORD

	SENDER_ACTION_TIME_RECORD
	RECIVER_ACTION_TIME_RECORD

	SENDER_ACTION_ATTENDANCE_RECORD
	RECIVER_ACTION_ATTENDANCE_RECORD

	SENDER_ACTION_LOCATION_RECORD
	RECIVER_ACTION_LOCATION_RECORD

*/

var (
	EMPLOYEE_RECORD_REPOSITORY   *Repository[EmployeeRecord]
	TIME_RECORD_REPOSITORY       *Repository[TimeRecord]
	ATTENDANCE_RECORD_REPOSITORY *Repository[AttendanceRecord]
	LOCATION_RECORD_REPOSITORY   *Repository[LocationRecord]
	POST_RECORD_REPOSITORY       *Repository[PostRecord]
)

// // 各種設定の呼び出し
// func SetUp() {
// 	SetUpRepository()
// }

// チャネルに渡すdtoを作成する関数
func CreateActionDTO[ModelType any](actionName string, targetModle *ModelType) ActionDTO[ModelType] {
	return ActionDTO[ModelType]{
		Action:  actionName,
		Payload: targetModle,
	}
}

// ----------------------[モデルごとのリポジトリとバックグランド処理の定義]-------------------------------------

// リポジトリの生成とリポジトリと関連したバックグランドゴルーチンを定義
func SetUpRepository() {

	// --------------------[社員記録のリポジトリ]--------------------------------

	EMPLOYEE_RECORD_REPOSITORY = CreateRepositry[EmployeeRecord]("ACTION_EMPLOYEE_RECORD", 100)
	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//初期値を設定する。
		session := NewQuerySession()
		employee_records := []EmployeeRecord{}
		session.Find(&employee_records)
		if len(employee_records) == 0 {
			log.Println("初期値を設定することができませんでした。employee_recordsの数が0です。")
			return
		}

		for _, employee_record := range employee_records {
			repo.Cache.Map.Store(employee_record.EmpID, &employee_record)
		}
		log.Printf("初期値を設定しました。employee_recordsの数:%v", len(employee_records))
	})

	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//社員キャッシュに関連したバックグランドで動作するごルーチン

		for action_emp_dto := range repo.Reciver {

			switch action_emp_dto.Action {
			case "EMPLOYEE_RECORD/UPDATE":
				repo.Cache.loadAndSave(action_emp_dto.Payload.EmpID, action_emp_dto.Payload)
			case "EMPLOYEE_RECORD/DELETE":
				repo.Cache.Delete(action_emp_dto.Payload.EmpID)
			default:
				continue
			}

			repo.Sender <- action_emp_dto
		}

	})

	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//キャッシュの中身をダンプする

		time.Sleep(10 * time.Minute)
		for _, employee_record := range repo.Cache.Dump() {
			log.Println(employee_record.Name)
		}
	})

	// --------------------[時間記録のリポジトリ]--------------------------------

	TIME_RECORD_REPOSITORY = CreateRepositry[TimeRecord]("ACTION_TIME_RECORD", 100)

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {
		//初期値を設定する。
		NewQuerySession().Transaction(func(tx *gorm.DB) error {
			time_records := []*TimeRecord{}
			before_time := timeModule.GetNowTimeAsJapanese().Add(-1 * time.Hour)
			after_time := timeModule.GetNowTimeAsJapanese().Add(8 * time.Hour)
			tx.Where("plan_time >= ? AND paln_time <= ?", before_time, after_time).Find(&time_records)
			if len(time_records) == 0 {
				log.Println("初期値を初期化することができませんでした。time_recordsの数が0です")
				return nil
			}

			err := repo.Cache.InsertMany(time_records, func(record *TimeRecord) (uint, bool) {
				return record.ID, true
			})
			if err != nil {
				log.Println("社員データの初期化情報の書きこみに失敗しました。")
				return err
			}
			log.Printf("初期値を設定しました。time_recordsの数:%v", len(time_records))
			return nil
		})

	})

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {
		//全てのtimeActionDTOはこのゴルーチンに渡されてキャッシュとDBが更新と削除される
		for time_action_dto := range repo.Reciver {
			log.Printf("time_action_dto入ります!: %v", time_action_dto.Payload)

			switch time_action_dto.Action {
			case "TIME_RECORD/UPDATE":
				if err := repo.Cache.loadAndSave(time_action_dto.Payload.ID, time_action_dto.Payload); err != nil {
					log.Printf("Failed to update cache and DB for TimeRecord ID %v: %v", time_action_dto.Payload.ID, err)
					continue
				}
			case "TIME_RECORD/DELETE":
				if ok := repo.Cache.Delete(time_action_dto.Payload.ID); !ok {
					log.Printf("Failed to delete cache for TimeRecord ID %v: %v", time_action_dto.Payload.ID, ok)
					continue
				}
			default:
				continue
			}

			repo.Sender <- time_action_dto

		}

	})

	// --------------------[時間記録のリポジトリ]--------------------------------

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {

		ticker := time.NewTicker(30 * time.Second) //30秒おきに動作する
		defer ticker.Stop()

		//時間の管理するゴルーチン
		for {

			temp_time := <-ticker.C // 30秒おきに動作　なので30秒おきにキャッシュの中身を走査するゴルーチン
			update_records := []*TimeRecord{}
			currentTime := timeModule.ToJapaneseTime(temp_time)
			log.Println("現在の時間", currentTime)
			log.Println("現在のキャッシュの数（timeRecord）", repo.Cache.Len())
			repo.Cache.Map.Range(func(key any, value any) bool { //キャッシュの中味を走査するコールバック関数　trueを返すと次の要素でそのコールバックを呼び出す。
				time_record, ok := value.(*TimeRecord)
				log.Println("time_recordの予定時刻", time_record.PlanTime)
				if !ok {
					log.Printf("Failed to convert to *TimeRecord for key %v", key)
					return true
				}

				//スキップ条件 無視か完了又はアラート対称外のどちらか
				if time_record.IsComplete || time_record.IsOver {
					log.Println("無視か完了又はアラート対称外のどちらか", time_record.IsComplete, time_record.IsOver, time_record.PlanTime)
					return true
				}

				//予定時刻から2hをオーバーしたか。
				if currentTime.After(time_record.PlanTime.Add(2 * time.Hour)) {
					time_record.IsOver = true
					update_records = append(update_records, time_record)
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/DELETE", time_record) //フロントエンドのreduxに削除依頼を行う。
					return true
				}

				if time_record.IsIgnore {
					return true
				}

				//予定時刻の5分前より前か判定。
				if time_record.PlanTime.Add(-5 * time.Minute).After(currentTime) {
					//予定時刻（5分前）より前に現在時刻が存在するので何もしない。
					log.Println("予定時刻（5分前）より前に現在時刻が存在するので何もしない。", time_record.PlanTime, currentTime)
					return true
				} else if time_record.PlanTime.After(currentTime) && !time_record.PreAlert {
					//予定時刻の5分前	なので、予備アラートを発報 (無視の場合は除く)
					log.Println("予定時刻の5分前なので、予備アラートを発報 (無視の場合は除く)", time_record.PlanTime, currentTime)
					time_record.PreAlert = true
					update_records = append(update_records, time_record)
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/UPDATE", time_record)
					return true
				} else if time_record.PlanTime.Before(currentTime) && !time_record.IsAlert {
					//予定時刻の後に現在時刻が存在するのでアラートを発報
					log.Println("予定時刻の後に現在時刻が存在するのでアラートを発報", time_record.PlanTime, currentTime)
					time_record.IsAlert = true
					update_records = append(update_records, time_record)
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/UPDATE", time_record)
				}
				return true
			})

			if len(update_records) > 0 {
				repo.Cache.InsertMany(update_records, func(record *TimeRecord) (uint, bool) {
					return record.ID, true
				})
			}
		}
	})

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {

		//timeRecordの監視範囲を1時間おきに不用な対象レコードを外す（DBから消すわけではない）
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()

		//1時間おきに動作するゴルーチン
		for {
			currentTime := <-ticker.C
			before_time := timeModule.ToJapaneseTime(currentTime).Add(-5 * time.Hour)
			after_time := timeModule.ToJapaneseTime(currentTime).Add(16 * time.Hour)

			repo.Cache.Map.Range(func(key any, value any) bool {
				time_record, ok := value.(*TimeRecord)
				if !ok {
					log.Printf("Failed to convert to *TimeRecord for key %v", key)
					return true
				}
				//監視範囲外の場合は削除する （予定時刻から1時間を超えている場合は削除する
				if time_record.PlanTime.Before(before_time) || time_record.PlanTime.After(after_time) {
					repo.Cache.Map.Delete(key)
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/DELETE", time_record) //実施際にDB内のデータを削除するわけではないが、クライアント側のredux-reducerに削除するというアクションを送信する
				}
				return true
			})

			NewQuerySession().Transaction(func(tx *gorm.DB) error {
				newAttendanceRecords := []*AttendanceRecord{}
				if err := tx.Preload("TimeRecords", "plan_time >= ? AND plan_time <= ?", before_time, after_time).Preload("Emp").Preload("Location").Preload("Post").Find(&newAttendanceRecords).Error; err != nil {
					return err
				}

				for _, attendance_record := range newAttendanceRecords {
					isSend := false
					for _, time_record := range attendance_record.TimeRecords {
						if !repo.Cache.Exists(time_record.ID) {
							repo.Cache.Map.Store(time_record.ID, &time_record)
							isSend = true
						}
					}
					if isSend {
						ATTENDANCE_RECORD_REPOSITORY.Sender <- CreateActionDTO[AttendanceRecord]("ATTENDANCE_RECORD/UPDATE", attendance_record)
					}
				}

				return nil
			})

		}
	})

	// --------------------[勤怠記録のリポジトリ]--------------------------------

	ATTENDANCE_RECORD_REPOSITORY = CreateRepositry[AttendanceRecord]("ACTION_ATTENDANCE_RECORD", 500)
	ATTENDANCE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[AttendanceRecord]) {
		//削除と更新
		for attRecordActionDTO := range repo.Reciver {

			switch attRecordActionDTO.Action {
			case "ATTENDANCE_RECORD/UPDATE":
				if err := repo.Cache.loadAndSave(attRecordActionDTO.Payload.ManageID, attRecordActionDTO.Payload); err != nil {
					log.Printf("Failed to update cache and DB for AttendanceRecord ID %v: %v", attRecordActionDTO.Payload.ManageID, err)
					continue
				}
			case "ATTENDANCE_RECORD/DELETE":
				if ok := repo.Cache.Delete(attRecordActionDTO.Payload.ManageID); !ok {
					log.Printf("Failed to delete cache for AttendanceRecord ID %v: %v", attRecordActionDTO.Payload.ManageID, ok)
					continue
				}
			default:
				continue
			}

			repo.Sender <- attRecordActionDTO
		}
	})

	ATTENDANCE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[AttendanceRecord]) {
		//勤怠記録の監視範囲を1時間おきに不用な対象レコードを外す（DBから消すわけではない）
		ticker := time.NewTicker(20 * time.Minute)
		defer ticker.Stop()

		for {
			currentTime := <-ticker.C
			before_time := timeModule.ToJapaneseTime(currentTime).Add(-5 * time.Hour)
			after_time := timeModule.ToJapaneseTime(currentTime).Add(16 * time.Hour)

			repo.Cache.Map.Range(func(key any, value any) bool {
				attendance_record, ok := value.(*AttendanceRecord)
				if !ok {
					log.Printf("Failed to convert to *AttendanceRecord for key %v", key)
					return true
				}
				if attendance_record.TimeRecords[0].PlanTime.Before(before_time) || attendance_record.TimeRecords[0].PlanTime.After(after_time) {
					repo.Cache.Map.Delete(key)
					repo.Sender <- CreateActionDTO[AttendanceRecord]("ATTENDANCE_RECORD/DELETE", attendance_record)
				}
				return true
			})
		}
	})

	// --------------------[配置先記録のリポジトリ]--------------------------------
	LOCATION_RECORD_REPOSITORY = CreateRepositry[LocationRecord]("ACTION_LOCATION_RECORD", 200)
	LOCATION_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[LocationRecord]) {
		//削除と更新
		for locationRecordActionDTO := range repo.Reciver {
			switch locationRecordActionDTO.Action {
			case "LOCATION_RECORD/UPDATE":
				if err := repo.Cache.MulitPrimaryKeyInsert(locationRecordActionDTO.Payload, func(targetRecord *LocationRecord, tx *gorm.DB, rc *RecordsCache[LocationRecord]) (uint, error) {
					var return_error error = nil
					result_flag := false
					var target_uint_id uint = 0
					rc.Map.Range(func(key any, value any) bool {
						//型変換
						_, id_ok := key.(uint)
						if !id_ok {
							return_error = errors.New("ロケーションレコードのMAPのキーのキャストが失敗しました")
							return false
						}

						record, rec_ok := value.(LocationRecord)
						if !rec_ok {
							return_error = errors.New("ロケーションレコードのMAP内のキャストに失敗しました。")
							return false
						}

						if record.ClientID == targetRecord.ClientID && record.LocationID == targetRecord.LocationID {
							//合致したケース
							target_uint_id = record.ID
							result_flag = true
							return true
						}
						return true
					})

					//何かエラーがあった場合はそのエラーを返す。
					if return_error != nil {
						return 0, return_error
					}

					if result_flag {
						//既に対象のレコードが存在するので、IDを古いのに入れて内容を更新する。
						targetRecord.ID = target_uint_id
						tx.Save(targetRecord).Commit()
						return targetRecord.ID, nil
					} else {
						//対象のレコードがキャッシュに存在しないので、新規登録
						tx.Save(targetRecord).Commit()
						return targetRecord.ID, nil
					}

				}); err != nil {
					log.Printf("Failed to update cache and DB for LocationRecord ID %v: %v", locationRecordActionDTO.Payload.ID, err)
					continue
				}
			case "LOCATION_RECORD/DELETE":
				if ok := repo.Cache.Delete(locationRecordActionDTO.Payload.ID); !ok {
					log.Printf("Failed to delete cache for LocationRecord ID %v: %v", locationRecordActionDTO.Payload.ID, ok)
					continue
				}
			default:
				continue
			}
		}
	})

	// --------------------[勤務形態記録のリポジトリ]--------------------------------
	POST_RECORD_REPOSITORY = CreateRepositry[PostRecord]("ACTION_POST_RECORD", 100)
	POST_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[PostRecord]) {
		//削除と更新
		for postRecordActionDTO := range repo.Reciver {
			switch postRecordActionDTO.Action {
			case "POST_RECORD/UPDATE", "POST_RECORD/INSERT":
				if err := repo.Cache.loadAndSave(postRecordActionDTO.Payload.PostID, postRecordActionDTO.Payload); err != nil {
					log.Printf("Failed to update cache and DB for PostRecord ID %v: %v", postRecordActionDTO.Payload.PostID, err)
					continue
				}
			case "POST_RECORD/DELETE":
				if ok := repo.Cache.Delete(postRecordActionDTO.Payload.PostID); !ok {
					log.Printf("Failed to delete cache for PostRecord ID %v: %v", postRecordActionDTO.Payload.PostID, ok)
					continue
				}
			default:
				log.Printf("存在しないアクションがPOST_RECORDに送信されました。アクション名:%v", postRecordActionDTO.Action)
				continue
			}

			repo.Sender <- postRecordActionDTO
		}
	})

}
