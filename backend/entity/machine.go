package entity

import (
	"gorm.io/gorm"
)

type Machine struct {
    gorm.Model
    MachineName    string           `json:"machine_name"`
    MachineType    string           `json:"machine_type"`
    Status         string           `json:"status"`
    BookingDetails []BookingDetails `gorm:"foreignKey:MachineID" json:"booking_details"`
}

