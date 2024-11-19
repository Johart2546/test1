package entity

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	Firstname     string    `json:"firstname"`
	Lastname      string    `json:"lastname"`
	Password      string    `json:"password"`
	Email         string    `gorm:"unique" json:"email"`
	PhoneNumber   string    `json:"phone_number"`
	Address       string    `json:"address"`
	Point         int       `json:"point"`
	UserStart     time.Time `json:"user_start"`
	UserEnd       time.Time `json:"user_end"`
	StatusPayment int       `json:"status_payment"` // Assuming StatusPayment is an integer
	UserTypeID    int       `json:"user_type_id"`
	Books []Books `gorm:"foreignKey:UserID" json:"books"`
}
