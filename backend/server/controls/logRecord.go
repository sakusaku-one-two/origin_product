package controls

import (
	"backend-app/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type LogRecordReq struct {
	endDate time.Time `json:"endDate"`
}




func LogRecordHandler(c echo.Context) error {
	req := new(LogRecordReq)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	var logRecords []models.AttendanceRecord
	err := models.NewQuerySession().Transaction(func(tx *gorm.DB) error {
		err :=tx.Preload("Emp").Preload("TimeRecord","planTime >= ?", req.endDate).Preload("Location").Preload("Client").Find(&logRecords).Error
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch log records"})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"reocrds": logRecords})
}
