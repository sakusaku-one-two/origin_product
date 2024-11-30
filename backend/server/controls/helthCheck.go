package controls

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// ヘルスチェック用のエンドポイント

type HealthCheckResponse struct {
	Status string `json:"status"`
}

func HealthCheckHandler(c echo.Context) error {
	log.Println("ヘルスチェックが実行されました。")
	return c.JSON(http.StatusOK, HealthCheckResponse{Status: "OK"})
}
