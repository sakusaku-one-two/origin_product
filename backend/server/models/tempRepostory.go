package models

/*
一時的にTimeRecordを保存するインメモリーのデータ保存を担う
*/


import (
	"sync"
	"server/websocket"
)

type TimeRecordStore struct {
	records sync.Map
	
}

func init() {

	pub_channel := make(chan TimeRecord,20)

	go func (pub_channel chan TimeRecord) {
		
	}(pub_channel)

}
