package controls

import (
	"backend-app/server/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"net/http"
	"os"
)

type User = models.User

type ResponseData struct {
	Message string `json:"message"`
	User    User   `json:"user"`
	Records struct {
		Action  string                    `json:"action"`
		Payload []models.AttendanceRecord `json:"payload"`
	} `json:"records"`
}

var (
	DB             *gorm.DB = models.DB
	JWT_SECRET_KEY string   = os.Getenv("JWT_SECRET_KEY")
)

type RequestData struct {
	ID       uint   `json:"id"`
	Password string `json:"password"`
}

// ログインしたら本日の管制実績データが返ってくる。
func LoginHandler(c echo.Context) error {
	//josnからパスワードとIDを取り出す。
	var requestData RequestData
	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invaild request"})
	}
	// 該当するユーザを探す。
	var user User
	result := DB.Where("ID = ?", requestData.ID).First(&user) //IDからユーザーレコード構造体（ORM）を取得
	if result.Error != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "not found user"})
	}

	//パスワードを確認
	if !user.CheckPassword(requestData.Password) {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid password"})
	}
	//以下はパスワードの確認完了したブロック
	user.IsLogin = true
	models.NewQuerySession().Save(&user)
	//ユーザーからJWTを生成
	token, err := GenerateJWT(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
	}

	//クッキーにJWTを格納
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = token
	cookie.Expires = time.Now().Add(72 * time.Hour) //クッキーの有効期限を設定
	cookie.HttpOnly = true                          //javascriptからのアクセスを防ぐ
	cookie.Secure = true                            //HTTPSでのみ送信
	cookie.SameSite = http.SameSiteStrictMode       //クロスサイトリクエストを防ぐ

	c.SetCookie(cookie)
	attendance_records := GetAttendanceRecord()

	return c.JSON(http.StatusOK, ResponseData{
		Message: "successful",
		User:    user,
		Records: struct {
			Action  string                    `json:"action"`
			Payload []models.AttendanceRecord `json:"payload"`
		}{
			Action:  "ATTENDANCE_RECORDS/INSERT_SET",
			Payload: attendance_records,
		},
	})

}

func GenerateJWT(user User) (string, error) {
	//クレームを設定
	claims := jwt.MapClaims{
		"userID":          user.UserID,
		"exp":             time.Now().Add(time.Hour * 72).Unix(), //トークンの有効期限を72時間に設定
		"permissionLevel": user.PermissionLevel,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(JWT_SECRET_KEY))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
