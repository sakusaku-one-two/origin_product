package controls

import (
	"testing"
)

func TestCreateDepartPlanTime(t *testing.T) {
	CreateDepartPlanTime(map[string]*Value{
		"配置先番号": &Value{
			Preval: "1",
		},
		"得意先番号": &Value{
			Preval: "1",
		},
		"隊員番号": &Value{
			Preval: "1",
		},
		"日付": &Value{
			Preval: "2025-01-01",
		},
		"時間": &Value{
			Preval: "10:00",
		},
	})
}

func TestCreateDepartPlanTime2(t *testing.T) {
	CreateDepartPlanTime(map[string]*Value{
		"配置先番号": &Value{
			Preval: "1",
		},
	})
}

func TestCreateDepartPlanTime3(t *testing.T) {
	CreateDepartPlanTime(map[string]*Value{
		"配置先番号": &Value{
			Preval: "1",
		},
	})
}
