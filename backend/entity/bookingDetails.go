package entity

import (
	"time"

	"gorm.io/gorm"
)

type BookingDetails struct {
    gorm.Model
    BooksID    uint      `json:"book_id"`
    Books      Books     `gorm:"foreignKey:BooksID" json:"books"`
    MachineID uint      `json:"machine_id"`
    Machine   Machine   `gorm:"foreignKey:MachineID" json:"machine"`
    StartTime time.Time `json:"start_time"`
    EndTime   time.Time `json:"end_time"`
    Status    string    `json:"status"`
}
