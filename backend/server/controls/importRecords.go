package controls

import (
	"backend-app/server/models"
	"fmt"
	"net/http"

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

		fmt.Println("ImportRecordsHandlerで、バインドエラー", err, req)
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	attendances := []models.AttendanceRecord{}
	err := models.NewQuerySession().Transaction(func(tx *gorm.DB) error {
		err := tx.Preload("Emp").Preload("Location").Preload("Post").Where("manage_id IN (?)", req.ManageIDs).Find(&attendances).Error

		if err != nil {

			return err
		}
		return nil
	})

	fmt.Println("attendances", attendances)

	if err != nil {
		fmt.Println("ImportRecordsHandlerで、エラー", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	if len(attendances) != 0 {

		go func() {

			for _, record := range attendances {
				fmt.Println("存在しないレコードを送信", record)
				models.ATTENDANCE_RECORD_REPOSITORY.Sender <- models.ActionDTO[models.AttendanceRecord]{
					Action:  "ATTENDANCE_REOCORD_UPDATE",
					Payload: &record,
				}
			}
			fmt.Println("attendances", attendances)
		}()

	}

	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})

}
