package bom_delete

import (
	"bytes"
)

var (
	bom = []byte{0xEF, 0xBB, 0xBF} // BOM
	// BOMはUTF-8のバイトオーダーマークで、UTF-8エンコーディングを示すために使用される
	// BOMは通常、テキストファイルの先頭に配置される
)

func RemoveBOM(data []byte) []byte {
	if bytes.HasPrefix(data, bom) {
		return data[len(bom):] // BOMを削除
	}
	return data
}
