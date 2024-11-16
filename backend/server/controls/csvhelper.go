package controls

import "time"

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
