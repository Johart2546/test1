package books

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// GetAllBooks - ดึงข้อมูล
func GetAllBookingDetails(c *gin.Context) {
	var books []entity.Books

	db := config.DB()

	// ดึงข้อมูลทั้งหมด
	results := db.Find(&books)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

func GetBookingDetails(c *gin.Context) {
	ID := c.Param("id")
	var book entity.Books

	db := config.DB()

	// ค้นหา
	results := db.First(&book, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if book.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, book)
}

// UpdateBook - อัปเดตข้อมูล
func UpdateBookingDetails(c *gin.Context) {
	var book entity.Books

	BookID := c.Param("id")

	db := config.DB()

	// ค้นหาตาม ID
	result := db.First(&book, BookID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// อ่านข้อมูล JSON จาก payload และทำการแมปกับ book struct
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลที่อัปเดตกลับไปยังฐานข้อมูล
	result = db.Save(&book)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DeleteBook - ลบข้อมูลหนังสือตาม ID
func DeleteBookingDetails(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลหนังสือตาม ID
	if tx := db.Exec("DELETE FROM books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func CreateBookingDetails(c *gin.Context) {
	var book entity.BookingDetails

	// Bind JSON to book struct
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save book to database
	db := config.DB()
	if err := db.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the created book
	c.JSON(http.StatusOK, book)
}