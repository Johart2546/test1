package entity

import (
	"time"

	"gorm.io/gorm"
)

type Books struct {
    gorm.Model
    Price          float32          `json:"price"`
    Status    string    `json:"status"`
    BooksStart      time.Time        `json:"books_start"`
    BooksEnd        time.Time        `json:"books_end"`
    
    UserID         uint             `json:"user_id"`
    User          User            `gorm:"foreignKey:UserID" json:"user"`
    
    
    BookingDetails []BookingDetails `gorm:"foreignKey:BooksID" json:"booking_details"`
}

