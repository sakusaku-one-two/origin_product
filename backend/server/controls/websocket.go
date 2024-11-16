package controls

import (
	"backend-app/server/models"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

// 各ウェブソケットの受信側のゴルーチンに対して送信側で問題があれば終了のシグナルを送信するためのチャンネル
// 　clients sync.Map の　key: websocket.Conn　value : &Done{done_cahn: make(chan interface{})}
type Done struct {
	done_chan chan interface{}
	is_done   bool
}

var (
	clients                  sync.Map                                 // 各ユーザーのウェブソケットのコネクションを保持するスレッドセーフな辞書
	TIMERECORD_CLIENT_TO_DB  chan models.ActionDTO[models.TimeRecord] //ウェブソケットのコネクションに対して配信用のデータを送るチャネル
	TIMERECORD_DB_TO_CLIENTS chan models.ActionDTO[models.TimeRecord] // ウェブソケットのコネクションに対して受信したデータをDBに送るチャンネル
	UPGREDER                 websocket.Upgrader
)

func init() {
	StartUp()
}

func StartUp() {
	TIMERECORD_DB_TO_CLIENTS, _ := models.FetchChannele_TypeIs[models.ActionDTO[models.TimeRecord]]("CLIENT_ACTION_TO_DB")
	TIMERECORD_CLIENT_TO_DB, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.TimeRecord]]("TIMERECORD_CLIENT_TO_DB")
	ATTENDANCE_DB_TO_CLIENTS, _ := models.FetchChannele_TypeIs[models.ActionDTO[models.AttendanceRecord]]("ATTENDANCE_DB_TO_CLIENTS")

	go ActionBroadCastFanIn(TIMERECORD_DB_TO_CLIENTS, ATTENDANCE_DB_TO_CLIENTS)

	UPGREDER = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // 一時的にすべてのオリジンを許可
		}}
}

func ActionWebSocketHandler(c echo.Context) error {
	ws, err := UPGREDER.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	done_chan := make(chan interface{}) //done_chanを定義
	clients.Store(ws, &Done{done_chan: done_chan, is_done: false})

	defer func() {
		clients.Delete(ws)
		close(done_chan)
		ws.Close()
	}()

	var msgAction models.ActionDTO[models.TimeRecord]
	// 受信のループ
	for {
		select {
		case <-done_chan: // 送信側で配信できなかった場合の終了フラグ
			return nil
		default:
			err := ws.ReadJSON(&msgAction)
			if err != nil {
				return err
			}
			TIMERECORD_CLIENT_TO_DB <- msgAction
		}
	}
}

// ブロードキャスト専用の関数
func BroadCast[T models.TimeRecord | models.AttendanceRecord](msg_action_dto models.ActionDTO[T]) {
	clients.Range(func(key any, value any) bool {

		//key  value の型アサーション　失敗したら次のコネクションに移行
		websocket_conn, ok := key.(*websocket.Conn)
		if !ok {
			return true
		}

		//型アサーションに成功　コネクションにデータを配信

		if err := websocket_conn.WriteJSON(msg_action_dto); err != nil {
			done_obj, ok := value.(*Done)
			if !ok {
				return true
			}
			//受信側のゴルーチンに終了の合図を送る
			done_obj.done_chan <- struct{}{}
		}

		return true

	})
}

// Actionオブジェクトをクライアントに向けて配信するgorutin
func ActionBroadCastFanIn(
	TimeRecordActionBroadCast <-chan models.ActionDTO[models.TimeRecord],
	AttendacneActionBroadCast <-chan models.ActionDTO[models.AttendanceRecord],
) {

	//ブロードキャストのチャンネルが閉じた際の終了<処理　すべてのウェブソケットコネクションの受信側のゴルーチンを閉じる。
	defer func() {
		clients.Range(func(key, value interface{}) bool {
			done, ok := value.(*Done)
			if ok {
				done.done_chan <- struct{}{}
			}
			return true
		})
	}()

	// DTOが来たら各クライアントに向けて配信
	for {

		select {
		case msgAction, ok := <-TimeRecordActionBroadCast:
			if !ok {
				continue
			}
			BroadCast[models.TimeRecord](msgAction)
		case msgAction, ok := <-AttendacneActionBroadCast:
			if !ok {
				continue
			}
			BroadCast[models.AttendanceRecord](msgAction)
		}

	}

}
