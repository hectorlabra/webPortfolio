import { test, expect } from "@playwright/test";

// E2E: flujo principal de la calculadora (modelo único vs suscripción)

test.describe("Calculadora de Ingresos - Flujo Principal", () => {
  test("Carga, modifica inputs y muestra resultados", async ({ page }) => {
    await page.goto("/calculadora");
    await page.evaluate(() => window.localStorage.clear());

    // Hero visible
    await expect(
      page.getByRole("heading", { name: /Calculadora de Ingresos/i })
    ).toBeVisible();

    // Empty state antes de resultados
    await expect(page.getByText(/Configura tu producto arriba/i)).toBeVisible();

    // Interacción con algunos campos clave
    const precioProducto = page.getByLabel("Precio del Producto");
    await precioProducto.fill("149");

    const precioMensual = page.getByLabel("Precio Mensual");
    await precioMensual.fill("39");

    const churn = page.getByLabel("Tasa de Abandono");
    await churn.fill("4");

    // Esperar a que desaparezca el empty state y aparezcan resultados
    await expect(page.getByText(/Resultados del Análisis/)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/Comparación de Ingresos/)).toBeVisible();
    await expect(page.getByText(/Comparación de Beneficios/)).toBeVisible();

    // Validar que aparece un indicador de recomendación (texto parcial)
    await expect(
      page.getByRole("heading", {
        name: /El modelo de suscripción es más rentable/i,
      })
    ).toBeVisible();
  });

  test("Reiniciar restablece el estado", async ({ page }) => {
    await page.goto("/calculadora");
    await page.evaluate(() => window.localStorage.clear());

    // Rellenar campos para que aparezcan los resultados
    const precioProducto = page.getByLabel("Precio del Producto");
    await precioProducto.fill("180");
    const precioMensual = page.getByLabel("Precio Mensual");
    await precioMensual.fill("25");
    const churn = page.getByLabel("Tasa de Abandono");
    await churn.fill("5");

    // Añadimos una pequeña espera para dar tiempo a que la UI reaccione
    await page.waitForTimeout(500);

    // Verificar que los resultados son visibles antes de reiniciar
    await expect(page.getByText(/Resultados del Análisis/)).toBeVisible({
      timeout: 10_000,
    });

    // Interceptar y aceptar el diálogo de confirmación
    page.once("dialog", (dialog) => dialog.accept());

    // Hacer clic en reiniciar y esperar a que la UI reaccione
    // Esperamos a que el botón de reiniciar desaparezca o cambie,
    // indicando que el estado se ha limpiado.
    await expect(async () => {
      await page.getByRole("button", { name: /Reiniciar/i }).click();
      await expect(page.getByText(/Resultados del Análisis/)).toBeHidden();
    }).toPass();

    // Verificar que el estado vacío es visible de nuevo
    await expect(page.getByText(/Configura tu producto arriba/i)).toBeVisible();
  });
});
