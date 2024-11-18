package models

import (
	"sync"
)

/*
	recordデータのキャッシュ
	追加と同時にDBに保存する。

*/

type RecordsCache[ModelType any] struct {
	Map sync.Map
}

// キャッシュに登録とDBに保存両方行う
func (rc *RecordsCache[ModelType]) loadAndSave(id uint, targetData *ModelType) error {
	_, IsLoaded := rc.Map.LoadOrStore(id, targetData)
	newQuery := NewQuerySession().Begin()

	defer func() {
		if r := recover(); r != nil {
			rc.Map.Delete(id)
			newQuery.Rollback()
		}
	}()

	if IsLoaded {

		if err := newQuery.Save(targetData).Error; err != nil {
			newQuery.Rollback()
			rc.Map.Delete(id)
			return err
		}

		newQuery.Commit()
	}
	return nil
}

func (rc *RecordsCache[ModelType]) getValue(id uint) (*ModelType, bool) {
	fetchedValue, ok := rc.Map.Load(id)
	if !ok {
		return nil, false
	}

	result, ok := fetchedValue.(*ModelType)
	if !ok {
		return nil, false
	}
	return result, true
}

func (rc *RecordsCache[ModelType]) Delete(id uint) bool {
	targetModel, ok := rc.getValue(id)
	if !ok {
		return false
	}
	NewQuerySession().Delete(targetModel)
	rc.Map.Delete(id)
	return true
}
