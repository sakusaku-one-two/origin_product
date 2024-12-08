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
			log.Println("JWTの検証成功", c.Request().RequestURI)
			log.Println(c.Request().Header)
			//トークンからクレームを取得
			// cookie, err := c.Cookie("jwt")
			// if err != nil {
			// 	c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing token"})
			// }

			// //トークンを検証
			// token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
			// 	return SECRET_KEY, nil
			// })

			// if err != nil || !token.Valid {
			// 	c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
			// 	return
			// }

			// //トークンからクレームを取得
			// claims, ok := token.Claims.(jwt.MapClaims)
			// if !ok {
			// 	c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid claims"})
			// 	return
			// }
			// //userIDを取得userID
			// userID, ok := claims["userID"].(string)
			// if !ok {
			// 	c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid userID"})
			// }
			// c.Set(USER_CONTEXT_KEY, userID)
		},
		ErrorHandler: func(c echo.Context, err error) error {
			log.Println("JWTエラー", err)
			//トークンの検証に失敗した場合のエラーハンドリング
			return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
		},
	})
}
