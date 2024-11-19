package entity

import (
	"time"

	"gorm.io/gorm"
)

type Books struct {
    gorm.Model
    BookStart      time.Time        `json:"book_start"`
    BookEnd        time.Time        `json:"book_end"`
    Price          float32          `json:"price"`
    UserID         uint             `json:"user_id"`
    Users          Users            `gorm:"foreignKey:UserID" json:"user"`
    BookingDetails []BookingDetails `gorm:"foreignKey:BooksID" json:"booking_details"`
}

