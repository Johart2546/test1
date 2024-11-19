package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/laundry/config"
	"example.com/laundry/controller/books"
	"example.com/laundry/controller/machine"
)

const PORT = "8000"

func main() {

	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()

	// สร้างฐานข้อมูลและข้อมูลเริ่มต้น
	config.SetupDatabase()

	// ตั้งค่า Router
	r := gin.Default()

	// Middleware สำหรับ CORS
	r.Use(CORSMiddleware())

	// Routes สำหรับ Books
	bookRouter := r.Group("/books")
	{
		bookRouter.PUT("/:id", books.UpdateBooks)   // อัปเดตข้อมูลหนังสือตาม ID
		bookRouter.GET("/", books.GetAllBooks)      // ดึงข้อมูลหนังสือทั้งหมด
		bookRouter.GET("/:id", books.GetBooks)      // ดึงข้อมูลหนังสือตาม ID
		bookRouter.DELETE("/:id", books.DeleteBook) // ลบหนังสือตาม ID
	}

	// Routes สำหรับ Machines
	machineRouter := r.Group("/machines")
	{
		machineRouter.PUT("/:id", machine.UpdateMachine)    // อัปเดตข้อมูลเครื่องซักผ้าตาม ID
		machineRouter.GET("/", machine.GetAllMachines)      // ดึงข้อมูลเครื่องซักผ้าทั้งหมด
		machineRouter.GET("/:id", machine.GetMachine)       // ดึงข้อมูลเครื่องซักผ้าตาม ID
		machineRouter.DELETE("/:id", machine.DeleteMachine) // ลบเครื่องซักผ้าตาม ID
	}

	// Route สำหรับตรวจสอบ API
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// เริ่มเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

// CORSMiddleware ใช้สำหรับจัดการ Cross-Origin Resource Sharing
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
