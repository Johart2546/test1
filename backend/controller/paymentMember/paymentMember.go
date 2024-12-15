package paymentMember

import (
	"errors" // เพิ่ม import สำหรับ package errors
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
)

//////////////////////////////////////////////////////paymentMember//////////////////////////////////////////////////////////////////////////////////////

// GET /paymentMembers //all
func GetAllBooks(c *gin.Context) {
	var paymentMembers []entity.PaymentMember

	db := config.DB()

	// ดึงข้อมูลทั้งหมดจากตาราง paymentMember
	results := db.Find(&paymentMembers)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, paymentMembers)
}

// GET /paymentMembers /id
func GETpaymentMemberByID(c *gin.Context) {
	ID := c.Param("id")
	var paymentMember entity.PaymentMember

	db := config.DB()

	// ค้นหาpaymentMember by ID
	results := db.First(&paymentMember, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if paymentMember.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, paymentMember)
}

// อัพเดท payment /id
func UpdatePaymentMemberBYID(c *gin.Context) {
	var paymentMember entity.PaymentMember

	paymentMemberID := c.Param("id")

	db := config.DB()

	// ค้นหาpaymentMember by ID
	result := db.First(&paymentMember, paymentMemberID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// อ่านข้อมูล JSON จาก payload และทำการแมปกับ paymentMember struct
	if err := c.ShouldBindJSON(&paymentMember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลที่อัปเดตกลับไปยังฐานข้อมูล
	result = db.Save(&paymentMember)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

//////////////////////////////////////////////////////////////end///////////////////////////////////////////////////////////////

// //////////////////////////////////////////////////////////User//////////////////////////////////////////////////////////////////////
// PUT update User by id
func UpdateUserByid(c *gin.Context) {
	var User entity.User
	UserID := c.Param("id")
	db := config.DB()

	result := db.First(&User, UserID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Id Store not found"})
		return
	}

	if err := c.ShouldBindJSON(&User); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&User)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// GET /user/:id
func GetUser(c *gin.Context) {
	ID := c.Param("id")
	var user entity.User

	db := config.DB()

	// Query the user by ID
	results := db.Where("id = ?", ID).First(&user)
	if results.Error != nil {
		if errors.Is(results.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

///////////////////////////////////////////////////////////end/////////////////////////////////////////////////////////////////////////
