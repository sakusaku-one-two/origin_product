package controls

import (
	"backend-app/server/models"

	"github.com/labstack/echo/v4"
)

type User = models.User

var (
	DB := models
)

func LoginHandler(c echo.Context) error {
	//josnからパスワードとIDを取り出す。
	// 該当するユーザを探す。

	// 該当したらユーザー情報を返し、JWTでパスワードとIDをセッションに格納する。
	return nil
}
