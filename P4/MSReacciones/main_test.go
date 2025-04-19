package main

import (
	"testing"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
)

// Creamos una app de prueba con rutas mockeadas (sin conexión real a DB)
func setupTestApp() *fiber.App {
	app := fiber.New()

	app.Get("/status", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	app.Get("/", func(c *fiber.Ctx) error {
		publicacionID := c.Query("publicacion_id")
		comentarioID := c.Query("comentario_id")
		usuarioID := c.Query("usuario_id")

		// Simulamos una respuesta específica si hay filtros
		if publicacionID == "1" && comentarioID == "2" && usuarioID == "3" {
			return c.JSON([]map[string]interface{}{
				{
					"id":             1,
					"publicacion_id": 1,
					"comentario_id":  2,
					"usuario_id":     3,
				},
			})
		}

		// Por defecto devolvemos lista vacía
		return c.JSON([]interface{}{})
	})

	return app
}

func TestStatusEndpoint(t *testing.T) {
	app := setupTestApp()

	req := httptest.NewRequest(http.MethodGet, "/status", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestMegustaEndpointSinFiltros(t *testing.T) {
	app := setupTestApp()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestMegustaEndpointConFiltros(t *testing.T) {
	app := setupTestApp()

	req := httptest.NewRequest(http.MethodGet, "/?publicacion_id=1&comentario_id=2&usuario_id=3", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}
