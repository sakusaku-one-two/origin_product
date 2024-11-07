package middlewares

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
)

var SECRET_KEY = []byte(os.Getenv("JWT_SECRET_KEY"))
var USER_CONTEXT_KEY = "User"

func JWTMiddleware() echo.MiddlewareFunc {
	return middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey: SECRET_KEY,
		SuccessHandler:func (c echo.Context) {
			//トークンからクレームを取得
			user,ok := c.Get("user").(*jwt.Token)
			if ok != nil {
				return
			}
			claims := user.Claims.(jwt.MapClaims)
			// ユーザーIDをクレームから取得
			userID := claims["userID"].(string)			
			//ユーザー情報をコンテキストに格納
			c.Set(USER_CONTEXT_KEY,userID)
		},
		ErrorHandlerWithContext:func(err error,c echo.Context) error {
			//トークンの検証に失敗した場合のエラーハンドリング
			return c.JSON(http.StatusUnauthorized,map[string]string{"error":"Invaild or missing token"})
		}
	})
}