package bom_delete

import (
	"encoding/csv"
	"fmt"
	"os"
	"testing"
)

const (
	file_URL = ""
)

func getBomCsv() []byte {

	file, err := os.Open(file_URL)
	if err != nil {
		return []byte{}
	}
	defer file.Close()

	data := csv.NewReader(file)
	data.FieldsPerRecord = -1    // フィールド数を制限しない
	data.TrimLeadingSpace = true // 前後の空白をトリムする
	data.LazyQuotes = true       // レイジークオートを有効にする
	data.ReuseRecord = true      // レコードを再利用する
	data.Comma = ','             // 区切り文字をカンマに設定する

	records, err := data.ReadAll()

	if err != nil {
		fmt.Println("CSVの読み込みに失敗しました:", err)
		return []byte{}
	}

	return []byte(records[0][0]) // BOM
}

func TestRemoveBOM(t *testing.T) {
	bom := []byte{0xEF, 0xBB, 0xBF} // BOM
	dataWithBOM := append(bom, []byte("Hello, World!")...)
	dataWithoutBOM := []byte("Hello, World!")

	// BOMを削除する関数を呼び出す
	result := RemoveBOM(dataWithBOM)

	// 結果が期待通りであることを確認する
	if string(result) != string(dataWithoutBOM) {
		t.Errorf("Expected %s, but got %s", dataWithoutBOM, result)
	}
}

func TestReadFile(t *testing.T) {
	file, err := os.Open(file_URL)
	if err != nil {
		t.Fatalf("Failed to open file: %v", err)
	}
	defer file.Close()

	data := make([]byte, 1024) // 読み込むバッファを作成
	n, err := file.Read(data)
	if err != nil {
		t.Fatalf("Failed to read file: %v", err)
	}

	fmt.Printf("Read %d bytes: %s\n", n, string(data[:n]))
}
