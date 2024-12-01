package models

import (
	"fmt"
	"os"
	"time"

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
	if DB = connectDB(); DB != nil {
		return DB
	}
	time.Sleep(30 * time.Second)

	DB = connectDB()

	if DB == nil {
		panic("データベースの接続に失敗しました。")
	}
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
		return nil
	}
	return db
}
