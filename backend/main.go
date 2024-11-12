package main

import (
	"net/http"

	"github.com/gorilla/websocket" //websocketのサポート
	"github.com/labstack/echo/v4"  //エコーサーバーの構築
	"backend/server"
	"backend/server/models"

)


func main() {
 	e := server.NewServer()

	e.start()
}

