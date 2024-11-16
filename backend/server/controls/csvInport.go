package controls

//　CSVファイルの読み込みに関するファイル

import (
	"backend-app/server/models"
	"encoding/csv"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

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

type Value struct {
	Preval    any
	as_int    uint
	as_string string
	is_error  error //キャストに失敗した場合のエラーを保持
}

// factorymethod　=>　Value
func ValueInit(val any) *Value {
	created_val := &Value{
		Preval: val,
	}
	//anyを文字列にキャスト　->「 as_stringに結果を格納
	created_val.To_string()
	//as_stringを数値に変換
	created_val.To_int()

	return created_val
}

func (v *Value) To_int() {
	number, err := strconv.Atoi(v.as_string)
	if err != nil {
		v.is_error = err
		return
	}
	v.as_int = uint(number)
}

func (v *Value) To_string() {
	casted_string, ok := v.Preval.(string)
	if !ok {
		v.is_error = errors.New("文字列に変換失敗しました。")
		return
	}
	v.as_string = casted_string
}

type CsvTable struct { //CSVをプログラムで扱いやすい形にしたもの。基本的には
	header map[string]int      //列名と列数の辞書
	rows   []map[string]*Value //列名と値の辞書を配列で格納した
}

// コンストラクタ
func CreateCsVTable(reader *csv.Reader) (*CsvTable, error) {
	//最初の行
	headerRow, err := reader.Read()
	if err != nil {
		return nil, err
	}
	//ヘッダー（列名から列数のマップ）を生成
	headerMap := make(map[string]int)
	rows := []map[string]*Value{}
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
		temp_row_map := make(map[string]*Value)

		for key, val := range headerMap {
			index := val
			temp_value := ValueInit(row[index])
			if temp_value.is_error != nil {
				return nil, temp_value.is_error
			}
			temp_row_map[key] = temp_value
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
func (ct *CsvTable) To_AttendanceRecords() ([]*models.AttendanceRecord, error) {

	createToAttendacneRecord := func(row map[string]*Value) *models.AttendanceRecord {
		time_records, err := CreateTimeRecord(row)
		if err != nil {
			return nil
		}
		return &models.AttendanceRecord{
			ManageID:   row["管制番号"].as_int, //これが基本となる値。
			EmpID:      row["社員番号"].as_int,
			LocationID: row["配置先番号"].as_int, //

			TimeRecords: time_records,
		}

	}

	var result_array []*models.AttendanceRecord
	for _, row := range ct.rows {
		result_array = append(result_array, createToAttendacneRecord(row))
	}

	return result_array, nil
}

// 管制日付から最小日と最大日を返す
func (ct *CsvTable) TimeSpan() (time.Time, time.Time) {
	var tmp_time time.Time
	var max_time time.Time = time.Time{} //仮の初期値
	var min_time time.Time = time.Time{} //仮の初期値

	for _, row := range ct.rows {
		tmp_time = CreateStartTime(row) //とりあえず勤務開始日時に変換したのを格納

		if tmp_time.Before(max_time) {
			max_time = tmp_time
			continue
		}

		if tmp_time.After(min_time) {
			min_time = tmp_time
			continue
		}
	}

	return min_time, max_time
}

type ReturnJson struct {
	IsLeft           bool                      //再確認が必要かのフラグ
	RemainingRecords []models.AttendanceRecord // 再確認用のレコード
	DuplicateRecords []models.AttendanceRecord //重複したのと同一IDのDB内に既にあるレコード
	MaintainRecords  []models.AttendanceRecord //フロントエンドで利用するデータ
}

// CSVファイルのインポート
func CsvImportHandler(c echo.Context) error {

	import_csv := c.FormValue("import_csv")
	if import_csv == "" {
		return c.String(http.StatusBadRequest, "csv file not found")
	}

	reader := csv.NewReader(strings.NewReader(import_csv))

	csv_table, value_error := CreateCsVTable(reader)
	if value_error != nil {
		return c.String(http.StatusBadRequest, "CSVの値に問題があります。確認してくださ。")
	}

	//CSVを確認し、
	missingColumns, ok := csv_table.checkReqireColmuns()
	if !ok { //JSONで足りない列を配列で返す。
		return c.JSON(http.StatusBadRequest, missingColumns)

	}
	//以下　列名と値に問題ないと判断されたブロック

	//この関数の返り値はReturnJson
	reuslt := UpdateAttendanceTable(csv_table)
	c.JSON(http.StatusOK, *reuslt)
	return nil
}

// --------------------------------------[以下一旦保護]-------------------------

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
