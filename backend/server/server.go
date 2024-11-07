package server

import (
	"backend-app/server/models"
	"backend-app/server/controls"
	"backend-app/server/middlwares"
	"sync"	
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)


//ミドルウェアの設定
func SetMiddleware(e *echo.Echo) {
	
}


func NewServer() *echo.Echo {
	// echoサーバーを新規作製。
	e := &echo.New()

	//各種ミドルウェアを設定する。
	middlewares.SetMiddleware(e)
	//各種エンドポイントの設定を行う
	controls.SetupHandlers(e)
	return e
}


