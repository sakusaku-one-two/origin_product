package controls

import (
	"backend-app/server/models"
	
	"github.com/golang-jwt/jwt/v5"
	"time"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo-contrib/session"
	"github.com/gorilla/sessions"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"time"
)

type User = models.User


var (
	DB := models.db
	JWT_SECRET_KEY := os.Getenv("JWT_SECRET_KEY")
)

type RequestData struct {
	ID string `json:"id`
	Password string `json:"password"`
}

func LoginHandler(c echo.Context) error {
	//josnからパスワードとIDを取り出す。
	var requestData RequestData
	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest,map[string]string{"error":"Invaild request"})
	}
	// 該当するユーザを探す。
	var user User
	result := DB.First(&user,request.ID)//IDからユーザーレコード構造体（ORM）を取得
	if result.Error != nil {
		return c.JSON(http.StatusBadRequest,map[string]string{"error":"not found user"})
	}

	//パスワードを確認
	if !user.CheckPassword(requestData.Password) {
		return c.JSON(http.StatusUnauthorized,map[string]string{"error":"not auth password"})
	}
	//以下はパスワードの確認完了したブロック
	
	//ユーザーからJWTを生成
	token ,err :=GenerateJWT(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError,map[string]string{"error":"Failed to generate token"})
	}

	//クッキーにJWTを格納
	cookei := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = token
	cookie.Expires = time.Now().Add(72 * time.Hour) //クッキーの有効期限を設定
	cookie.HttpOnly = true //javascriptからのアクセスを防ぐ
	cookie.Secure = true //HTTPSでのみ送信
	cookie.SameSite = http.SameSiteStrictMode //クロスサイトリクエストを防ぐ

	c.SetCookie(cookei)

	return c.JSON(http.StatusOK,map[string]string{"message":"login successful"})
}


func GenerateJWT(user User) (string,error) {
	//クレームを設定
	claims := jwt.MapClaims{
		"userID":user.ID,
		"UserName":user.UserName,
		"exp": time.Now().Add(time.Hour *72).Unix()//トークンの有効期限を72時間に設定
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString,err := token.SignedString(JWT_SECRET_KEY)
	if err != nil {
		return "",err
	}

	return tokenString,nil
}