package store

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)


type Store struct {
	db *gorm.DB
}

func (s *Store) init() (bool,error) {
	s.db,err = &gorm.DB{

	}
	if err != nil {
		return (false,err )
	}

	return true,nil 
}


type Repostiry[T any] interface {

	insert_into(insert_Value T) error
	
	insert_many(insert_values []T) error

	fetch_all () ([]T,error)

	fetch_by_id(id int) (T,error)

	update_by_id(id int,update_value T) error

	delete_by_id(id int) error
}



type AttendanceRecord struct {
	ManagedID int `json:"managed_id"`
	EmployeeID int `json:"employee_id"`
	Date time.Time `json:"date"`
	Status string `json:"status"`
}


type AttendanceRecordRepository struct {
	Repostiry[AttendanceRecord]
}


