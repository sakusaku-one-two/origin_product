package background

import (
	"backend/server/models"
	"sync"
)

var (
	tasks      sync.Map
	tasksMutex sync.Mutex
)

func addTask(taskType string, task models.ManageRecord) {

}
