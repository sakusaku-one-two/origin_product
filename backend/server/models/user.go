package models

import (
	"bytes"
	"crypto/rand"
	"errors"
	"log"

	"golang.org/x/crypto/argon2" //argon2というハッシュ化ライブラリ　暗号化において性能がいいとのこと　by chatGPT調べ
	"gorm.io/gorm"
)

const SALT_LENGTH = 16 //ソルトの長さの定数　GENERETESALTで使用

//----------------------------------------------[helper関数]---------------------------------
//・パスワードに関するハッシュ化の関数

// ハッシュ化のためのランダムソルトを作製(定期的にパスワードのソルトをバッチ処理で変更する際に使用予定)
func generateSalt() ([]byte, error) {
	salt := make([]byte, SALT_LENGTH)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}
	return salt, nil
}

// hash関数（Userモデルのメソッドでパスワードをハッシュ化する際に使用）
func hash_password_from(raw_password string) ([]byte, error) {
	password_salt, err := generateSalt()
	if err != nil {
		return nil, err
	}
	hashed_password := argon2.IDKey([]byte(raw_password), password_salt, 1, 64*1024, 4, 32)

	return append(hashed_password, password_salt...), nil
}

func hash_password_with_salt(raw_password string, salt []byte) ([]byte, error) {
	hashed_password := argon2.IDKey([]byte(raw_password), salt, 1, 64*1024, 4, 32)
	return append(hashed_password, salt...), nil
}

// ----------------------------------------------[ユーザーモデル]---------------------------------

type User struct {
	gorm.Model
	UserID          uint   `gorm:"primarykey;not null"`
	UserName        string `gorm:"size:100"`
	PermissionLevel uint   `gorm:"default:1;not null"`
	PermissionName  string `gorm:"size:20"`
	Password        []byte
	IsLogin         bool
}

// パスワードを暗号化してUser構造体にセットする。（dbに保存までは行わない）
func (u *User) setPassword(raw_password string) error {
	if len(raw_password) == 0 {
		return errors.New("パスワードが空です")
	}
	HashedPassword_as_byteArray, err := hash_password_from(raw_password)
	if err != nil {
		return err
	}
	u.Password = HashedPassword_as_byteArray
	return nil
}

// パスワードの変更メソッド
func (u *User) ChangeThePassword(db *gorm.DB, new_password string) error {

	if err := u.setPassword(new_password); err != nil {
		return err
	}

	if err := db.Save(u).Error; err != nil {
		return err
	}
	return nil
}

// ハッシュ化されたパスワードからソルトを取得する
func GetSaltFromSavedPassword(saved_password []byte) []byte {
	return saved_password[len(saved_password)-SALT_LENGTH:]
}

// パスワードを比較するメソッド(ログイン時に使用)
func (u *User) CheckPassword(password_from_request string) bool {
	salt := GetSaltFromSavedPassword(u.Password)
	hashed_password, err := hash_password_with_salt(password_from_request, salt)
	if err != nil {
		return false
	}
	log.Println(hashed_password)
	log.Println(u.Password)
	return bytes.Equal(hashed_password, u.Password)
}

//---------------------------------------[ユーザーファクトリ関数　通常ユーザーと管理者ユーザー]---------------------------------------

// 基底となるユーザーを作製
func baseCreateUser(UserID uint, UserName string, password string) (*User, error) {
	base_user := &User{
		UserID:   UserID,
		UserName: UserName,
	}
	if err := base_user.setPassword(password); err != nil {
		return nil, errors.New("パスワードの設定ができませんでした")
	}
	return base_user, nil
}

// 通常ユーザーを作製
func CreateUser(db *gorm.DB, UserID uint, UserName string, password string) (*User, error) {
	user, err := baseCreateUser(UserID, UserName, password)
	if err != nil {
		return nil, err
	}
	user.PermissionLevel = 1
	user.PermissionName = "通常ユーザー"
	result := db.Create(&user)
	if result.Error != nil {
		return nil, result.Error
	} else {
		return user, nil
	}
}

// 管理者ユーザーの作成
func CreateAdmin(db *gorm.DB, UserID uint, UserName string, password string) (*User, error) {

	base_user, err := baseCreateUser(UserID, UserName, password)
	if err != nil {
		return nil, err
	}

	base_user.PermissionLevel = 2
	base_user.PermissionName = "管理者ユーザー"
	result := db.Create(&base_user)
	if result.Error != nil {
		return nil, result.Error
	} else {
		return base_user, nil
	}
}
