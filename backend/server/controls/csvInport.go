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


type CsvTable struct {//CSVをプログラムで扱いやすい形にしたもの。基本的には
	header map[string]int //列名と列数の辞書
	rows []map[string]string //列名と値の辞書を配列で格納した
}



func CreateCsVTable(reader csv.Reader) (*CsvTable,error){
	
	//最初の行
	headerRow,err := reader.Read()
	if err != nil {
		return 	nil,err
	}

	//ヘッダー（列名から列数のマップ）を生成
	headerMap := make(map[string]int)
	rows := make([]map[string]string)
	//ヘッダー辞書を作製
	for index,colName := range headerRow {
		headerMap[colName] = index
	}

	//全体の行のデータをgoの構造体に変換する。
	for {
		//行ごとを読み取り。エラーであればループを抜ける
		row,err := reader.Read()
		if err != nil {
			break
		}

		temp_row_map := make(map[string]string)

		for key,val := range headerMap  {		
			index := val.(int)
			temp_row_map[key] = row[index]
		}

		rows = append(rows,temp_row_map)
	}
	
	return &CsvTable{
		header:headerMap,
		rows: rows,
	},nil

}


//CSVファイルのインポート
func CsvImportHandler(c echo.Context) error {

	import_csv,err := c.FormValue("import_csv"); err != nil {
		return c.String(http.StatusBadRequest, "csv file not found")
	}

	return nil
}

//CSVリーダを返す
func CreateReader(data string) (any,error) {
	reader,err := csv.NewReader(strings.NewReader(data))
	if err != nil {
		return nil,err
	}

	return reader,nil	
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

