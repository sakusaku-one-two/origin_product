package server

import (
	"backend-app/server/controls"
	"backend-app/server/middlewares"

	"github.com/labstack/echo/v4"
)

func NewServer() *echo.Echo {
	// echoサーバーを新規作製。
	e := echo.New()
	//各種エンドポイントの設定を行う
	controls.SetupHandlers(e)
	//各種ミドルウェアを設定する。
	middlewares.SetUpMiddlewares(e)

	return e
}
