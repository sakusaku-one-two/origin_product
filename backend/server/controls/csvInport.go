package controls

//　CSVファイルの読み込みに関するファイル

import (
	"backend-app/server/models"
	"encoding/csv"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

/*
	REQUIRE_COL_NAMESはCSVファイルの中で必須の列名を含んだ配列。
	この要素が最低限ない場合はDBに格納できない
*/

var (
	REQUIRE_COL_NAMES = []string{"管制番号",
		"支店コード", "管制日付", "得意先正式名称", "配置先支店コード",
		"配置先正式名称", "隊員番号", "勤務番号", "勤務形態正式名称",
		"基本開始時間", "基本終了時間", "報告開始時間", "報告終了時間", "得意先番号", "隊員名",
		"配置先番号"}
)

type CsvTable struct { //CSVをプログラムで扱いやすい形にしたもの。基本的には
	header map[string]int      //列名と列数の辞書
	rows   []map[string]string //列名と値の辞書を配列で格納した
}

// コンストラクタ
func CreateCsVTable(reader csv.Reader) (*CsvTable, error) {
	//最初の行
	headerRow, err := reader.Read()
	if err != nil {
		return nil, err
	}
	//ヘッダー（列名から列数のマップ）を生成
	headerMap := make(map[string]int)
	rows := []map[string]string{}
	//ヘッダー辞書を作製
	for index, colName := range headerRow {
		headerMap[colName] = index
	}

	//全体の行のデータをgoの構造体に変換する。
	for {
		//行ごとを読み取り。エラーであればループを抜ける
		row, err := reader.Read()
		if err != nil {
			break
		}
		//一時的な行を表す辞書
		temp_row_map := make(map[string]string)

		for key, val := range headerMap {
			index := val
			temp_row_map[key] = row[index]
		}
		//辞書をスライスに格納
		rows = append(rows, temp_row_map)
	}

	return &CsvTable{
		header: headerMap,
		rows:   rows,
	}, nil

}

// このCSVテーブルをDBへ登録しても問題ないか確認するメソッド
func (ct *CsvTable) checkReqireColmuns() ([]string, bool) {
	if len(ct.header) == 0 || len(ct.rows) == 0 {
		return nil, false
	}

	//列名の確認　（要件を満たす列名を保持しているかの確認）
	missingColumns := []string{}

	for _, req_col_name := range REQUIRE_COL_NAMES {
		if _, exists := ct.header[req_col_name]; !exists {
			missingColumns = append(missingColumns, req_col_name)
		}
	}

	if len(missingColumns) > 0 {
		return missingColumns, false
	}

	//成功
	return nil, true
}

// このメソッドを実行すると,個別に勤怠データーとして登録できる構造体に変換する。
func (ct *Csvtable) To_AttendanceRecords() ([]*models.AttendanceRecord, error) {

	createToAttendacneRecord := func(row map[string]string) *models.AttendanceRecord {
		//rowからTimeRecordを作製する

		to_int := func(number string) int {
			num, err := strconv.Atoi(number)
			if err != nil {
				return 0
			}
			return num
		}

		//まだ初期値の入れる値が不確定なので、一旦保留
		return &models.AttendanceRecord{
			ManageID:   manage_id, //これが基本となる値。
			EmpID:      row["社員番号"],
			LocationID: row["配置先番号"], //

			TimeRecords: models.createToTimeRecords(row, manage_id),
		}

	}

	var result_array []*models.AttendanceRecord
	for _, row := range ct.rows {
		result_array = append(result_array, createToAttendacneRecord(row))
	}

	return result_array, nil

}

// CSVファイルのインポート
func CsvImportHandler(c echo.Context) error {

	import_csv := c.FormValue("import_csv")
	if import_csv == "" {
		return c.String(http.StatusBadRequest, "csv file not found")
	}

	//CSVを確認し、
	missingColumns, isok := CheckReqireColumns(import_csv)
	if !isok { //JSONで足りない列を配列で返す。
		return c.JSON(http.StatusBadRequest, missingColumns)
	}

	return nil
}

func validateCSV(data string) (bool, string) {
	//csvReaderを作製
	reader := csv.NewReader(strings.NewReader(data))
	//ヘッダーを読み込む
	headers, err := reader.Read()
	if err != nil {
		return false, "failed to read CSV headers"
	}

	//必要なヘッダーを定義する。
	reqireHeaders := []string{"Column1", "Column2", "Column3"} //必要なヘッダー名を指定
	for _, reqireHeader := range reqireHeaders {
		if !contains(headers, reqireHeader) {
			return false, "missing reqired header:" + reqireHeader
		}
	}
	//必要なヘッダーを読み込む
}

func contains(slice []string, item string) bool {

	for _, v := range slice {
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

	if header, err := reader.Read(); err != nil {
		return err
	}

	for i := 0; i < len(header); i++ {
		HeaderDict[header[i]] = i
	}

	var Attendance_records []models.AttendanceRecord
	var Time_records []models.TimeRecord

}
