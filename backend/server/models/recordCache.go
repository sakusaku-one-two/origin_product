package models

import (
	"errors"
	"log"
	"sync"

	"gorm.io/gorm"
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
	return NewQuerySession().Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(targetData).Error; err != nil {
			rc.Map.Delete(id)
			return err
		}
		return nil
	})
}

type GetId[ModleType any, ReturnType any] func(target *ModleType) (ReturnType, bool)

// 複数のデータをキャッシュに登録と同時にDBに保存する
func (rc *RecordsCache[ModelType]) InsertMany(payloadArray []*ModelType, fetchId GetId[ModelType, uint]) error {

	return NewQuerySession().Transaction(func(tx *gorm.DB) error {

		if err := tx.Save(payloadArray).Error; err != nil {
			return err
		}

		for _, payload := range payloadArray {
			id, ok := fetchId(payload)
			if !ok {
				return errors.New("failed to fetch ID for payload")
			}
			rc.Map.Store(id, payload)
		}

		return nil
	})
}

// キャッシュからデータを取得
func (rc *RecordsCache[ModelType]) Load(id uint) (*ModelType, bool) {
	return rc.getValue(id)
}

func (rc *RecordsCache[ModelType]) Exists(id uint) bool {
	_, ok := rc.getValue(id)
	return ok
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
	err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(targetModel).Error; err != nil {
			return err
		}
		rc.Map.Delete(id)
		return nil
	})

	return err == nil
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

func (rc *RecordsCache[ModelType]) Dump() []ModelType {
	result := []ModelType{}
	rc.Map.Range(func(key, value any) bool {
		result = append(result, *value.(*ModelType))
		return true
	})
	log.Println("len(result)", len(result))
	return result
}

func (rc *RecordsCache[ModelType]) Len() int {
	count := 0
	rc.Map.Range(func(key, value any) bool {
		count++
		return true
	})
	return count
}
