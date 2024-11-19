package machine

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"example.com/laundry/config"
	"example.com/laundry/entity"
)

// GetAllMachines - ดึงข้อมูลเครื่องซักผ้าทั้งหมด
func GetAllMachines(c *gin.Context) {
	var machines []entity.Machine

	db := config.DB()

	// ดึงข้อมูลทั้งหมดจากตาราง machines
	results := db.Find(&machines)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, machines)
}

// GetMachine - ดึงข้อมูลเครื่องซักผ้าตาม ID
func GetMachine(c *gin.Context) {
	ID := c.Param("id")
	var machine entity.Machine

	db := config.DB()

	// ค้นหาเครื่องซักผ้าตาม ID
	results := db.First(&machine, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if machine.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, machine)
}

// UpdateMachine - อัปเดตข้อมูลเครื่องซักผ้าตาม ID
func UpdateMachine(c *gin.Context) {
	var machine entity.Machine

	MachineID := c.Param("id")

	db := config.DB()

	// ค้นหาเครื่องซักผ้าตาม ID
	result := db.First(&machine, MachineID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// อ่านข้อมูล JSON จาก payload และทำการแมปกับ machine struct
	if err := c.ShouldBindJSON(&machine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลที่อัปเดตกลับไปยังฐานข้อมูล
	result = db.Save(&machine)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DeleteMachine - ลบข้อมูลเครื่องซักผ้าตาม ID
func DeleteMachine(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลเครื่องซักผ้าตาม ID
	if tx := db.Exec("DELETE FROM machines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
