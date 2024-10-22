package main

import (
	"fmt"      //	文字列を表示するためのパッケージ
	"net/http" //　HTTPサーバーを作製するためのパッケージ
	"time"
	"github.com/gorilla/websocket" //WebSocketを使うためのパッケージ
)





var upgrader = websocket.Upgrader{
	CheckOrigin: func(req *http.Request) bool { //オリジン設定を行う　現在はすべて許可
		return true
	},
}


var EmployeesStore = make(map[int]Employee) //社員を管理するグローバルマップ　キーは社員番号　仮のストア

var TasksStore = make(map[int]MainTask) //管制実績表の一行分が格納されている


var ThredTaskChannel = make(chan ThreadTask) // 一つのクライアントからおくられてきた打刻情報をごルーチン間で通信するためのチャンネル

var MainTaksChannel = make(chan MainTask) //メインタスクをごルーチン間でやり取りするためのチャンネル

var UserChannel = make(chan User) // ユーザーを管理するチャンネル


// クライアントを保存するためのマップ 　具体的にはウェブソケットのコネクションインスタンスをキーにした辞書で真偽で接続と解除を表現
var clients = make(map[*websocket.Conn]User)










func boradCasetTaskSender() {
	for {
		send_task := <- boradCasetTaskChannel
		for client,isActive := range clients {
			if isActive == true {
				client.WriteJSON(send_task)
			}
		}
	}
}


func rialTimeConecctionGorutin(writer http.ResponseWriter, req *http.Request) {
	ws, err := upgrader.Upgrade(writer, req, nil)
	if err != nil {
		// fmt.Fprint(w,"Ettot: %v",err)//エラーがあったら表示
		return
	}

	defer  ws.Close()

	clients[ws] = true



	for { //無限ループ
		//メッセージを受け取る
		var task Task 
		result := ws.ReadJSON(task)
		if result != nil {
			fmt.Println("Received: %s\n", err) //受け取ったerrを表示
			break
		}

		boradCasetTaskChannel <- result
	}
}

func main() {
	//WebSocketのエンドポイントを設定
	http.HandleFunc("ws/")
}
