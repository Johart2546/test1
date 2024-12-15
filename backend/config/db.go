package config

import (
	"fmt"

	"example.com/ProjectSeG08/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"time"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("Laundry.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.User{},
		&entity.Books{},
		&entity.Machine{},
		&entity.BookingDetails{},
	)

	//User
	hashedPassword, _ := HashPassword("1")
	User := []entity.User{
		{UserName: "NobpasinTumdee", Password: hashedPassword, Email: "B6506407@g.sut.ac.th", FirstName: "Nobpasin", LastName: "Tumdee", Age: 21, Profile: "https://cache-igetweb-v2.mt108.info/uploads/images-cache/12677/product/dd87089fb03608d6fab36fa1204ce286_full.jpg", ProfileBackground: "", Status: "User"},
		{UserName: "PorGz", Password: hashedPassword, Email: "PorGz@g.sut.ac.th", FirstName: "Por", LastName: "Gz", Age: 21, Profile: "", ProfileBackground: "", Status: "User"},
		{UserName: "Admin", Password: hashedPassword, Email: "Admin@g.sut.ac.th", FirstName: "Admin", LastName: "", Age: 100, Profile: "https://theinformalgamer.wordpress.com/wp-content/uploads/2022/02/character_yae_miko_thumb-min.png", ProfileBackground: "", Status: "Admin"},
		{UserName: "Employee", Password: hashedPassword, Email: "Employee@g.sut.ac.th", FirstName: "employee", LastName: "", Age: 100, Profile: "https://tiermaker.com/images/template_images/2022/15460683/genshin-characters-going-to-a-beach---pool-party-15460683/screenshot20221127-203037googlejpg.png", ProfileBackground: "", Status: "Employee"},
	}
	for _, pkg := range User {
		db.FirstOrCreate(&pkg, entity.User{UserName: pkg.UserName})
	}

	books := &entity.Books{
		BooksStart: time.Now(),
		BooksEnd:   time.Now().AddDate(0, 0, 7),
		Price:     1000,
		Status: "ว่าง",
		UserID:    1,
	}

	// เพิ่มหนังสือเริ่มต้น
	db.FirstOrCreate(books, &entity.Books{
		BooksStart: books.BooksStart,
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
		BooksID:   books.ID,
		MachineID: machine.ID,
	}

	// เพิ่ม BookingDetails เริ่มต้น
	db.FirstOrCreate(bookingDetail, &entity.BookingDetails{
		BooksID:   bookingDetail.BooksID,
		MachineID: bookingDetail.MachineID,
	})

}
