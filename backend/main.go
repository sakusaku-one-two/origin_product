package main

import (
	//websocketのサポート
	//エコーサーバーの構築
	"backend-app/server"
)

//エントリーポイント　詳細はserver ディレクトリにmodelやcontrollerを集約

func main() {
	// utcNow := time.Now().UTC()
	// jst, err := time.LoadLocation("Asia/Tokyo")
	// if err != nil {

	// }
	// ja_time := utcNow(jst)
	e := server.NewServer()
	e.Logger.Fatal(e.Start(":8080"))
}
