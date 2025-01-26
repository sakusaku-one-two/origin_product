package controls

import (
	"github.com/labstack/echo/v4"
)

// server.goから呼び出して設定済みのechoにhttpハンドラーを追加していく
func SetupHandlers(e *echo.Echo) *echo.Echo {


	//{ CSV関連のAPI 
	e.POST("/Csvcheck", CsvImportHandler)          //CSV確認用のエンドポイント　各種構造体に変換し既存のレコード構造体と重複や相異を返却
	e.POST("/InsertRecords", InsertRecordsHandler) //CSVのデータとDBとの相違確認が完了して、登録するJSONデータを受け取るエンドポイント
	//}
	
	e.POST("/login", LoginHandler)                 // パスワードをjwtにしてセッションクッキーの中に格納。
	e.POST("/logout", LogoutHandler)               //セッション内にあるJWTを削除し、DBのログインステータスをfalseに変更
	e.POST("/createUser", CreateUser)              //ユーザーの作成
	e.POST("/employeeList", EmployeeListHandler)   //隊員一覧の取得
	e.POST("/import", ImportRecordsHandler) //時間レコードから社員や勤怠のレコードが見つからなかった場合、取得するためのAPI
	//GET
	e.GET("/sync", ActionWebSocketHandler) //ウェブソケット用のアップグレード用のエンドポイント
	e.GET("/health", HealthCheckHandler)   //ヘルスチェック用のエンドポイント
	e.GET("/logRecord", LogRecordHandler)
	
	return e
}
