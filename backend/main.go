package main

import (
	"net/http"

	"github.com/gorilla/websocket" //websocketのサポート
	"github.com/labstack/echo/v4"  //エコーサーバーの構築
	"backend/server"
	"backend/server/models"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true //オリジンのちえぇっくを取り合えスキップ　実際に使用する際には必ずせっていする。
	},
}

func main() {
	e := echo.New()

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello,World")
	})

	e.GET("/ws", wsHandler)

	e.Start(":8080")

}

func wsHandler(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	defer ws.Close()

	for {
		//メッセージを受信
		_, msg, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
			break
		}

		//メッセージの受信
		err = ws.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			c.Logger().Error(err)
			break
		}
	}
	return nil

}
