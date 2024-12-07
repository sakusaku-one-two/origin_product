package models

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB                  *gorm.DB
	ReportActionChannel chan TimeRecord
)

func init() {

	DB = connectDB()
	if err := Mingrate(); err != nil {
		log.Println("マイグレーションに失敗しました。")
		panic(err)
	} else {
		log.Println("マイグレーションに成功しました。")
	}
	//管理者を新規作成
	if _, err := CreateAdmin(NewQuerySession(), 1, "admin", "admin"); err != nil {
		log.Println("管理者の作成に失敗しました。")
		panic(err)
	} else {
		log.Println("管理者の作成に成功しました。")
	}

	CreateSampleTimeRecords()
	CreateSampleAttendanceRecords()
	CreateSampleEmployeeRecords()
	CreateSampleLocationRecords()
}

// シングルトンを返却
func GetDB() *gorm.DB {
	if DB != nil {
		return DB
	}
	if DB = connectDB(); DB != nil {
		return DB
	}

	// 30秒待つ
	time.Sleep(30 * time.Second)

	DB = connectDB()

	if DB == nil {
		log.Println("データベースの接続に失敗しました。")
		time.Sleep(30 * time.Second) // 30秒待つ
		return GetDB()               //接続するまで繰り返す
	} else {
		log.Println("データベースの接続に成功しました。")
		return DB
	}
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
