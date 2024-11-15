package models

import (
	"backend-app/server"
)

func init() {
	go TimeActionCatcher()
}

func TimeActionCatcher() {

	defer close(ACTION_DTO_FROM_CLIENT)
	
	var ACTION_DTO_FROM_CLIENT chan server.ActionDTO[TimeRecord] = server.NewChannel_TypeIs[server.ActionDTO[TimeRecord]]("CLIENT_ACTION_TO_DB", 100)

	for time_record := range ACTION_DTO_FROM_CLIENT {

	}

}
