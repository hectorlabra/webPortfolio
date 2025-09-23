/**
 * Custom hook for calculator state management and calculations
 * Handles input validation, calculation logic, and result caching
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CalculatorInputs,
  CalculationResults,
  CalculatorState,
  DEFAULT_INPUTS,
  ValidationError,
} from "@/lib/types/calculator";
import {
  calculateResults,
  validateCalculatorInputs,
} from "@/app/calculadora/lib/calculations";
import { debounce } from "@/app/calculadora/lib/utils";

interface UseCalculatorOptions {
  autoCalculate?: boolean;
  debounceMs?: number;
  onCalculationComplete?: (results: CalculationResults) => void;
  onValidationError?: (errors: string[]) => void;
}

export function useCalculator(options: UseCalculatorOptions = {}) {
  const {
    autoCalculate = true,
    debounceMs = 300,
    onCalculationComplete,
    onValidationError,
  } = options;

  // Main calculator state
  const [state, setState] = useState<CalculatorState>({
    inputs: DEFAULT_INPUTS,
    results: null,
    isCalculating: false,
    hasResults: false,
    lastCalculated: null,
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update individual input field
  const updateInput = useCallback(
    (field: keyof CalculatorInputs, value: number) => {
      setState((prevState) => ({
        ...prevState,
        inputs: {
          ...prevState.inputs,
          [field]: value,
        },
      }));
    },
    []
  );

  // Update multiple input fields at once
  const updateInputs = useCallback((updates: Partial<CalculatorInputs>) => {
    setState((prevState) => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        ...updates,
      },
    }));
  }, []);

  // Reset to default values
  const resetInputs = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      inputs: DEFAULT_INPUTS,
      results: null,
      hasResults: false,
      lastCalculated: null,
    }));
    setValidationErrors([]);
  }, []);

  // Perform calculation
  const calculate = useCallback(() => {
    setState((prevState) => ({ ...prevState, isCalculating: true }));

    // Validate inputs
    const errors = validateCalculatorInputs(state.inputs);

    if (errors.length > 0) {
      setValidationErrors(errors);
      onValidationError?.(errors);
      setState((prevState) => ({ ...prevState, isCalculating: false }));
      return;
    }

    try {
      // Clear validation errors
      setValidationErrors([]);

      // Perform calculations
      const results = calculateResults(state.inputs);

      // Update state with results
      setState((prevState) => ({
        ...prevState,
        results,
        isCalculating: false,
        hasResults: true,
        lastCalculated: new Date(),
      }));

      // Call completion callback
      onCalculationComplete?.(results);
    } catch (error) {
      console.error("Calculation error:", error);
      setValidationErrors([
        "Error en el cálculo. Por favor, verifica los datos ingresados.",
      ]);
      setState((prevState) => ({ ...prevState, isCalculating: false }));
    }
  }, [state.inputs, onCalculationComplete, onValidationError]);

  // Debounced calculation for auto-calculate mode
  const debouncedCalculate = useMemo(
    () => debounce(calculate, debounceMs),
    [calculate, debounceMs]
  );

  // Auto-calculate when inputs change (if enabled)
  useEffect(() => {
    if (autoCalculate && !state.isCalculating) {
      debouncedCalculate();
    }
  }, [state.inputs, autoCalculate, debouncedCalculate, state.isCalculating]);

  // Manual calculation trigger (for non-auto mode)
  const triggerCalculation = useCallback(() => {
    if (!state.isCalculating) {
      calculate();
    }
  }, [calculate, state.isCalculating]);

  // Check if current inputs are different from last calculation
  const hasUnsavedChanges = useMemo(() => {
    if (!state.results || !state.lastCalculated) return true;

    // Simple comparison - in a real app, you might want to deep compare
    return JSON.stringify(state.inputs) !== JSON.stringify(DEFAULT_INPUTS);
  }, [state.inputs, state.results, state.lastCalculated]);

  // Validation state
  const isValid = validationErrors.length === 0;
  const hasValidationErrors = validationErrors.length > 0;

  // Calculation status helpers
  const canCalculate = isValid && !state.isCalculating;
  const shouldShowResults =
    state.hasResults && isValid && state.results !== null;

  // Input change handler with validation
  const handleInputChange = useCallback(
    (field: keyof CalculatorInputs, value: string | number) => {
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;
      updateInput(field, numValue);
    },
    [updateInput]
  );

  // Get field-specific validation errors
  const getFieldError = useCallback(
    (field: keyof CalculatorInputs): string | null => {
      // This could be enhanced to return field-specific errors
      // For now, return the first general error if any
      return validationErrors.length > 0 ? validationErrors[0] : null;
    },
    [validationErrors]
  );

  return {
    // State
    inputs: state.inputs,
    results: state.results,
    isCalculating: state.isCalculating,
    hasResults: state.hasResults,
    lastCalculated: state.lastCalculated,

    // Validation
    validationErrors,
    isValid,
    hasValidationErrors,
    getFieldError,

    // Status
    canCalculate,
    shouldShowResults,
    hasUnsavedChanges,

    // Actions
    updateInput,
    updateInputs,
    handleInputChange,
    resetInputs,
    calculate: triggerCalculation,

    // Computed values for convenience
    timeHorizon: state.inputs.timeHorizon,
    breakEvenPoint: state.results?.breakEvenPoint || -1,
    totalOneTimeProfit: state.results?.oneTimeProfit || 0,
    totalSubscriptionProfit:
      state.results?.cumulativeProfit?.[
        state.results.cumulativeProfit.length - 1
      ] || 0,
  };
}
