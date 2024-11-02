package models

type ActionDTO struct {
	Type    string
	Payload interface{}
	user    User
}

type Repository[T any] interface {
	create(target T) (interface{}, error)
	update(target T) (bool, error)
	GetID() uint
	ToDTO() ActionDTO
}
