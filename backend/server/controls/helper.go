package controls

import (
	"github.com/labstack/echo/v4"
)

func IsLogined(c echo.Content) (bool, error) {
	//クッキーを取得
	jwt ,err := c.Cookie("auth_jwt")
	if err != nil {
		return false,err
	}

	//以下ｊｗｔを確認する

}


func 