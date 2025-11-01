/**
 * Message contracts for the calculator Web Worker
 */

import type {
  CalculatorInputs,
  CalculationResults,
} from "@/lib/types/calculator";

export type CalculationWorkerRequest = {
  type: "calculate";
  id: number;
  inputs: CalculatorInputs;
};

export type CalculationWorkerSuccess = {
  type: "result";
  id: number;
  results: CalculationResults;
};

export type CalculationWorkerError = {
  type: "error";
  id: number;
  message: string;
};

export type CalculationWorkerResponse =
  | CalculationWorkerSuccess
  | CalculationWorkerError;
