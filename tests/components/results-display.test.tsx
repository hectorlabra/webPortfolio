import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/test-utils/render";
import { ResultsDisplay } from "@/app/calculadora/components/results-display";
import { CalculationResults } from "@/lib/types/calculator";

function makeResults(partial: Partial<CalculationResults>): CalculationResults {
  return {
    oneTimeRevenue: 5000,
    oneTimeProfit: 3500,
    oneTimeMargin: 70,
    monthlyRevenue: [500, 600, 700, 650, 620, 610, 605, 600],
    cumulativeRevenue: [500, 1100, 1800, 2450, 3070, 3680, 4285, 4885],
    monthlyProfit: [300, 350, 400, 370, 360, 355, 352, 350],
    cumulativeProfit: [300, 650, 1050, 1420, 1780, 2135, 2487, 2837],
    ltv: 420,
    paybackPeriod: 8,
    revenueDifference: 2000,
    profitDifference: 1200,
    breakEvenPoint: 6,
    ...partial,
  };
}

describe("ResultsDisplay", () => {
  it("muestra encabezado y horizonte", () => {
    renderWithProviders(
      <ResultsDisplay results={makeResults({})} timeHorizon={24} />
    );
    expect(
      screen.getByText(/Resultados de la Comparación/)
    ).toBeInTheDocument();
    expect(screen.getByText(/24 meses/)).toBeInTheDocument();
  });

  it("indica cuando suscripción es más rentable", () => {
    renderWithProviders(
      <ResultsDisplay
        results={makeResults({ profitDifference: 500 })}
        timeHorizon={12}
      />
    );
    expect(screen.getByText(/más rentable/)).toBeInTheDocument();
  });

  it("indica cuando modelo único es más rentable", () => {
    renderWithProviders(
      <ResultsDisplay
        results={makeResults({ profitDifference: -500 })}
        timeHorizon={12}
      />
    );
    expect(
      screen.getByText(/modelo único es más rentable/)
    ).toBeInTheDocument();
  });

  it("muestra punto de equilibrio alcanzado", () => {
    renderWithProviders(
      <ResultsDisplay
        results={makeResults({ breakEvenPoint: 5 })}
        timeHorizon={12}
      />
    );
    expect(screen.getByText(/Punto de Equilibrio/)).toBeInTheDocument();
    const matches = screen.getAllByText(/Mes 5/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("muestra 'No alcanzado' si no hay equilibrio en horizonte", () => {
    renderWithProviders(
      <ResultsDisplay
        results={makeResults({ breakEvenPoint: 20 })}
        timeHorizon={12}
      />
    );
    expect(screen.getByText(/No alcanzado/)).toBeInTheDocument();
  });

  it("muestra 'Sin equilibrio' cuando breakEvenPoint = -1", () => {
    renderWithProviders(
      <ResultsDisplay
        results={makeResults({ breakEvenPoint: -1 })}
        timeHorizon={12}
      />
    );
    expect(screen.getByText(/Sin equilibrio/)).toBeInTheDocument();
  });

  it("renderiza resumen ejecutivo con métricas clave", () => {
    renderWithProviders(
      <ResultsDisplay results={makeResults({})} timeHorizon={24} />
    );
    expect(screen.getByText(/Lifetime Value/)).toBeInTheDocument();
    expect(screen.getByText(/Punto de Equilibrio/)).toBeInTheDocument();
    expect(screen.getByText(/Margen Producto Único/)).toBeInTheDocument();
    expect(screen.getByText(/Comparación de Ingresos/)).toBeInTheDocument();
    expect(screen.getByText(/Comparación de Beneficios/)).toBeInTheDocument();
  });
});
