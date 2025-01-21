package middlewares

import (
	"log"
	"net/http"
	"os"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

var SECRET_KEY = []byte(os.Getenv("JWT_SECRET_KEY"))
var USER_CONTEXT_KEY = "userID"

func JWTMiddleware() echo.MiddlewareFunc {
	return echojwt.WithConfig(echojwt.Config{
		SigningKey:  SECRET_KEY,
		TokenLookup: "cookie:jwt",
		Skipper: func(c echo.Context) bool { //このミドルウェアをスキップするか判定
			//ログインルートをスキップ
			log.Println(c.Path())
			if c.Path() == "/login" && c.Request().Method == http.MethodPost {
				log.Println("ログインルートをスキップ")
				return true
			}

			// if c.Request().RequestURI == "/sync" {
			// 	log.Println("ウェブソケットのルートをスキップ")
			// 	return true
			// }
			return false
		},
		SuccessHandler: func(c echo.Context) { //トークンの検証が成功したら実行される
			log.Println("トークンの検証が成功した")
		},
		ErrorHandler: func(c echo.Context, err error) error {
			log.Println("JWTエラー", err)
			//トークンの検証に失敗した場合のエラーハンドリング
			return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
		},
	})
}
