import React from "react";
import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/tests/test-utils/render";
import CalculadoraPage from "@/app/calculadora/page";

async function completeWizardAndGenerateResults() {
  const precioProducto = screen.getByLabelText(/Precio del Producto Único/i);
  fireEvent.change(precioProducto, { target: { value: "150" } });

  const costoProducto = screen.getByLabelText(/Costo por Cliente \(Único\)/i);
  fireEvent.change(costoProducto, { target: { value: "30" } });

  const conversion = screen.getByLabelText(/Tasa de Conversión/i);
  fireEvent.change(conversion, { target: { value: "5" } });

  const avanzarPasoUno = screen.getByRole("button", {
    name: /Calcular Modelo Único/i,
  });
  fireEvent.click(avanzarPasoUno);

  await screen.findByRole("heading", {
    name: /Modelo de Suscripción Recurrente/i,
  });

  const precioMensual = screen.getByLabelText(/Precio Mensual de Suscripción/i);
  fireEvent.change(precioMensual, { target: { value: "39" } });

  const costoMensual = screen.getByLabelText(/Costo Mensual por Cliente/i);
  fireEvent.change(costoMensual, { target: { value: "9" } });

  const churnMensual = screen.getByLabelText(/Tasa de Abandono Mensual/i);
  fireEvent.change(churnMensual, { target: { value: "4" } });

  const horizonte = screen.getByLabelText(/Horizonte Temporal/i);
  fireEvent.change(horizonte, { target: { value: "12" } });

  const avanzarPasoDos = screen.getByRole("button", {
    name: /Calcular Modelo de Suscripción/i,
  });
  fireEvent.click(avanzarPasoDos);

  await screen.findByRole("heading", { name: /Resumen del Análisis/i });

  const descuento = screen.getByLabelText(/Tasa de Descuento/i);
  fireEvent.change(descuento, { target: { value: "10" } });

  const generar = screen.getByRole("button", { name: /Generar análisis/i });
  fireEvent.click(generar);

  return screen.findByText(/Resultados principales/, {}, { timeout: 5000 });
}

describe("Calculator Flow Integration", () => {
  it("muestra estado vacío inicialmente y luego resultados tras cambios", async () => {
    renderWithProviders(<CalculadoraPage />);

    expect(screen.getByText(/Tu ruta hacia el análisis/i)).toBeInTheDocument();

    const resultados = await completeWizardAndGenerateResults();
    expect(resultados).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Visualización de crecimiento/,
        {},
        { timeout: 5000 }
      )
    ).toBeInTheDocument();
  });

  it("permite reiniciar y volver al estado vacío", async () => {
    renderWithProviders(<CalculadoraPage />);

    await completeWizardAndGenerateResults();

    const originalConfirm = window.confirm;
    // @ts-ignore
    window.confirm = () => true;

    const resetButton = screen.getByRole("button", { name: /Reiniciar/i });
    fireEvent.click(resetButton);

    await screen.findByText(/Tu ruta hacia el análisis/, {}, { timeout: 3000 });

    window.confirm = originalConfirm;
  });
});
