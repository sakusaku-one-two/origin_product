package controls

import (
	"backend-app/server"
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
}

var (
	clients             sync.Map                                 // 各ユーザーのウェブソケットのコネクションを保持するスレッドセーフな辞書
	BROADCAST           chan server.ActionDTO[models.TimeRecord] //ウェブソケットのコネクションに対して配信用のデータを送るチャネル
	CLIENT_ACTION_TO_DB chan server.ActionDTO[models.TimeRecord] // ウェブソケットのコネクションに対して受信したデータをDBに送るチャンネル
	UPGREDER            websocket.Upgrader
)

func init() {
	CLIENT_ACTION_TO_DB = server.FetchChannele_TypeIs[server.ActionDTO[models.TimeRecord]]("CLIENT_ACTION_TO_DB")
	TIMERECORD_FROM_DB := server.FetchChannele_TypeIs[server.ActionDTO[models.TimeRecord]]("TIME_UPDATE_BROADCAST")
	go ActionBroadCast(TIMERECORD_FROM_DB)

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
	clients.Store(ws, &Done{done_chan: done_chan})

	defer func() {
		clients.Delete(ws)
		close(done_chan)
		ws.Close()
	}()

	var msgAction server.ActionDTO
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
			CLIENT_ACTION_TO_DB <- msgAction
		}
	}
}

// Actionオブジェクトをクライアントに向けて配信するgorutin
func ActionBroadCast(ActionBroadCast chan <- server.ActionDTO[models.TimeRecord]) {

	//ブロードキャストのチャンネルが閉じた際の終了処理　すべてのウェブソケットコネクションの受信側のゴルーチンを閉じる。
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
	for msgAction := range ActionBroadCast {
		clients.Range(func(key, value interface{}) bool {
			ws, ok := key.(*websocket.Conn)
			if !ok {
				// 型のアサーション失敗したので次に進む
				return true
			}
			done, ok := value.(*Done)
			if ok {
				// アクションをサーバープッシュ
				if err := ws.WriteJSON(msgAction); err != nil {
					done.done_chan <- struct{}{} // 受信側のループに終了を知らせる
					ws.Close()
					clients.Delete(key)
				}
			}
			return true
		})
	}

}
