package main

import (

	//websocketのサポート
	//エコーサーバーの構築
	"backend-app/server"
	"os"
)

//エントリーポイント　詳細はserver ディレクトリにmodelやcontrollerを集約

func main() {
	e := server.NewServer()
	e.Start(os.Getenv("AllowOrigin"))
}
