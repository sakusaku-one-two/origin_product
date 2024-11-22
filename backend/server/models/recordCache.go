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

	rc.Map.Store(id, targetData)
	newSession := NewQuerySession()
	newSession.Begin()
	if err := newSession.Save(targetData).Error; err != nil {
		rc.Map.Delete(id)
		return err
	}

	return nil
}

type getId[ModleType any, ReturnType any] func(target *ModleType) (ReturnType, bool)

// 複数のデータをキャッシュに登録と同時にDBに保存する
func (rc *RecordsCache[ModelType]) InsertMany(payloadArray []*ModelType, fetchId getId[ModelType, uint]) error {

	new_session := NewQuerySession()
	new_tx := new_session.Begin()

	if err := new_tx.Save(payloadArray).Error; err != nil {
		new_tx.Rollback()
		return err
	}

	delete_list := []uint{}

	defer func() {
		if err := recover(); err != nil {
			new_tx.Rollback()
		}

		for _, id := range delete_list {
			rc.Map.Delete(id)
		}
	}()

	return nil

}

// キャッシュからデータを取得
func (rc *RecordsCache[ModelType]) Load(id uint) (*ModelType, bool) {
	return rc.getValue(id)
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
