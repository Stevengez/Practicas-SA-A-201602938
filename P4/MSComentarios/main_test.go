package main

import (
	"testing"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"net/http/httptest"
	"net/http"
)

// Esta función crea una instancia de la aplicación solo con los endpoints que se van a testear.
func setupApp() *fiber.App {
	app := fiber.New()

	app.Get("/status", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	app.Get("/", func(c *fiber.Ctx) error {
		publicacionID := c.Query("publicacion_id")
		usuarioID := c.Query("usuario_id")

		// Aquí puedes simular datos o retornar respuestas mock
		if publicacionID == "1" && usuarioID == "1" {
			return c.JSON([]map[string]interface{}{
				{
					"id":             1,
					"contenido":      "Comentario de prueba",
					"publicacion_id": 1,
					"usuario_id":     1,
				},
			})
		}
		return c.JSON([]interface{}{}) // Devuelve lista vacía por defecto
	})

	return app
}

func TestStatusEndpoint(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodGet, "/status", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestComentariosEndpointSinFiltros(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestComentariosEndpointConFiltros(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodGet, "/?publicacion_id=1&usuario_id=1", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}
