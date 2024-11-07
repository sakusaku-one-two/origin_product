package controls

//　CSVファイルの読み込みに関するファイル

import (
	"backend-app/server/models"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"fmt"
	"encoding/csv"
	"errors"
	"github.com/labstack/echo/v4"
	"net/http"
	"strings"
)

//CSVファイルのインポート
func CsvImportHandler(c echo.Context) error {

	var import_csv,err := c.FormValue("import_csv"); err != nil {
		return c.String(http.StatusBadRequest, "csv file not found")
	}

	return nil
}

func validateCSV(data string) (bool,string,) {
	//csvReaderを作製
	reader := csv.NewReader(strings.NewReader(data))

	//ヘッダーを読み込む
	headers,err := reader.Read()
	if err != nil {
		return false,"failed to read CSV headers"
	}

	//必要なヘッダーを定義する。
	reqireHeaders := []string{"Column1","Column2","Column3"}//必要なヘッダー名を指定
	for _ , reqireHeader := range reqireHeaders{
		if !contains(headers,reqireHeader){
			return false,"missing reqired header:" + reqireHeader
		}
	}
	//必要なヘッダーを読み込む
}

func contains(slice []string,item string) bool {
	
	for _,v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

func saveCSVToDB(data string) error {
	//csvリーダーを作製
	reader := csv.NewReader(strings.NewReader(data))
	//ヘッダー行の列数と列名の対象表を作製
	HeaderDict := make(map[string]int)
	//ヘッダーを読み飛ばす

	if header , err := reader.Read();err != nil {
		return err
	}

	for i := 0;i < len(header);i++ {
		HeaderDict[header[i]] = i
	}

	var Attendance_records []models.AttendanceRecord
	var Time_records []models.TimeRecord



}

func To_TimeRecord(header map[string]int,data string) ([]models.TimeRecord,error) {
	
}

func To_AttendanceRecord() ([]models.AttendanceRecord,error) {

}

