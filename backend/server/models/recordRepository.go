package models

import (
	"gorm.io/gorm"
)

/*
レコードの操作を行うサービスを定義
*/

type BaseRepostory[T any] struct {
	DB         *gorm.DB
	recordType T
}

type EmployeeRepository struct {
	BaseRepostory[EmployeeRecord]
}

func NewEmployeeRepostory() EmployeeRepository {
	return EmployeeRepository{
		BaseRepostory: BaseRepostory[EmployeeRecord]{},
	}
}

func (er *EmployeeRecord) Create() {

}
