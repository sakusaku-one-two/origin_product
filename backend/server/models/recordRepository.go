package models

import (
	"sync"

	"gorm.io/gorm"
)

/*
	gorｍで定義した構造体のレポジトリ、アプリケーションからは直接モデル

*/

type Repository[ModelType any] struct {
	Cache   *RecordsCache[ModelType]
	Sender  chan ActionDTO[ModelType]
	Reciver chan ActionDTO[ModelType]
	DB      *gorm.DB
}

func CreateRepositry[ModelType any](channelName string, broadcastCount int) *Repository[ModelType] {
	db := GetDB()
	sender_name_as_chan := "SENDER_" + channelName //送信channelのキー
	broadcastChan := NewChannel_TypeIs[ActionDTO[ModelType]](sender_name_as_chan, broadcastCount)
	reciver_name_as_chan := "RECIVER_" + channelName //受信channelのキー
	reciverChan := NewChannel_TypeIs[ActionDTO[ModelType]](reciver_name_as_chan, broadcastCount)
	cache := &RecordsCache[ModelType]{Map: sync.Map{}}

	rp := &Repository[ModelType]{
		Cache:   cache,         //threadセーフな辞書でモデルインスタンスを管理
		Sender:  broadcastChan, //websocketでclientのreduxに向けて配信するためのchannel。
		Reciver: reciverChan,   //クライアントからの受信を転送してもらうためのチャンネル
		DB:      db,            //DBクライアントインスタンス。
	}

	return rp
}

type RepoGorutin[T any] func(repo *Repository[T])

func (rp *Repository[ModelType]) BackgroundKicker(func_as_background RepoGorutin[ModelType]) {
	go func_as_background(rp)
}
