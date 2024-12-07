package models

import (
	"log"
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

	// キャッシュに登録
	rc.Map.Store(id, targetData)

	// DBに保存
	newSession := NewQuerySession()
	newSession.Begin()
	if err := newSession.Save(targetData).Error; err != nil {
		rc.Map.Delete(id)
		newSession.Rollback()
		return err
	}

	newSession.Commit()
	return nil
}

type GetId[ModleType any, ReturnType any] func(target *ModleType) (ReturnType, bool)

// 複数のデータをキャッシュに登録と同時にDBに保存する
func (rc *RecordsCache[ModelType]) InsertMany(payloadArray []*ModelType, fetchId GetId[ModelType, uint]) error {

	new_session := NewQuerySession()

	new_tx := new_session.Begin()

	if err := new_tx.Save(payloadArray).Error; err != nil {
		new_tx.Rollback()
		return err
	}

	insert_id_list := []uint{}
	for _, payload := range payloadArray {
		id, ok := fetchId(payload)
		if !ok {
			log.Printf("Failed to fetch ID for payload: %v", payload)
			continue
		}
		insert_id_list = append(insert_id_list, id)
		rc.Map.Store(id, payload)
	}

	defer func() {
		if err := recover(); err != nil {
			new_tx.Rollback()
		}

		for _, id := range insert_id_list {
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

// キャッシュに登録する(DBに保存する)
func (rc *RecordsCache[ModelType]) Insert(id uint, targetData *ModelType) (bool, error) {
	if _, exists := rc.Map.Load(id); exists {
		return false, nil
	}
	if err := rc.loadAndSave(id, targetData); err != nil {
		return false, err
	}
	return true, nil
}
