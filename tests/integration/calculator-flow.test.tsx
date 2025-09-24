import React from "react";
import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/test-utils/render";
import CalculadoraPage from "@/app/calculadora/page";

// Integration test simulating user modifying inputs and seeing results area appear.

describe("Calculator Flow Integration", () => {
  it("muestra estado vacío inicialmente y luego resultados tras cambios", async () => {
    renderWithProviders(<CalculadoraPage />);

    // Empty state visible
    expect(
      screen.getByText(/Configura tu producto arriba/i)
    ).toBeInTheDocument();

    // Cambiamos algunos campos clave
    const precioProducto = screen.getByLabelText(/Precio del Producto/i);
    fireEvent.change(precioProducto, { target: { value: "150" } });

    const precioMensual = screen.getByLabelText(/Precio Mensual/i);
    fireEvent.change(precioMensual, { target: { value: "39" } });

    const churn = screen.getByLabelText(/Tasa de Abandono/i);
    fireEvent.change(churn, { target: { value: "4" } });

    // Esperar a que aparezcan los resultados (auto-cálculo debounce ~500ms en page -> hook 300ms default + local debounce usage)
    const resultados = await screen.findByText(
      /Resultados del Análisis/,
      {},
      { timeout: 5000 }
    );
    expect(resultados).toBeInTheDocument();
    expect(
      await screen.findByText(/Comparación de Ingresos/, {}, { timeout: 5000 })
    ).toBeInTheDocument();
  });

  it("permite reiniciar y volver al estado vacío", async () => {
    renderWithProviders(<CalculadoraPage />);

    // Aseguramos aparición de resultados primero
    const precioProducto = screen.getByLabelText(/Precio del Producto/i);
    fireEvent.change(precioProducto, { target: { value: "150" } });

    expect(
      await screen.findByText(/Resultados del Análisis/, {}, { timeout: 5000 })
    ).toBeInTheDocument();

    // Mock confirm para evitar interacción real
    const originalConfirm = window.confirm;
    // @ts-ignore
    window.confirm = () => true;

    const resetButton = screen.getByRole("button", { name: /Reiniciar/i });
    fireEvent.click(resetButton);

    // Debe volver a estado vacío
    await screen.findByText(
      /Configura tu producto arriba/,
      {},
      { timeout: 3000 }
    );

    window.confirm = originalConfirm;
  });
});
