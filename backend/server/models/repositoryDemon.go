package models

import (
	"log"
	"time"
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
)

// 各種設定の呼び出し
func SetUp() {
	SetUpRepository()
}

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

	EMPLOYEE_RECORD_REPOSITORY = CreateRepositry[EmployeeRecord]("ACTION_EMPLOYEE_RECORD", 10)
	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//社員キャッシュに関連したバックグランドで動作するごルーチン

		for action_emp_dto := range repo.Reciver {

			switch action_emp_dto.Action {
			case "EMP_RECORD_UPDATE":
				repo.Cache.loadAndSave(action_emp_dto.Payload.ID, action_emp_dto.Payload)
			case "EMP_RECORD_DELETE":
				repo.Cache.Delete(action_emp_dto.Payload.ID)
			default:
				continue
			}

			repo.Sender <- action_emp_dto
		}

	})

	TIME_RECORD_REPOSITORY = CreateRepositry[TimeRecord]("ACTION_TIME_RECORD", 100)

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {
		//全てのtimeActionDTOはこのゴルーチンに渡されてキャッシュとDBが更新と削除される
		for time_action_dto := range repo.Reciver {

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

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {

		ticker := time.NewTicker(time.Minute) //一分起きに動作する
		defer ticker.Stop()

		//時間の管理するゴルーチン
		for {

			select {
			case <-ticker.C: // 1分おきに動作　なので1分おきにキャッシュの中身を走査するゴルーチン
			}

			currentTime := time.Now()

			repo.Cache.Map.Range(func(key any, value any) bool { //キャッシュの中味を走査するコールバック関数　trueを返すと次の要素でそのコールバックを呼び出す。
				time_record, ok := value.(*TimeRecord)

				if !ok {
					log.Printf("Failed to convert to *TimeRecord for key %v", key)
					return true
				}

				//スキップ条件 無視か完了又はアラート対称外のどちらか
				if time_record.IsIgnore || time_record.IsComplete || time_record.IsOver {
					return true
				}

				//予定時刻の30分をオーバーしたか。
				if time_record.PlanTime.Add(30 * time.Minute).Before(currentTime) {
					time_record.IsOver = true
					if err := repo.Cache.loadAndSave(time_record.ID, time_record); err != nil {
						log.Printf("Failed to update cache and DB for TimeRecord ID %v: %v", time_record.ID, err)
						return true //キャッシュとDBの更新が失敗したのでスキップする。
					}

					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/TIME_OVER", time_record)
					return true
				}

				//予定時刻の5分前より前か判定。
				if time_record.PlanTime.Add(-5 * time.Minute).Before(currentTime) {
					//予定時刻（5分前）より前に現在時刻が存在するので何もしない。
					return true
				} else if time_record.PlanTime.Before(currentTime) {
					//予定時刻の5分前	なので、予備アラートを発報
					time_record.PreAlert = true
					if err := repo.Cache.loadAndSave(time_record.ID, time_record); err != nil {
						log.Printf("Failed to update cache and DB for TimeRecord ID %v: %v", time_record.ID, err)
						return true //キャッシュに再度更新とDBの更新が失敗したので一旦　次に移行
					}
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/TIME_PRE_ALERT", time_record)
					return true

				} else {
					time_record.IsAlert = true
					if err := repo.Cache.loadAndSave(time_record.ID, time_record); err != nil {
						log.Printf("Failed to update cache and DB for TimeRecord ID %v: %v", time_record.ID, err)
						return true
					}
					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_RECORD/TIME_ALERT", time_record)
				}

				return true
			})

		}
	})

	ATTENDANCE_RECORD_REPOSITORY = CreateRepositry[AttendanceRecord]("ACTION_ATTENDANCE_RECORD", 200)
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

	LOCATION_RECORD_REPOSITORY = CreateRepositry[LocationRecord]("ACTION_LOCATION_RECORD", 200)
	LOCATION_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[LocationRecord]) {
		//削除と更新
		for locationRecordActionDTO := range repo.Reciver {
			switch locationRecordActionDTO.Action {
			case "LOCATION_RECORD/UPDATE":
				if err := repo.Cache.loadAndSave(locationRecordActionDTO.Payload.ID, locationRecordActionDTO.Payload); err != nil {
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

}
