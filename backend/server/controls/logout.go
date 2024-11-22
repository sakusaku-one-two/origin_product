package controls

import (
	"backend-app/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func Logout(c echo.Context) error {

	//クッキーを削除
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.Expires = time.Now().AddDate(0, 0, -1)
	c.SetCookie(cookie)

	//DBのUserを更新
	new_session := models.NewQuerySession()
	new_session.Begin()
	new_session.Model(&models.User{}).Where("id = ?", c.Get("user_id").(uint)).Updates(map[string]interface{}{
		"last_login": time.Now(),
		"IsLogin":    false,
	})
	new_session.Commit()
	return c.JSON(http.StatusOK, "OK")
}
