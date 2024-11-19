package config

import (
	"fmt"
	"time"

	"example.com/laundry/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// DB - คืนค่า database connection
func DB() *gorm.DB {
	return db
}

// ConnectionDB - เปิดการเชื่อมต่อฐานข้อมูล
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// SetupDatabase - ตั้งค่าเริ่มต้นฐานข้อมูล
func SetupDatabase() {
	// สร้างตารางจากโครงสร้าง Users, Books, Machine และ BookingDetails
	db.AutoMigrate(
		&entity.Users{},
		&entity.Books{},
		&entity.Machine{},
		&entity.BookingDetails{},
	)

	// ข้อมูลผู้ใช้เริ่มต้น
	user := &entity.Users{
		Firstname:     "John",
		Lastname:      "Doe",
		Email:         "johndoe@gmail.com",
		Password:      "password123",
		PhoneNumber:   "0123456789",
		Address:       "123 Software Street, Tech City",
		Point:         100,
		UserStart:     time.Now(),
		UserEnd:       time.Now().AddDate(1, 0, 0),
		StatusPayment: 1,
		UserTypeID:    1,
	}

	// เพิ่มผู้ใช้เริ่มต้น
	db.FirstOrCreate(user, &entity.Users{
		Email: "johndoe@gmail.com",
	})

	// ข้อมูลหนังสือเริ่มต้น
	book := &entity.Books{
		BookStart: time.Now(),
		BookEnd:   time.Now().AddDate(0, 0, 7),
		Price:     99.99,
		UserID:    user.ID,
	}

	// เพิ่มหนังสือเริ่มต้น
	db.FirstOrCreate(book, &entity.Books{
		BookStart: book.BookStart,
	})

	// ข้อมูล Machine เริ่มต้น
	machine := &entity.Machine{
		MachineName: "Washer 1",
		MachineType: "Washing Machine",
		Status:      "Available",
	}

	// เพิ่ม Machine เริ่มต้น
	db.FirstOrCreate(machine, &entity.Machine{
		MachineName: machine.MachineName,
	})

	// ข้อมูล BookingDetails เริ่มต้น
	bookingDetail := &entity.BookingDetails{
		BooksID:    book.ID,
		MachineID: machine.ID,
		StartTime: time.Now(),
		EndTime:   time.Now().Add(1 * time.Hour),
		Status:    "Confirmed",
	}

	// เพิ่ม BookingDetails เริ่มต้น
	db.FirstOrCreate(bookingDetail, &entity.BookingDetails{
		BooksID:    bookingDetail.BooksID,
		MachineID: bookingDetail.MachineID,
	})
}
