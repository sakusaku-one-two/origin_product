package models

import (
	"fmt"
	"models/types"
	"os"
	"gorm.io/driver/postgress"
	"gorm.io/gorm"
)



var (
	DB *gorm.DB
	ReportActionChannel chan TimeRecord
)

func init(){
	DB = connectDB()

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
						dbHost, dbUser, dbPassWord, dbName,dbPort,dbSsl,dbTimeZone,)

	db,err := gorm.Open(postgress.Open(dns),&gorm.Config{})
	if err != nil {
		panic("データベースの接続に失敗しました。")
	}

	return db
}




