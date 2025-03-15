package main

import (
	"fmt"
	"log"
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	"github.com/stevengez/SAP4/model"
	"github.com/gofiber/fiber/v2"
)

func main(){
	
	// Obtener valores del entorno
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_DBNAME")
	port := os.Getenv("DB_PORT")

	// Preparar cadena de conexion
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Guatemala", host, user, pass, dbname, port)
	
	// Abrir conexion usando ORM
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to DB")
	}

	db.AutoMigrate(&model.Comentario{})

	app := fiber.New()
	
	// Primer endpoint para obtener todos los comentarios
	// Filtrado con query params, publicacion_id, usuario_id
	app.Get("/", func(c* fiber.Ctx) error {

		var publicacion_id = c.Query("publicacion_id")
		var usuario_id = c.Query("usuario_id")

		var comentarios []model.Comentario
		
		query := db.Model(&model.Comentario{})

		if publicacion_id != "" {
			query = query.Where("publicacion_id = ?", publicacion_id)
		}

		if usuario_id != "" {
			query = query.Where("usuario_id = ?", usuario_id)
		}

		if err := query.Find(&comentarios).Error; err != nil {
			return c.JSON(map[string]interface{}{
				"Error": "Failed to get comments",
			})
		}
		
		return c.JSON(comentarios)
	})

	log.Fatal(app.Listen("0.0.0.0:3000"))

}