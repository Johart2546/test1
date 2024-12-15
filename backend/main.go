package main

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/controller/books"
	"example.com/ProjectSeG08/controller/machine"
	"example.com/ProjectSeG08/controller/user"
	"example.com/ProjectSeG08/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	
	r.POST("/booking", books.CreateBookingDetails)
	r.POST("/books", books.CreateBooks)
	r.POST("/machine", machine.CreateMachine)
    r.GET("/machine", machine.GetAllMachine)
	r.GET("/books/last", books.GetLastBooks)


	r.POST("/signup", user.SignUp)                      //สมัคร
	r.POST("/signin", user.SignIn)                      //Sign in == login
	r.PUT("/ResetPasswordUser", user.ResetPasswordUser) //Sign in == login

	r.GET("/user", user.ListUsers)

	r.POST("/send-email", user.SendEmailHandler)
	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())

		//User
		router.GET("/user/:id", user.GetUser)
		router.PUT("/user/:id", user.UpdateUserByid)
	}

		
	// r.GET("/machine", machine.ListMachine)



	
		



	

	bookingDetailsRouter := r.Group("/booking")
	{      //  ID
		bookingDetailsRouter.PUT("/:id", books.UpdateBookingDetails)    // อัปเดตข้อมูลหนังสือตาม ID
		bookingDetailsRouter.GET("/", books.GetAllBookingDetails)       // ดึงข้อมูลหนังสือทั้งหมด
		bookingDetailsRouter.GET("/:id", books.GetBookingDetails)       // ดึงข้อมูลหนังสือตาม ID
		bookingDetailsRouter.DELETE("/:id", books.DeleteBookingDetails) // ลบหนังสือตาม ID
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})
	r.Run("localhost:" + PORT)
}


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