package demons

/*
TimeRecordの予定時刻を監視するループを保持したデーモンゴルーチン

*/
import (
	"backend-app/server/controls"
	"backend-app/server/models"
	"sync"
	"time"

	"gorm.io/gorm"
)

var (
	tasks      sync.Map
	tasksMutex sync.Mutex
)

func init() {
	var broadcast chan models.ActionDTO = controls.BROADCAST
	go SchduleHandler(models.DB, broadcast)

}

func addTask(task models.TimeRecord) {
	defer tasksMutex.Unlock()
	tasksMutex.Lock()
	tasks.Store(task.ID, task)
}

func SchduleHandler(db *gorm.DB, broadcast chan models.ActionDTO) {
	/*
		TimeRecordを監視するゴールチン
	*/
	for {

		current_time := time.Now()
		tasks.Range(func(key any, value interface{}) bool {
			temp, ok := value.(models.TimeRecord)

			if !ok {
				return true //アサーションに失敗したので取り合あえず次に以降
			}

			temp.Check(db, broadcast, current_time) //予定時刻を過ぎているかの確認　メソッド内部でDBへの更新と更新した構造体をbroadcastチャンネルへ送信
			return true
		})
	}

}
