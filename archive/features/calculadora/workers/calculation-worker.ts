/// <reference lib="webworker" />

import { calculateResults } from "@/app/calculadora/lib/calculations";
import type {
  CalculationWorkerRequest,
  CalculationWorkerResponse,
} from "@/app/calculadora/lib/worker-messages";

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event: MessageEvent<CalculationWorkerRequest>) => {
  const data = event.data;

  if (!data || data.type !== "calculate") {
    return;
  }

  try {
    const results = calculateResults(data.inputs);

    const response: CalculationWorkerResponse = {
      type: "result",
      id: data.id,
      results,
    };

    self.postMessage(response);
  } catch (error) {
    const response: CalculationWorkerResponse = {
      type: "error",
      id: data.id,
      message:
        error instanceof Error
          ? error.message
          : "Error desconocido durante el cálculo",
    };

    self.postMessage(response);
  }
};

export {};
