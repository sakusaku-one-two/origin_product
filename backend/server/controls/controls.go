package controls

import (
	"github.com/labstack/echo/v4"
)

// server.goから呼び出して設定済みのechoにhttpハンドラーを追加していく
func SetupHandlers(e *echo.Echo) *echo.Echo {

	//POSt
	e.POST("/Csvcheck", CsvImportHandler)          //CSV確認用のエンドポイント　各種構造体に変換し既存のレコード構造体と重複や相異を返却
	e.POST("/InsertRecords", InsertRecordsHandler) //CSVのデータとDBとの相違確認が完了して、登録するJSONデータを受け取るエンドポイント
	e.POST("/login", LoginHandler)                 // パスワードをjwtにしてセッションクッキーの中に格納。
	e.POST("/logout", LogoutHandler)               //セッション内にあるJWTを削除し、DBのログインステータスをfalseに変更

	//GET
	e.GET("/sync", ActionWebSocketHandler) //ウェブソケット用のアップグレード用のエンドポイント

	return e
}
