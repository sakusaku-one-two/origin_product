package models

import (
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
	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(targetData).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		rc.Map.Delete(id)
		return err
	}

	return nil
}

type GetId[ModleType any, ReturnType any] func(target *ModleType) (ReturnType, bool)

// 複数のデータをキャッシュに登録と同時にDBに保存する
func (rc *RecordsCache[ModelType]) InsertMany(payloadArray []*ModelType, fetchId GetId[ModelType, uint]) error {

	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {

		if err := tx.Save(payloadArray).Error; err != nil {
			log.Printf("InsertMany failed 一括と挿入に失敗しました。ロールバックします。: %v", err)
			tx.Rollback()
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	reject_records := []ModelType{}
	for _, payload := range payloadArray {
		id, ok := fetchId(payload)
		if !ok {
			log.Printf("Failed to fetch ID for payload: %v", payload)
			reject_records = append(reject_records, *payload)
			continue
		}
		rc.Map.Store(id, payload)
	}

	if len(reject_records) > 0 {
		// キャッシュから削除
		for _, reject_record := range reject_records {
			id, ok := fetchId(&reject_record)
			if !ok {
				log.Printf("Failed to fetch ID for payload: %v", reject_record)
				continue
			}
			rc.Map.Delete(id)
		}

		if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
			if err := tx.Delete(reject_records).Error; err != nil {
				log.Printf("InsertMany failed 一括と挿入に失敗しました。ロールバックします。: %v", err)
				tx.Rollback()
				return err
			}
			return nil
		}); err != nil {
			return err
		}
	}

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

func (rc *RecordsCache[ModelType]) Exists(id uint) bool {
	_, ok := rc.Map.Load(id)
	return ok
}

func (rc *RecordsCache[ModelType]) GetAll() []ModelType {
	result := []ModelType{}
	rc.Map.Range(func(key, value any) bool {
		result = append(result, *value.(*ModelType))
		return true
	})
	return result
}
