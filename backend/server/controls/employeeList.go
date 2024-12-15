package controls

import (
	"backend-app/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type EmployeeListRequest struct {
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

// 隊員一覧の取得
func EmployeeListHandler(c echo.Context) error {
	request := new(EmployeeListRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}
	var employeeList []models.EmployeeRecord
	if err := models.NewQuerySession().Transaction(func(tx *gorm.DB) error {
		temp_record := []models.AttendanceRecord{}
		if err := tx.Model(&models.AttendanceRecord{}).Preload("Emp").Where("created_at >= ? AND created_at <= ?", request.StartDate, request.EndDate).Find(&temp_record).Error; err != nil {
			return err
		}
		// 社員を取得
		for _, record := range temp_record {
			employeeList = append(employeeList, record.Emp)
		}
		//  重複を削除
		result := []models.EmployeeRecord{}
		for _, record := range employeeList {
			flag := true
			for _, reuslt_record := range result {
				if reuslt_record.EmpID == record.EmpID {
					flag = false
					break
				}
			}
			if flag {
				result = append(result, record)
			}
		}
		employeeList = result
		return nil
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to get employee list"})
	}
	return c.JSON(http.StatusOK, employeeList)
}
