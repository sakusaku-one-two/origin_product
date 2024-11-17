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

// ----------------------[]-------------------------------------

// リポジトリの生成とリポジトリないのバックグランドゴルーチンを定義
func SetUpRepositry() {

	EMPLOYEE_RECORD_REPOSITORY = CreateRepositry[EmployeeRecord]("ACTION_EMPLOYEE_RECORD", 10)
	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//社員バックグランドで動作するごルーチン

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

		for time_action_dto := range repo.Reciver {

			switch time_action_dto.Action {

			case "TIME_UPDATE":
				repo.Cache.loadAndSave(time_action_dto.Payload.ID, time_action_dto.Payload)
			case "TIME_DELETE":
				repo.DB.Delete(time_action_dto.Payload)
				repo.Cache.Map.Delete(time_action_dto.Payload.ID)
			default:
				continue
			}

			repo.Sender <- time_action_dto

		}

	})

	TIME_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[TimeRecord]) {

		o

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

				//スキップ条件 無視か完了のどちらか
				if time_record.IsIgnore || time_record.IsComplete {
					return true
				}

				current_time := time.Now()

				//予定時刻の30分をオーバーしたか。オーバーしたら
				if time_record.PlanTime.Add(30 * time.Minute)

				if time_record.PlanTime.Before(current_time) {
					//現在時刻の前に時刻が存在すル。.

				}

				return true
			})

		}
	})

	ATTENDANCE_RECORD_REPOSITORY = CreateRepositry[AttendanceRecord]("ACTION_ATTENDANCE_RECORD", 200)

}
