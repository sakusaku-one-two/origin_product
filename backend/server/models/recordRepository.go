package models

import (
	"backend-app/server/channels"
	"errors"
	"sync"
	"gorm.io/gorm"
)

func StartUP(){
	
}

type RecordsCache[ModelType any] struct {
	Map sync.Map
}

//キャッシュに格納
func (rc *RecordsCache[ModelType]) Set(key any,val ModelType) {
	rc.Map.Store(key,val)
}

func (rc *RecordsCache[ModelType]) Get(key any) (*ModelType,error) {
	got_data,ok := rc.Map.Load(key)
	if !ok {
		return nil,errors.New("取得に失敗しました。")
	}

	result,ok := got_data.(ModelType)
	if !ok {
		return nil,errors.New("キャストに失敗しました。")
	}
	return &result,nil
}

func (rc *RecordsCache[ModelType]) CacheDemon(call_back func(Check_Target *ModelType)) chan interface{} {
	
	done_chan := make(chan interface{})
	
	go func(inner_func func(key any,Check_Target ModelType),
	        data_map sync.Map,done_chan_as_inner chan <- interface{} )
		{

		defer close(done_chan_as_inner)
		
		for {
			data_map.Range(func(key any,val any) bool {
				model_type,ok := val.(ModelType)
				if !ok {
					return false
				}
				inner_func(key,model_type)
				return true
			})

			select {
			case <- done_chan_as_inner:
				return 
			case <- time.Ticker(time.second *10):
				continue
			}
		}
	}(
		call_back,
		rc.Map,
		done_chan,
	)


	return done_chan
} 


type Repository[ModelType any] struct {
	Cache RecordsCache[ModelType]
	BroadCast chan ModelType
	Model_Type ModelType
	DB *gorm.DB
}

func (r *Repository[ModelType]) init(broadcast_count int) *Repository[ModelType] {
	r.DB = GetDB()
	r.BroadCast = make(chan ModelType,broadcast_count)
	r.Cache = RecordsCache[ModelType]{Map: sync.Map{}}



}

