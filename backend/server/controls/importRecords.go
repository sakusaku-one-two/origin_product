package controls

import (
	"backend-app/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ImportRecordsRequest struct {
	ManageIDs []uint `json:"manage_ids"`
}

type ImportRecrodsResponse struct {
	Attendances []models.AttendanceRecord `json:"attendances"`
}

func ImportRecordsHandler(c echo.Context) error {
	var req ImportRecordsRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	attendances := []models.AttendanceRecord{}
	err := models.NewQuerySession().Transaction(func(tx *gorm.DB) error {
		err := tx.Model(&models.AttendanceRecord{}).Preload("Emp").Preload("Location").Preload("Post").Where("ManageID IN (?)", req.ManageIDs).Find(&attendances).Error

		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	if len(attendances) == 0 {

		go func() {
			time.Sleep(3 * time.Second)
			for _, record := range attendances {
				models.ATTENDANCE_RECORD_REPOSITORY.Sender <- models.ActionDTO[models.AttendanceRecord]{
					Action:  "ATTENDANCE_REOCORD_UPDATE",
					Payload: &record,
				}
			}
		}()

	}

	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})

}
