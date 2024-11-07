package controls

import (
	"github.com/labstack/echo/v4"
)

// server.goから呼び出して設定済みのechoにhttpハンドラーを追加していく
func SetupHandlers(e *echo.Echo) *echo.Echo {

	//POSt
	e.POST("/CsvImport", CsvImport) //CSV用のエンドポイント

	//GET
	e.GET("/realtime", ActionWebSocketHandler) //ウェブソケット用のアップグレード用のエンドポイント

}
