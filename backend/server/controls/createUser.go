package controls

import (
	"backend-app/server/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestDataForUser struct {
	UserName        string `json:"userName"`
	Password        string `json:"password"`
	PermissionLevel int    `json:"permissionLevel"`
}

func CreateUser(c echo.Context) error {
	// リクエストデータのバインド
	permissionLevel := c.Param("permissionLevel")
	// 管理者ユーザーのみ新規ユーザーを作成できる
	if permissionLevel != "2" {
		return c.JSON(http.StatusBadRequest, "管理者外のユーザーは新規ユーザーを作成できません。")
	}

	// リクエストデータのバインド
	var requestData RequestDataForUser
	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	// 権限レベルのチェック 1~2のみ許可
	if requestData.PermissionLevel != 1 && requestData.PermissionLevel != 2 {
		return c.JSON(http.StatusBadRequest, "権限レベルが不正です。")
	}

	// ユーザーの存在確認
	var user models.User
	if err := models.NewQuerySession().Where("UserName = ?", requestData.UserName).First(&user).Error; err == nil {
		return c.JSON(http.StatusBadRequest, "その名称のユーザーはすでに存在します。")
	}

	// ユーザーの作成
	if requestData.PermissionLevel == 1 { // 1: ユーザー
		_, err := models.CreateUser(models.NewQuerySession(), user.ID, requestData.UserName, requestData.Password)
		if err != nil {
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		return c.JSON(http.StatusOK, "ok")
	} else if requestData.PermissionLevel == 2 { // 2: 管理者ユーザー
		_, err := models.CreateAdmin(models.NewQuerySession(), user.ID, requestData.UserName, requestData.Password)
		if err != nil {
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		return c.JSON(http.StatusOK, "ok")
	}

	return c.JSON(http.StatusBadRequest, "ユーザーの作成に失敗しました。")
}
