import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/test-utils/render";
import { CalculatorInputs } from "@/app/calculadora/components/calculator-inputs";
import {
  CALCULATOR_CONFIG,
  CalculatorInputs as ICalculatorInputs,
} from "@/lib/types/calculator";

const baseInputs: ICalculatorInputs = {
  oneTimePrice: 97,
  oneTimeCost: 20,
  oneTimeCustomers: 1000,
  conversionRate: 2.5,
  subscriptionPrice: 29,
  subscriptionCost: 5,
  churnRate: 5,
  timeHorizon: 24,
  discountRate: 10,
};

describe("CalculatorInputs component", () => {
  let onInputChangeAction: ReturnType<typeof vi.fn>;
  let onCalculate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onInputChangeAction = vi.fn();
    onCalculate = vi.fn();
  });

  const setup = (
    props: Partial<React.ComponentProps<typeof CalculatorInputs>> = {}
  ) => {
    renderWithProviders(
      <CalculatorInputs
        inputs={baseInputs}
        onInputChangeAction={onInputChangeAction}
        onCalculate={onCalculate}
        validationErrors={[]}
        autoCalculate={true}
        {...props}
      />
    );
  };

  it("renders all main input labels", () => {
    setup();
    [
      "Precio del Producto",
      "Costo por Cliente",
      "Clientes Objetivo",
      "Tasa de Conversión",
      "Precio Mensual",
      "Costo Mensual por Cliente",
      "Tasa de Abandono",
      "Horizonte Temporal (meses)",
      "Tasa de Descuento",
    ].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("calls onInputChangeAction when changing numeric field", () => {
    setup();
    const input = screen.getByLabelText(
      "Precio del Producto"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "150" } });
    expect(onInputChangeAction).toHaveBeenCalledWith(
      "oneTimePrice",
      expect.any(Number)
    );
  });

  it("enforces min boundary (timeHorizon) on change", () => {
    setup();
    const input = screen.getByLabelText(
      "Horizonte Temporal (meses)"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0" } });
    // The callback receives clamped value >= MIN_TIME_HORIZON
    expect(onInputChangeAction).toHaveBeenCalledWith(
      "timeHorizon",
      CALCULATOR_CONFIG.MIN_TIME_HORIZON
    );
  });

  it("shows calculate button if autoCalculate=false and triggers onCalculate", () => {
    setup({ autoCalculate: false, canCalculate: true });
    const button = screen.getByRole("button", {
      name: /Calcular Comparación/i,
    });
    fireEvent.click(button);
    expect(onCalculate).toHaveBeenCalled();
  });

  it("displays validation errors list", () => {
    const errors = ["Error 1", "Error 2"];
    setup({ validationErrors: errors });
    errors.forEach((e) => expect(screen.getByText(e)).toBeInTheDocument());
  });
});
