package entity

import (
	"time"

	"gorm.io/gorm"
)

type PackageMemberShip struct {
	gorm.Model
	NamePackage  string `json:"NamePackage"`  //Package ชื่อว่าอะไร 1m(30),3m(90),6m(180),12m(365)
	PricePackage uint   `json:"PricePackage"` //ราคาเท่าไร
	HowLongTime  uint   `json:"HowLongTime"`  //นับเวลาในหน่วยวัน
}

type PaymentMember struct {
	gorm.Model
	StatusPaymentMember string `json:"StatusPaymentMember"` //1 0
	NamePaymentMember   string `json:"NamePaymentMember"`   //จ่ายค่าอะไร

	PackageMemberShipID uint              `json:"PackageMemberShipID"` //ฝากเลขID
	PackageMemberShip   PackageMemberShip `gorm:"foreignKey:PackageMemberShipID"`

	UserID uint `json:"UserID"` //ฝากเลขID
	User   User `gorm:"foreignKey:UserID"`

	Receipt []Receipt `gorm:"foreignKey:PaymentStoreID"` //ลิ้งไปหา

	PayMethodMemberID uint            `json:"PayMethodMemberID"` //ฝากเลขID
	PayMethodMember   PayMethodMember `gorm:"foreignKey:PayMethodMemberID"`
}

type PayMethodMember struct {
	gorm.Model
	MethodName string `json:"MethodName"` //True money,promppay,paypol,cradit card,โอนชำระผ่านบัญชี
	MethodPic  string `json:"MethodPic"`

	PaymentMember []PaymentMember `gorm:"foreignKey:PaymentMemberID"`
}

type Receipt struct {
	gorm.Model
	DateReceipt     time.Time `json:"DateReceipt"`
	DescribtionBill string    `json:"DescribtionBill"`

	PaymentMemberID uint          `json:"PaymentMemberID"`
	PaymentMember   PaymentMember `gorm:"foreignKey:PaymentMemberID"`
}
