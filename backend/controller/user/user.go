package user

import (
	"errors" // เพิ่ม import สำหรับ package errors
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
)

// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.User

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Select("id, email, user_name, password, status, first_name, last_name, age, profile, profile_background").Find(&users)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}

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
