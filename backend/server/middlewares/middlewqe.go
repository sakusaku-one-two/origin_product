package middlewares

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func SetUpMiddlewares(e *echo.Echo) {
	//ミドルウェアの設定を行う関数
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORSミドルウェアの設定
	// CORSミドルウェアの設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		// 許可するオリジンを環境変数から取得
		AllowOrigins: []string{os.Getenv("AllowOrigin")},
		// 許可するHTTPメソッドを指定
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		// 許可するHTTPヘッダーを指定
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		// 認証情報の共有を許可
		AllowCredentials: false, // AllowCredentialsは、クッキーや認証ヘッダーなどの認証情報をリクエストに含めることを許可する設定です。例えば、家の鍵を持っている人だけが家に入れるように、特定の情報を持っている人だけがアクセスできるようにするイメージです。
	}))

	// その他のミドルウェア
	e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
		XSSProtection:         "1; mode=block",
		ContentTypeNosniff:    "nosniff",
		XFrameOptions:         "SAMEORIGIN",
		HSTSMaxAge:            31536000,
		HSTSExcludeSubdomains: false,
		ContentSecurityPolicy: "default-src 'self';connect-src 'self' wss://api.wss/sync;",
	}))

	e.Use(middleware.BodyLimitWithConfig(middleware.BodyLimitConfig{
		Limit: "2G",
	}))

	e.Use(JWTMiddleware()) //JWTでUser情報を格納
}
