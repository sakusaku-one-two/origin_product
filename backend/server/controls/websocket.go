package controls

import (
	"backend-app/server/models"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

/*	レポジトリとやり取りするためのチャネルのキー
	SENDER_ACTION_EMPLOYEE_RECORD
	RECIVER_ACTION_EMPLOYEE_RECORD

	SENDER_ACTION_TIME_RECORD
	RECIVER_ACTION_TIME_RECORD

	SENDER_ACTION_ATTENDANCE_RECORD
	RECIVER_ACTION_ATTENDANCE_RECORD

*/

// 各ウェブソケットの受信側のゴルーチンに対して送信側で問題があれば終了のシグナルを送信するためのチャンネル
// 　clients sync.Map の　key: websocket.Conn　value : &Done{done_cahn: make(chan interface{})}
type Done struct {
	done_chan chan interface{}
	is_done   bool
}

var (
	clients                             sync.Map // 各ユーザーのウェブソケットのコネクションを保持するスレッドセーフな辞書
	ok                                  bool
	ACTION_EMPLOYEE_RECORD_TO_REPO      chan models.ActionDTO[models.EmployeeRecord]
	BROADCAST_TO_ACTION_EMPLOYEE_RECORD chan models.ActionDTO[models.EmployeeRecord]

	BROADCAST_ACTION_TIME_RECORD chan models.ActionDTO[models.TimeRecord]
	ACTION_TIME_RECORD_TO_REPO   chan models.ActionDTO[models.TimeRecord]

	ATTENDANCE_RECORD_TO_REPO   chan models.ActionDTO[models.AttendanceRecord]
	BROADCAST_ATTENDANCE_RECORD chan models.ActionDTO[models.AttendanceRecord]

	BROADCAST_ACTION_LOCATION_RECORD chan models.ActionDTO[models.LocationRecord]
	ACTION_LOCATION_RECORD_TO_REPO   chan models.ActionDTO[models.LocationRecord]

	UPGREDER *websocket.Upgrader
)

func init() {
	log.Println("ウェブソケットの初期化開始")
	WebSocketStartUp()
	log.Println("ウェブソケットの初期化完了")
}

func WebSocketStartUp() {

	BROADCAST_TO_ACTION_EMPLOYEE_RECORD, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.EmployeeRecord]]("SENDER_ACTION_EMPLOYEE_RECORD")
	ACTION_EMPLOYEE_RECORD_TO_REPO, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.EmployeeRecord]]("RECIVER_ACTION_EMPLOYEE_RECORD")
	BROADCAST_ACTION_TIME_RECORD, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.TimeRecord]]("SENDER_ACTION_TIME_RECORD")
	ACTION_TIME_RECORD_TO_REPO, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.TimeRecord]]("RECIVER_ACTION_TIME_RECORD")
	BROADCAST_ATTENDANCE_RECORD, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.AttendanceRecord]]("SENDER_ACTION_ATTENDANCE_RECORD")
	ATTENDANCE_RECORD_TO_REPO, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.AttendanceRecord]]("RECIVER_ACTION_ATTENDANCE_RECORD")
	BROADCAST_ACTION_LOCATION_RECORD, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.LocationRecord]]("SENDER_ACTION_LOCATION_RECORD")
	ACTION_LOCATION_RECORD_TO_REPO, _ = models.FetchChannele_TypeIs[models.ActionDTO[models.LocationRecord]]("RECIVER_ACTION_LOCATION_RECORD")

	go ActionBroadCastFanIn(
		BROADCAST_ACTION_TIME_RECORD,
		BROADCAST_ATTENDANCE_RECORD,
		BROADCAST_ACTION_LOCATION_RECORD,
		BROADCAST_TO_ACTION_EMPLOYEE_RECORD,
	)

	UPGREDER = &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // 一時的にすべてのオリジンを許可
		}}
}

func SendActionDTO[ModelType any](toRepositoryChan chan models.ActionDTO[ModelType], map_msgAction map[string]any) {
	// any型のPayloadをアサーションしてModelType型に変換し、ActionDTO[ModelType]型に変換する
	// websocketのメッセージをパースしてchannelに送信
	json_msgAction, err := json.Marshal(map_msgAction)
	if err != nil {
		log.Println("ウェブソケットのメッセージパース失敗 json", err.Error())
		return
	}

	var msgAction models.ActionDTO[ModelType]
	err = json.Unmarshal(json_msgAction, &msgAction)
	if err != nil {
		log.Println("ウェブソケットのメッセージパース失敗 json", err.Error())
		return
	}

	toRepositoryChan <- msgAction

}

func ActionWebSocketHandler(c echo.Context) error {

	if !websocket.IsWebSocketUpgrade(c.Request()) {
		log.Println("ウェブソケットのコネクション開始失敗", "Not a WebSocket upgrade request")
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	ws, err := UPGREDER.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Println("ウェブソケットのコネクション開始失敗", err.Error())
		log.Println(err)
		return err
	}

	done_chan := make(chan interface{}) //done_chanを定義
	clients.Store(ws, &Done{done_chan: done_chan, is_done: false})

	defer func() {
		log.Println("ウェブソケットのコネクション終了")
		clients.Delete(ws)
		close(done_chan)
		ws.Close()
	}()

	var msgAction map[string]any
	// 受信のループ
	for {
		select {
		case <-done_chan: // 送信側で配信できなかった場合の終了フラグ
			log.Println("ウェブソケットのコネクション終了")
			return nil
		default:
			err := ws.ReadJSON(&msgAction)
			if err != nil {
				log.Println("ウェブソケットのメッセージ受信失敗")
				return err
			}

			switch msgAction["Action"] {
			case "EMPLOYEE_RECORD/UPDATE", "EMPLOYEE_RECORD/DELETE":
				SendActionDTO[models.EmployeeRecord](ACTION_EMPLOYEE_RECORD_TO_REPO, msgAction)
			case "ATTENDANCE_RECORD/UPDATE", "ATTENDANCE_RECORD/DELETE":
				SendActionDTO[models.AttendanceRecord](ATTENDANCE_RECORD_TO_REPO, msgAction)
			case "TIME_RECORD/UPDATE", "TIME_RECORD/DELETE":
				SendActionDTO[models.TimeRecord](ACTION_TIME_RECORD_TO_REPO, msgAction)
			case "LOCATION_RECORD/UPDATE", "LOCATION_RECORD/DELETE":
				SendActionDTO[models.LocationRecord](ACTION_LOCATION_RECORD_TO_REPO, msgAction)
			default:
				log.Printf("不明なActionDTOが送信されました。Action: %v", msgAction)
			}

		}
	}
}

// ブロードキャスト専用の関数
func BroadCast[T models.TimeRecord | models.AttendanceRecord | models.EmployeeRecord | models.LocationRecord](msg_action_dto models.ActionDTO[T]) {
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
	LocationRecordActionBroadCast <-chan models.ActionDTO[models.LocationRecord],
	EmployeeRecordActionBroadCast <-chan models.ActionDTO[models.EmployeeRecord],
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
				log.Println("勤怠時間レコードのブロードキャストチャンネルが閉じた")
				continue
			}
			BroadCast[models.TimeRecord](msgAction)
		case msgAction, ok := <-AttendacneActionBroadCast:
			if !ok {
				log.Println("勤怠レコードのブロードキャストチャンネルが閉じた")
				continue
			}
			BroadCast[models.AttendanceRecord](msgAction)
		case msgAction, ok := <-LocationRecordActionBroadCast:
			if !ok {
				log.Println("位置レコードのブロードキャストチャンネルが閉じた")
				continue
			}
			BroadCast[models.LocationRecord](msgAction)
		case msgAction, ok := <-EmployeeRecordActionBroadCast:
			if !ok {
				log.Println("社員レコードのブロードキャストチャンネルが閉じた")
				continue
			}
			BroadCast[models.EmployeeRecord](msgAction)
		}

	}

}
