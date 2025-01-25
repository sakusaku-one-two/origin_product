package controls

import (
	"backend-app/server/middlewares"
	"backend-app/server/models"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func LogoutHandler(c echo.Context) error {

	//クッキーを削除
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.SameSite = http.SameSiteNoneMode
	cookie.Expires = time.Now().AddDate(0, 0, -1)
	c.SetCookie(cookie)
	userID := c.Get(middlewares.USER_CONTEXT_KEY).(string)
	int_userID, err := strconv.Atoi(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ユーザーIDを取得できませんでした")
	}
	//DBのUserを更新
	var user models.User
	if err := models.NewQuerySession().Transaction(func(session *gorm.DB) error {
		session.Where("id = ?", int_userID).First(&user)
		user.IsLogin = false
		session.Save(&user)
		return nil
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, "ユーザーを更新できませんでした")
	}
	go func() {
		time.Sleep(5 * time.Second)
		UserLogout(userID)
	}()

	return c.JSON(http.StatusOK, map[string]string{"message": "ログアウトに成功しました"})
}
