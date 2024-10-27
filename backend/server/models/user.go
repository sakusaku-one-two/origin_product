package models

import (
	"bytes"
	"crypto/rand"
	"errors"

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

	return append(hashed_password, password_salt...), err
}

// ----------------------------------------------[ユーザーモデル]---------------------------------

type User struct {
	gorm.Model
	UserID          uint   `gorm:"primarykey;not null"`
	UserName        string `gorm:"size:100"`
	PermissionLevel uint   `gorm:"default:1;not null"`
	PermissionName  string `gorm:"size 20"`
	password        []byte
	IsLogin         bool
}

// パスワードを暗号化してUser構造体にセットする。（dbに保存までは行わない）
func (u *User) setPassword(raw_password string) bool {
	HashedPassword_as_byteArray, err := hash_password_from(raw_password)
	if err != nil {
		return false
	}
	u.password = HashedPassword_as_byteArray
	return true
}

// パスワードの変更メソッド
func (u *User) changeThePassword(db *gorm.DB, new_password string) error {

	if !u.setPassword(new_password) {
		return errors.New("パスワードの設定に失敗しました。")
	}

	if err := db.Save(u).Error; err != nil {
		return err
	}
	return nil
}

// パスワードを比較するメソッド(ログイン時に使用)
func (u *User) CheckPassword(password_from_request string) bool {
	hashed_password := argon2.IDKey([]byte(password_from_request), u.password[:SALT_LENGTH], 1, 64*1024, 4, 32)
	return bytes.Equal(hashed_password, u.password[SALT_LENGTH:])
}

//---------------------------------------[ユーザーファクトリ関数　通常ユーザーと管理者ユーザー]---------------------------------------

// 基底となるユーザーを作製
func baseCreateUser(UserID uint, UserName string, password string) (*User, error) {
	base_user := &User{
		UserID:   UserID,
		UserName: UserName,
	}
	if base_user.setPassword(password) == false {
		return nil, errors.New("パスワードの設定ができませんでした")
	}
	return base_user, nil
}

// 通常ユーザーを作製
func CreateUser(db *gorm.DB, UserID uint, UserName string, password string) bool {
	user, err := baseCreateUser(UserID, UserName, password)
	if err != nil {
		return false
	}
	user.PermissionLevel = 1
	user.PermissionName = "通常ユーザー"
	result := db.Create(&user)
	if result.Error != nil {
		return false
	} else {
		return true
	}
}

// 管理者ユーザーの作成
func CreateAdmin(db *gorm.DB, UserID uint, UserName string, password string) bool {
	base_user, err := baseCreateUser(UserID, UserName, password)
	if err != nil {
		return false
	}

	base_user.PermissionLevel = 2
	base_user.PermissionName = "管理者ユーザー"
	if db.Create(&base_user).Error != nil {
		return false
	} else {
		return true
	}
}
