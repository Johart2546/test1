package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserName          string `json:"UserName"`
	Password          string `json:"Password"`
	Email             string `json:"Email"`
	Profile           string `json:"Profile"`
	ProfileBackground string `json:"ProfileBackground"`
	FirstName         string `json:"FirstName"`
	LastName          string `json:"LastName"`
	Age               int    `json:"Age"`
	Tel               string `json:"Tel"`
	Status            string `json:"Status"`
	
	Books []Books `gorm:"foreignKey:UserID" json:"books"`
	//PackageMemberShip []PackageMemberShip `gorm:"foreignKey:PaymentStoreID"`
}
