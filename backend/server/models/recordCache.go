package models

import (
	"fmt"
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

	// DBに保存
	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(targetData).Error; err != nil {
			return err
		}
		// キャッシュに登録
		rc.Map.Store(id, targetData)
		return nil
	}); err != nil {
		return err
	}

	return nil
}

type GetId[ModleType any, ReturnType any] func(target *ModleType) (ReturnType, bool)

// 複数のデータをキャッシュに登録と同時にDBに保存する
func (rc *RecordsCache[ModelType]) InsertMany(payloadArray []*ModelType, fetchId GetId[ModelType, uint]) error {

	if len(payloadArray) == 0 {
		return nil
	}

	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		// DBに保存
		if err := tx.Save(payloadArray).Error; err != nil {
			log.Printf("InsertMany failed 一括と挿入に失敗しました。ロールバックします。: %v", err)
			tx.Rollback()
			return err
		}
		// キャッシュに登録
		for _, payload := range payloadArray {
			id, ok := fetchId(payload)
			if !ok {
				log.Printf("Failed to fetch ID for payload: %v", payload)
				continue
			}
			rc.Map.Store(id, payload)
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

type MulitGetKeyByOne[ModelType any] func(targetRecord *ModelType, tx *gorm.DB, rc *RecordsCache[ModelType]) (error, uint)

// 複合主キーで配列では無い、単一のデータを更新する為のメソッド
func (rc *RecordsCache[ModelType]) MulitPrimaryKeyInsert(targetRecord *ModelType, executeFunction MulitGetKeyByOne[ModelType]) error {
	if targetRecord == nil {
		return nil
	}

	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		//executeFunctionにはトランザクションを渡して保存してもらう。
		if err, id := executeFunction(targetRecord, tx, rc); err != nil {
			return err
		} else {
			rc.Map.Store(id, targetRecord)
			return nil
		}

	}); err != nil {
		return err
	}
	return nil
}

// 複合主キーに対応するための関数の型定義　DBにUpsertやId：レコードの辞書を作成する。実質的な処理はこのコールバックで担う。　帰り値はエラーとキャッシュに登録するためのIDと値の辞書
type MulitGetKey[ModelType any] func(InsertDataArray []*ModelType, tx *gorm.DB, rc *RecordsCache[ModelType]) (map[uint]*ModelType, error)

// 複合主キーに対応するためのメソッド。　インサートやアップデートはコールバック関数側で基本おこなって貰う。
func (rc *RecordsCache[ModelType]) MultiPrimaryKeyInsertMany(insertarray []*ModelType, execteFunction MulitGetKey[ModelType]) error {

	//配列をトランザクションで更新
	if err := NewQuerySession().Transaction(func(tx *gorm.DB) error {
		if keyMap, err := execteFunction(insertarray, tx, rc); err != nil {
			//DBに保存失敗
			fmt.Println("複合主キーの一括DB保存失敗しました")
			return err
		} else {
			for key, val := range keyMap {
				rc.Map.Store(key, val)

			}
		}
		return nil
	}); err != nil {
		return err
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

func (rc *RecordsCache[ModelType]) Get(id uint) (*ModelType, bool) {
	targetModel, ok := rc.getValue(id)
	if !ok {
		return nil, false
	}
	return targetModel, true
}
