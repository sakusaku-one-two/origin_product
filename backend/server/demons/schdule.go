package demons

/*
TimeRecordの予定時刻を監視するループを保持したデーモンゴルーチン

*/
import (
	"backend-app/server/channels"
	"backend-app/server/models"
	"sync"
	"time"
)

var (
	tasks              sync.Map
	TIMERECORD_FROM_DB chan channels.ActionDTO[models.TimeRecord]
	BROADCAST          chan channels.ActionDTO[models.AttendanceRecord]
)

func StartUP() {

	ATTENDANCERECROD_FROM_DB = channels.FetchChannele_TypeIs[channels.ActionDTO[models.AttendanceRecord]]("ATTENDANCERECROD_FROM_DB")
	go TaskAppendHandler()

	go SchduleHandler(BROADCAST)
}

func TaskAppendHandler() {
	TIMERECORD_FROM_DB = channels.FetchChannele_TypeIs[channels.ActionDTO[models.TimeRecord]]("TIMERECORD_FROM_DB")
	for time_record := range TIMERECORD_FROM_DB {
		tasks.Store(time_record.ID, time_record)
	}
}

func SchduleHandler(broadcast <-chan channels.ActionDTO[models.TimeRecord]) {
	/*
		TimeRecordを監視するゴールチン
	*/

	db := models.GetDB()
	for {

		current_time := time.Now()
		tasks.Range(func(key any, value interface{}) bool {
			temp, ok := value.(*models.TimeRecord)

			if !ok {
				return true //アサーションに失敗したので取り合あえず次に以降
			}

			temp.Check(db, broadcast, current_time) //予定時刻を過ぎているかの確認　メソッド内部でDBへの更新と更新した構造体をbroadcastチャンネルへ送信
			return true
		})

		select {
		case <-time.Tick(10 * time.Second):
			continue
		}
	}

}
