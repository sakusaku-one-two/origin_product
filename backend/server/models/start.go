package models

/*
	他のモジュールから呼び出されるスタート地点
*/

var (
	EMPLOYEE_RECORD_REPOSITORY   *Repository[EmployeeRecord]
	TIME_RECORD_REPOSITORY       *Repository[TimeRecord]
	ATTENDANCE_RECORD_REPOSITORY *Repository[AttendanceRecord]
)

//各種設定の呼び出し
func SetUp() {
	SetUpRepositryAndChannels()

}

//リポジトリとchannelを生成
func SetUpRepositryAndChannels() {

	EMPLOYEE_RECORD_REPOSITORY = CreateRepositry[EmployeeRecord]("ACTION_EMPLOYEE_RECORD", 10)
	EMPLOYEE_RECORD_REPOSITORY.BackgroundKicker(func(repo *Repository[EmployeeRecord]) {
		//社員バックグランドで動作するごルーチン

		for action_emp_dto := range repo.Reciver {

			switch action_emp_dto.Action {
			case "EMP_UPDATE":
				repo.DB.Save(action_emp_dto.Payload)

			case "EMP_DELETE":
				repo.DB.Delete(action_emp_dto.Payload)
			default:
				continue
			}

			repo.Sender <- action_emp_dto
		}

	})
	TIME_RECORD_REPOSITORY = CreateRepositry[TimeRecord]("ACTION_TIME_RECORD", 100)
	ATTENDANCE_RECORD_REPOSITORY = CreateRepositry[AttendanceRecord]("ACTION_ATTENDANCE_RECORD", 200)

}
