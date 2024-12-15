package machine

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// GetAllBooks - ดึงข้อมูลหนังสือทั้งหมด
func GetAllMachine(c *gin.Context) {

	var machine []entity.Machine

	db := config.DB()
	results := db.Find(&machine) /*// Get all records    result := db.Find(&users)
	// SELECT * FROM users;*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, machine) //ถ้าการดึงข้อมูลสำเร็จ ฟังก์ชันจะส่ง HTTP 200 (OK)
	//ทำเป็นไฟล์ JSON								//พร้อมกับ JSON ที่ประกอบด้วยรายการผู้ใช้ที่ถูกเก็บใน users.
}



func CreateMachine(c *gin.Context) {
	var machine entity.Machine

	// Bind JSON to book struct
	if err := c.ShouldBindJSON(&machine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save book to database
	db := config.DB()
	if err := db.Create(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the created book
	c.JSON(http.StatusOK, machine)
}