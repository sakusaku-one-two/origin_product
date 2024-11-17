package models

import (
	"sync"

	"gorm.io/gorm"
)

type RecordsCache[ModelType any] struct {
	Map sync.Map
}

// キャッシュに登録とDBに保存両方行う
func (rc *RecordsCache[ModelType]) loadAndSave(id uint, targetData ModelType) error {
	_, IsLoaded := rc.Map.LoadOrStore(id, targetData)
	if IsLoaded {
		newQuery := NewQuerySession()
		if err := newQuery.Save(&targetData).Error; err != nil {
			return err
		}
	}
	return nil
}

func (rc *RecordsCache[ModelType]) getValue(id uint) (*ModelType, bool) {
	fetchedValue, ok := rc.Map.Load(id)
	if !ok {
		return nil, false
	}

	result, ok := fetchedValue.(ModelType)
	if !ok {
		return nil, false
	}
	return &result, true
}

type Repository[ModelType any] struct {
	Cache     *RecordsCache[ModelType]
	BroadCast chan ActionDTO[ModelType]
	DB        *gorm.DB
}

func CreateRepositry[ModelType any](channelName string, broadcastCount int) *Repository[ModelType] {
	db := GetDB()
	broadcastChan := NewChannel_TypeIs[ActionDTO[ModelType]](channelName, broadcastCount)
	cache := &RecordsCache[ModelType]{Map: sync.Map{}}

	return &Repository[ModelType]{
		Cache:     cache,
		BroadCast: broadcastChan,
		DB:        db,
	}
}
