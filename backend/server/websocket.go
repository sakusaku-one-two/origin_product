package server 

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)	

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}


type 



func handleWebSocket(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	for {
		messageType, message, err := ws.ReadJSON()
		if err != nil {
			return err
		}

		err = ws.WriteMessage(messageType, message)
		if err != nil {
			
	}
	
