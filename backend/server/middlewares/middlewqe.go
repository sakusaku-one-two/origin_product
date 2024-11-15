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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("AllowOrigin")},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	// その他のミドルウェア
	e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
		XSSProtection:         "1; mode=block",
		ContentTypeNosniff:    "nosniff",
		XFrameOptions:         "SAMEORIGIN",
		HSTSMaxAge:            31536000,
		HSTSExcludeSubdomains: false,
		ContentSecurityPolicy: "default-src 'self';",
	}))

	e.Use(JWTMiddleware()) //JWTでUser情報を格納
}
