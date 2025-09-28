/**
 * Custom hook for calculator state management and calculations
 * Handles input validation, calculation logic, and result caching
 */

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useDeferredValue,
  useTransition,
  useRef,
} from "react";
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
  onValidationError?: (errors: ValidationError[]) => void;
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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const [isPending, startTransition] = useTransition();
  const calculationIdRef = useRef(0);
  const deferredInputs = useDeferredValue(state.inputs);

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
  const calculate = useCallback(
    (inputsOverride?: CalculatorInputs) => {
      const snapshot = inputsOverride ?? state.inputs;
      const calculationId = ++calculationIdRef.current;

      setState((prevState) => ({ ...prevState, isCalculating: true }));

      const errors = validateCalculatorInputs(snapshot);

      if (errors.length > 0) {
        setValidationErrors(errors);
        onValidationError?.(errors);
        setState((prevState) => ({ ...prevState, isCalculating: false }));
        return;
      }

      setValidationErrors([]);

      startTransition(() => {
        try {
          const results = calculateResults(snapshot);

          if (calculationIdRef.current !== calculationId) {
            return;
          }

          setState((prevState) => ({
            ...prevState,
            results,
            isCalculating: false,
            hasResults: true,
            lastCalculated: new Date(),
          }));

          onCalculationComplete?.(results);
        } catch (error) {
          console.error("Calculation error:", error);

          if (calculationIdRef.current !== calculationId) {
            return;
          }

          setValidationErrors([
            {
              field: "oneTimePrice",
              message:
                "Error en el cálculo. Por favor, verifica los datos ingresados.",
              severity: "error",
            },
          ]);

          setState((prevState) => ({ ...prevState, isCalculating: false }));
        }
      });
    },
    [state.inputs, onCalculationComplete, onValidationError, startTransition]
  );

  // Debounced calculation for auto-calculate mode
  const debouncedCalculate = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const [nextInputs] = args as [CalculatorInputs?];
        calculate(nextInputs);
      }, debounceMs),
    [calculate, debounceMs]
  );

  // Auto-calculate when inputs change (if enabled)
  useEffect(() => {
    if (autoCalculate && !state.isCalculating) {
      debouncedCalculate(deferredInputs);
    }
  }, [deferredInputs, autoCalculate, debouncedCalculate, state.isCalculating]);

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
    (field: keyof CalculatorInputs): ValidationError | null => {
      return (
        validationErrors.find((error) => error.field === field) ??
        validationErrors[0] ??
        null
      );
    },
    [validationErrors]
  );

  return {
    // State
    inputs: state.inputs,
    results: state.results,
    isCalculating: state.isCalculating,
    isPending,
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
