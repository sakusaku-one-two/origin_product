package controls

import (
	"backend-app/server/models"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

// 各ウェブソケットの受信側のゴルーチンに対して送信側で問題があれば終了のシグナルを送信するためのチャンネル
// 　clients sync.Map の　key: websocket.Conn　value : &Done{done_cahn: make(chan interface{})}
type Done struct {
	done_chan chan interface{}
}

var (
	clients   sync.Map              // 各ユーザーのウェブソケットのコネクションを保持するスレッドセーフな辞書
	broadcast chan models.ActionDTO //ウェブソケットのコネクションに対して配信用のデータを送るチャネル
	to_DB     chan models.ActionDTO // ウェブソケットのコネクションに対して受信したデータをDBに送るチャンネル
)

func init() {
	broadcast = make(chan models.ActionDTO, 100)
	to_DB = make(chan models.ActionDTO, 100)
	go ActionBroadCast()
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 一時的にすべてのオリジンを許可
	},
}

func checkAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// 認証ロジックをここに追加
		return next(c)
	}
}

func ActionWebSocketHandler(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
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

	var msgAction models.ActionDTO
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
			to_DB <- msgAction
		}
	}
}

// Actionオブジェクトをクライアントに向けて配信するgorutin
func ActionBroadCast() {

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
	for msgAction := range broadcast {
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
