package controls

import (
	"bufio"
	"io"
	"unicode"

	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

type EncodingType int

const (
	SIHFT_JIS EncodingType = iota
	UTF_16
	UTF_8
)

func isDomCsv(reader io.Reader) (bool, error) {
	return false, nil
}

// DOMを削除
func removeDOM(records [][]string) [][]string {
	if len(records) > 0 && len(records[0]) > 0 && records[0][0] == "DOM" {
		return records[1:]
	}
	return records
}

// エンコーディングの型を調べる
func detectEncodingType(r io.Reader) (io.Reader, string, error) {
	buf := bufio.NewReader(r)
	b_data, err := buf.Peek()
	if err != nil {
		return nil, "", err
	}

	if isUTF16(b_data) {
		// UTF-16
		return transform.NewReader(buf, unicode.UTF16(unicode.LittleEndian, unicode.ExpectBOM).NewDecoder()), "UTF-16", nil
	}

	if isShiftJis(b_data) {
		//SIFT JIS
		return trannsform.NewReader(buf, unicode), "Siftjis", nil
	}

}

// UTF16か判定する関数
func isUTF16(data []byte) bool {
	return false
}

// シフトJISか判定する関数
func isShiftJis(data []byte) bool {
	return false
}
