package server

import (
	"backend-app/server/models"
	"backend-app/server/controls"
	"sync"	
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)


//ミドルウェアの設定
func SetMiddleware(e *echo.Echo) {
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORSミドルウェアの設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://yourdomain.com"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	// JWT認証ミドルウェアの設定
	e.Use(middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey: []byte("your-secret-key"),
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

}


func NewServer() *echo.Echo {
	// echoサーバーを新規作製。
	e := &echo.New()

	//各種ミドルウェアを設定する。
	SetMiddleware(e)
	//各種エンドポイントの設定を行う
	controls.SetupHandlers(e)
	return e
}


