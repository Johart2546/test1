package books

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/laundry/config"
	"example.com/laundry/entity"
)

// GetAllBooks - ดึงข้อมูลหนังสือทั้งหมด
func GetAllBooks(c *gin.Context) {
	var books []entity.Books

	db := config.DB()

	// ดึงข้อมูลทั้งหมดจากตาราง books
	results := db.Find(&books)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

// GetBook - ดึงข้อมูลหนังสือตาม ID
func GetBooks(c *gin.Context) {
	ID := c.Param("id")
	var book entity.Books

	db := config.DB()

	// ค้นหาหนังสือตาม ID
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

// UpdateBook - อัปเดตข้อมูลหนังสือตาม ID
func UpdateBooks(c *gin.Context) {
	var book entity.Books

	BookID := c.Param("id")

	db := config.DB()

	// ค้นหาหนังสือตาม ID
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
func DeleteBook(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลหนังสือตาม ID
	if tx := db.Exec("DELETE FROM books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
//ตุ๋ยตูด
