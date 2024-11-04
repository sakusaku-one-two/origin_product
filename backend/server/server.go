package server

import (
	"backend-app/server/models"
	"backend-app/server/controls"
	"sync"	
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)






func NewServer() *echo.Echo {
	e := &echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/islogin", func(c echo.Context) error {
		cokie,err := c.Cookie("auth_password")

		return c.JSONResponse({state:fasle})
	})
	
	e.GET("/importCsv",controls.CsvImport)
	
	return e
}

