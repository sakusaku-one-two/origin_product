package controls

import (
	"backend-app/server/models"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type LogRecordReq struct {
	endDate time.Time `json:"endDate"`
}

func LogRecordHandler(c echo.Context) error {
	fmt.Println("log record handler start")
	req := new(LogRecordReq)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	var logRecords []models.AttendanceRecord
	err := models.NewQuerySession().Transaction(func(tx *gorm.DB) error {
		err := tx.Preload("Emp").Preload("TimeRecords", "plan_time >= ?", req.endDate).Preload("Location").Preload("Post").Find(&logRecords).Error
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
