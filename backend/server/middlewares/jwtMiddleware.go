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
		Skipper: func(c echo.Context) bool {//このミドルウェアをスキップするか判定
			//ログインルートをスキップ
			if c.Path() == "/login" && c.Request().Method == http.MethodPost {
				return true
			}
			return false
		},
		SuccessHandler:func (c echo.Context) {//トークンの検証が成功したら実行される
			//トークンからクレームを取得
			cookie,err := c.Cookie("jwt")
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing token"})
			}

			//トークンを検証
			token,err := jwt.Parse(cookei.Value,func(token *jwt.Token) (interface{},error) {
				return SECRET_KEY,nil
			})

			if err != nil || !token.Valid {
				return 	c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
			}

			//トークンからクレームを取得
			claims ,ok := token.Claims.(jwt.MapClaims)
			if !ok {
				c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid claims"})
				return
			}
			//userIDを取得
			userID,ok := claims["userID"].(string)
			if !ok {
				c.JSON(http.StatusUnauthorized,map[string]string{"error":"Invalid userID"})
			}

			c.Set(USER_CONTEXT_KEY,userID)
		},
		ErrorHandlerWithContext:func(err error,c echo.Context) error {
			//トークンの検証に失敗した場合のエラーハンドリング
			return c.JSON(http.StatusUnauthorized,map[string]string{"error":"Invaild or missing token"})
		}
	})
}