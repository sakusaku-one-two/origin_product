package models

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB                  *gorm.DB
	ReportActionChannel chan TimeRecord
)

// シングルトンを返却
func GetDB() *gorm.DB {
	if DB != nil {
		return DB
	}
	DB = connectDB()
	return DB
}

func NewQuerySession() *gorm.DB {
	return GetDB().Session(&gorm.Session{})
}

func connectDB() *gorm.DB {

	//環境変数を参照してDBクライアントを作製
	dbUser := os.Getenv("DB_USER")
	dbPassWord := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	dbPort := os.Getenv("DB_PORT")
	dbSsl := os.Getenv("DB_SSL")
	dbTimeZone := os.Getenv("DB_TIMEZONE")

	dns := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		dbHost, dbUser, dbPassWord, dbName, dbPort, dbSsl, dbTimeZone)

	db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})
	if err != nil {
		panic("データベースの接続に失敗しました。")
	}
	return db
}
