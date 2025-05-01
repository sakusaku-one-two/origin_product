package controls

import (
	"backend-app/server/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

// 隊員一覧の取得
func EmployeeListHandler(c echo.Context) error {
	emps := models.EMPLOYEE_RECORD_REPOSITORY.Cache.Dump()
	return c.JSON(http.StatusOK, emps)
}

// 社員の更新
type RequestDataForEmployee struct {
	EmployeeRecord models.EmployeeRecord
}

func UpdateEmployeeHandler(c echo.Context) error {
	var requestData RequestDataForEmployee
	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	// 直接 EmployeeRecord を Insert 関数に渡す
	_, err := models.EMPLOYEE_RECORD_REPOSITORY.Cache.Insert(requestData.EmployeeRecord.EmpID, &requestData.EmployeeRecord)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, "社員の更新が完了しました。")
}
