package models

import (
	"backend-app/server"
)

func init() {
	go ActionCatcher()
}

func ActionCatcher() {

	CLIENT_ACTION_TO_DB := server.NewChannel_TypeIs[server.ActionDTO[TimeRecord]]("CLIENT_ACTION_TO_DB", 100)

	for time_record := range CLIENT_ACTION_TO_DB {

	}

}
