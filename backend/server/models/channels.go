package models

import (
	"encoding/json"
	"sync"
)

/*
パッケージを横断するchannelを定義
NewChannel_TypeIsでchannelは作成と登録を同時に行うの。
*/

var Store *Channels

// サーバーからReduxへ向けての配信で使用する。
type ActionDTO[ModelType any] struct {
	Action  string
	Payload *ModelType
}

func (adto *ActionDTO[ModelType]) ToJSON() ([]byte, error) {
	return json.Marshal(*adto)
}

func NewActionDTO[ModelType any](action_key string, pay_load *ModelType) ActionDTO[ModelType] {
	return ActionDTO[ModelType]{
		Action:  action_key,
		Payload: pay_load,
	}
}

type Channels struct {
	Store sync.Map
}

func GetChannels() *Channels {
	if Store != nil {
		return Store
	}

	Store = &Channels{sync.Map{}}

	return Store
}

func NewChannel_TypeIs[T any](key string, boffer_count int) chan T {
	channels := GetChannels()
	target_chan := make(chan T, boffer_count)
	channels.Store.Store(key, target_chan)
	return target_chan
}

func FetchChannele_TypeIs[T any](key string) (chan T, bool) {
	chs := GetChannels()
	non_type_chan, ok := chs.Store.Load(key)
	if !ok {
		return nil, false
	}

	typed_chan, ok := non_type_chan.(chan T)
	if !ok {
		return nil, false
	}
	return typed_chan, true
}
