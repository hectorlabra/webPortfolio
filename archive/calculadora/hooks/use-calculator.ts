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
import type {
  CalculationWorkerRequest,
  CalculationWorkerResponse,
} from "@/app/calculadora/lib/worker-messages";
import { debounce } from "@/app/calculadora/lib/utils";

type WorkerMode = "auto" | "always" | "never";

interface UseCalculatorOptions {
  autoCalculate?: boolean;
  debounceMs?: number;
  onCalculationComplete?: (results: CalculationResults) => void;
  onValidationError?: (errors: ValidationError[]) => void;
  workerMode?: WorkerMode;
}

export function useCalculator(options: UseCalculatorOptions = {}) {
  const {
    autoCalculate = true,
    debounceMs = 300,
    onCalculationComplete,
    onValidationError,
    workerMode = "auto",
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

  const workerRef = useRef<Worker | null>(null);
  const pendingInputsRef = useRef<Map<number, CalculatorInputs>>(new Map());
  const onCalculationCompleteRef = useRef(onCalculationComplete);

  const [isPending, startTransition] = useTransition();
  const calculationIdRef = useRef(0);
  const deferredInputs = useDeferredValue(state.inputs);

  useEffect(() => {
    onCalculationCompleteRef.current = onCalculationComplete;
  }, [onCalculationComplete]);

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

      const worker = workerRef.current;
      const canUseWorker =
        workerMode !== "never" &&
        worker &&
        (workerMode === "always" || shouldUseCalculationWorker(snapshot));

      if (canUseWorker) {
        pendingInputsRef.current.set(calculationId, { ...snapshot });

        const message: CalculationWorkerRequest = {
          type: "calculate",
          id: calculationId,
          inputs: snapshot,
        };

        try {
          worker.postMessage(message);
          return;
        } catch (error) {
          console.error("Fallo al delegar cálculo al worker:", error);
          pendingInputsRef.current.delete(calculationId);
        }
      }

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

          onCalculationCompleteRef.current?.(results);
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
    [state.inputs, workerMode, onValidationError, startTransition]
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

  useEffect(() => {
    if (typeof window === "undefined" || !("Worker" in window)) {
      return;
    }

    try {
      const worker = new Worker(
        new URL("../workers/calculation-worker.ts", import.meta.url),
        { type: "module" }
      );

      workerRef.current = worker;

      const handleMessage = (
        event: MessageEvent<CalculationWorkerResponse>
      ) => {
        const data = event.data;

        if (!data) {
          return;
        }

        const pendingInputs = pendingInputsRef.current.get(data.id);
        pendingInputsRef.current.delete(data.id);

        if (data.id !== calculationIdRef.current) {
          return;
        }

        if (data.type === "result") {
          startTransition(() => {
            setState((prevState) => ({
              ...prevState,
              results: data.results,
              isCalculating: false,
              hasResults: true,
              lastCalculated: new Date(),
            }));
          });

          onCalculationCompleteRef.current?.(data.results);
        } else if (data.type === "error") {
          console.error("Calculation worker error:", data.message);

          if (pendingInputs) {
            try {
              const results = calculateResults(pendingInputs);

              startTransition(() => {
                setState((prevState) => ({
                  ...prevState,
                  results,
                  isCalculating: false,
                  hasResults: true,
                  lastCalculated: new Date(),
                }));
              });

              onCalculationCompleteRef.current?.(results);
              return;
            } catch (fallbackError) {
              console.error("Fallback calculation error:", fallbackError);
            }
          }

          startTransition(() => {
            setState((prevState) => ({
              ...prevState,
              isCalculating: false,
            }));
          });

          setValidationErrors([
            {
              field: "oneTimePrice",
              message:
                "Error en el cálculo. Por favor, verifica los datos ingresados.",
              severity: "error",
            },
          ]);
        }
      };

      const handleError = (event: ErrorEvent) => {
        console.error("Calculation worker crashed:", event.message);
      };

      const pendingInputsMap = pendingInputsRef.current;

      worker.addEventListener("message", handleMessage as EventListener);
      worker.addEventListener("error", handleError as EventListener);

      return () => {
        worker.removeEventListener("message", handleMessage as EventListener);
        worker.removeEventListener("error", handleError as EventListener);
        worker.terminate();
        workerRef.current = null;
        pendingInputsMap.clear();
      };
    } catch (error) {
      console.error("Failed to initialize calculation worker:", error);
    }
  }, [startTransition]);

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

const WORKER_TIME_HORIZON_THRESHOLD = 36;
const WORKER_CUSTOMER_THRESHOLD = 5000;

function shouldUseCalculationWorker(inputs: CalculatorInputs): boolean {
  return (
    inputs.timeHorizon >= WORKER_TIME_HORIZON_THRESHOLD ||
    inputs.oneTimeCustomers >= WORKER_CUSTOMER_THRESHOLD
  );
}
