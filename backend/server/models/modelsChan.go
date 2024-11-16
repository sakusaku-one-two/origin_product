package models

var (
	TIMERECORD_CLIENT_TO_DB  chan ActionDTO[TimeRecord]
	TIMERECORD_DB_TO_CLIENTS chan ActionDTO[TimeRecord]

	ATTENDANCE_CLIENT_TO_DB  chan ActionDTO[AttendanceRecord]
	ATTENDANCE_DB_TO_CLIENTS chan ActionDTO[AttendanceRecord]
)

// model構造体と配送するチャネルを生成
func ChannelsSetUP() {
	TIME_UPDATE_BROADCAST = NewChannel_TypeIs[ActionDTO[TimeRecord]]("TIME_UPDATE_BROADCAST", 200) //ウェブソケットに向けて配信するチャネル

	ATTENDANCE_DB_TO_CLIENTS = NewChannel_TypeIs[ActionDTO[AttendanceRecord]]("ATTENDANCE_DB_TO_CLIENTS", 100)
	ATTENDANCE_CLIENT_TO_DB = NewChannel_TypeIs[ActionDTO[AttendanceRecord]]("ATTENDANCE_CLIENT_TO_DB", 200) //勤怠実績が追加されたら配信する

	//クライアントから受信したTimerecordをDBの受信プロセスに送信
	TIMERECORD_CLIENT_TO_DB = NewChannel_TypeIs[ActionDTO[TimeRecord]]("TIMERECORD_CLIENT_TO_DB", 100)

	//DBに追加または、時刻が来たらクライアントに配信する専用
	TIMERECORD_DB_TO_CLIENTS = NewChannel_TypeIs[ActionDTO[TimeRecord]]("TIMERECORD_DB_TO_CLIENTS", 100) //データベースからウェブソケットコネクションへ配信用の

	go TimeRecordCatcher(TIMERECORD_CLIENT_TO_DB, TIMERECORD_DB_TO_CLIENTS)

}

func TimeRecordCatcher(from_client <-chan ActionDTO[TimeRecord], for_clients chan<- ActionDTO[TimeRecord]) {

	for time_record_dto := range from_client {
		new_qs := NewQuerySession()
		switch time_record_dto.Action {
		case "UPDATE":
			new_qs.Save(time_record_dto.Payload)
			for_clients <- time_record_dto
		case "DELETE":
			new_qs.Delete(time_record_dto.Payload)
			for_clients <- time_record_dto
		default:
			continue
		}

	}
}
