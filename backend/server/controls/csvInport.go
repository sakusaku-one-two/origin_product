package controls

//　CSVファイルの読み込みに関するファイル

import (
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"fmt"
)

//CSVファイルのインポート
func CsvImport(c echo.Context) error {



	var import_csv,err := c.FormValue("import_csvs"); err != nil {
		return c.String(http.StatusBadRequest, "csv file not found")
	}

	
	



	return nil
}