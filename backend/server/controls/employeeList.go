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
