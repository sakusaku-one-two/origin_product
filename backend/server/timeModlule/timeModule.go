package timeModule

import "time"

const JAPANESE_TIME_ZONE = "Asia/Tokyo"

var JAPANESE_TIME_ZONE_OFFSET, _ = time.LoadLocation(JAPANESE_TIME_ZONE)

// 日本時間に変換する
func ToJapaneseTime(time time.Time) time.Time {
	return time.In(JAPANESE_TIME_ZONE_OFFSET)
}

// 現在時間を取得する
func GetNowTimeAsJapanese() time.Time {
	return ToJapaneseTime(time.Now())
}
