package main

import (
	//websocketのサポート
	//エコーサーバーの構築
	"backend-app/server"
)

//エントリーポイント　詳細はserver ディレクトリにmodelやcontrollerを集約

func main() {
	e := server.NewServer()
	e.Logger.Fatal(e.Start(":8080"))
}
