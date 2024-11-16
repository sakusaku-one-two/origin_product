package server 

import (
	"backend-app/server/models"
)

/*

	すべてのチャネルを保持

*/

var (
	BROADCAST chan models.ActionDTO
)

func init() {

}