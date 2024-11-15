package models

import (
	"backend-app/serverT(inner_func func(key any,Check_Target ModelType),
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

