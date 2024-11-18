package models

import (
	"time"
)

/*
	他のモジュールから呼び出されるスタート地点
*/

var (
	EMPLOYEE_RECORD_REPOSITORY   *Repository[EmployeeRecord]
	TIME_RECORD_REPOSITORY       *Repository[TimeRecord]
	ATTENDANCE_RECORD_REPOSITORY *Repository[AttendanceRecord]
)

// 各種設定の呼び出し
func SetUp() {
	SetUpRepositry()

}

func CreateActionDTO[ModelType any](actionName string, targetModle *ModelType) ActionDTO[ModelType] {
	return ActionDTO[ModelType]{
		Action:  actionName,
		Payload: targetModle,
	}
}

// ----------------------[]-------------------------------------

// リポジトリの生成とリポジトリと関連したバックグランドゴルーチンを定義
func SetUpRepositry() {

	EMPLOYEE_RECORD_REPOSITORY = CreateRepositry[EmployeeRecord]("ACTION_EMPLOYEE_RECORD", 10)
	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//社員キャッシュに関連したバックグランドで動作するごルーチン

		for action_emp_dto := range repo.Reciver {

			switch action_emp_dto.Action {
			case "EMP_UPDATE":
				repo.Cache.loadAndSave(action_emp_dto.Payload.ID, action_emp_dto.Payload)
			case "EMP_DELETE":
				repo.DB.Delete(action_emp_dto.Payload)
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
			case "TIME_UPDATE":
				repo.Cache.loadAndSave(time_action_dto.Payload.ID, time_action_dto.Payload)
			case "TIME_DELETE":
				repo.Cache.Delete(time_action_dto.Payload.ID)
			default:
				continue
			}

			repo.Sender <- time_action_dto

		}

	})

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {

		//時間の管理するゴルーチン
		for {

			//一分待機
			select {
			case <-time.Tick(time.Minute): // 1分おきに動作　なので1分おきにキャッシュの中身を走査するゴルーチン
			}

			//キャッシュの中味を走査するコールバック関数　trueを返すと次の要素でそのコールバックを呼び出す。
			repo.Cache.Map.Range(func(key any, value any) bool {
				time_record, ok := value.(*TimeRecord)

				if !ok {
					return true
				}

				//スキップ条件 無視か完了又はアラート対称外のどちらか
				if time_record.IsIgnore || time_record.IsComplete || time_record.IsOver {
					return true
				}

				current_time := time.Now()

				//予定時刻の30分をオーバーしたか。オーバーしたら
				if time_record.PlanTime.Add(30 * time.Minute).After(current_time) {
					time_record.IsOver = true
					if repo.Cache.loadAndSave(time_record.ID, time_record) != nil {
						return true //キャッシュとDBの更新が失敗したのでスキップする。
					}

					repo.Sender <- CreateActionDTO[TimeRecord]("TIME_OVER", time_record)

					return true
				}

				if time_record.PlanTime.Add(-5 * time.Minute).Before(current_time) {
					//現在時刻の前に時刻が存在すル。.
					return true
				} else if time_record.PlanTime.Before(current_time) {
					//予定時刻の5分前なので、予備アラートを発報
					time_record.PreAlert = true
					if repo.Cache.loadAndSave(time_record.ID, time_record) != nil {
						return true //キャッシュに再度更新とDBの更新が失敗した
					}
					repo.Sender <- CreateActionDTO[TimeRecord]("PRE_ALERT", time_record)
				}

				return true
			})

		}
	})

	ATTENDANCE_RECORD_REPOSITORY = CreateRepositry[AttendanceRecord]("ACTION_ATTENDANCE_RECORD", 200)

}
