/**
 * Custom hook for localStorage persistence with calculator data
 * Handles saving/loading calculator state with error handling and schema versioning
 */

import { useState, useEffect, useCallback } from "react";
import { CalculatorInputs, DEFAULT_INPUTS } from "@/lib/types/calculator";

interface StoredCalculatorData {
  version: string;
  inputs: CalculatorInputs;
  savedAt: string;
}

interface UseLocalStorageOptions {
  key?: string;
  version?: string;
  debounceMs?: number;
  onError?: (error: Error) => void;
  onLoad?: (data: CalculatorInputs) => void;
  onSave?: (data: CalculatorInputs) => void;
}

const DEFAULT_KEY = "calculadora-ingresos";
const CURRENT_VERSION = "1.0.0";

export function useLocalStorage(options: UseLocalStorageOptions = {}) {
  const {
    key = DEFAULT_KEY,
    version = CURRENT_VERSION,
    debounceMs = 1000,
    onError,
    onLoad,
    onSave,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasStorageSupport, setHasStorageSupport] = useState(false);

  // Check if localStorage is available
  const checkStorageSupport = useCallback(() => {
    try {
      const testKey = `${key}-test`;
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, [key]);

  // Load data from localStorage
  const loadFromStorage = useCallback((): CalculatorInputs => {
    try {
      if (!hasStorageSupport) {
        return DEFAULT_INPUTS;
      }

      const storedData = localStorage.getItem(key);

      if (!storedData) {
        return DEFAULT_INPUTS;
      }

      const parsed: StoredCalculatorData = JSON.parse(storedData);

      // Version check - migrate if needed
      if (parsed.version !== version) {
        console.log(
          `Migrating calculator data from version ${parsed.version} to ${version}`
        );
        // For now, just use default inputs on version mismatch
        // In the future, add migration logic here
        return DEFAULT_INPUTS;
      }

      // Validate stored data structure
      if (!parsed.inputs || typeof parsed.inputs !== "object") {
        return DEFAULT_INPUTS;
      }

      // Merge with defaults to ensure all fields exist
      const mergedInputs: CalculatorInputs = {
        ...DEFAULT_INPUTS,
        ...parsed.inputs,
      };

      // Basic validation
      if (mergedInputs.timeHorizon < 1 || mergedInputs.timeHorizon > 60) {
        mergedInputs.timeHorizon = DEFAULT_INPUTS.timeHorizon;
      }

      if (mergedInputs.churnRate < 0 || mergedInputs.churnRate > 50) {
        mergedInputs.churnRate = DEFAULT_INPUTS.churnRate;
      }

      onLoad?.(mergedInputs);
      return mergedInputs;
    } catch (error) {
      console.error("Error loading calculator data from localStorage:", error);
      onError?.(
        error instanceof Error ? error : new Error("Storage load error")
      );
      return DEFAULT_INPUTS;
    }
  }, [key, version, hasStorageSupport, onLoad, onError]);

  // Save data to localStorage
  const saveToStorage = useCallback(
    async (inputs: CalculatorInputs): Promise<boolean> => {
      try {
        if (!hasStorageSupport) {
          return false;
        }

        setIsSaving(true);

        const dataToStore: StoredCalculatorData = {
          version,
          inputs,
          savedAt: new Date().toISOString(),
        };

        localStorage.setItem(key, JSON.stringify(dataToStore));
        setLastSaved(new Date());
        onSave?.(inputs);

        return true;
      } catch (error) {
        console.error("Error saving calculator data to localStorage:", error);
        onError?.(
          error instanceof Error ? error : new Error("Storage save error")
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [key, version, hasStorageSupport, onSave, onError]
  );

  // Clear stored data
  const clearStorage = useCallback((): boolean => {
    try {
      if (!hasStorageSupport) {
        return false;
      }

      localStorage.removeItem(key);
      setLastSaved(null);
      return true;
    } catch (error) {
      console.error("Error clearing calculator data from localStorage:", error);
      onError?.(
        error instanceof Error ? error : new Error("Storage clear error")
      );
      return false;
    }
  }, [key, hasStorageSupport, onError]);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    try {
      if (!hasStorageSupport) {
        return null;
      }

      const storedData = localStorage.getItem(key);
      if (!storedData) {
        return null;
      }

      const parsed: StoredCalculatorData = JSON.parse(storedData);

      return {
        version: parsed.version,
        savedAt: new Date(parsed.savedAt),
        size: storedData.length,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return null;
    }
  }, [key, hasStorageSupport]);

  // Check if data exists in storage
  const hasStoredData = useCallback((): boolean => {
    if (!hasStorageSupport) return false;

    try {
      const data = localStorage.getItem(key);
      return data !== null;
    } catch {
      return false;
    }
  }, [key, hasStorageSupport]);

  // Initialize storage support check
  useEffect(() => {
    const supported = checkStorageSupport();
    setHasStorageSupport(supported);

    if (!supported) {
      console.warn(
        "localStorage not available, calculator data will not persist"
      );
    }

    setIsLoading(false);
  }, [checkStorageSupport]);

  // Debounced save function
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback(
    (inputs: CalculatorInputs) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      const timeout = setTimeout(() => {
        saveToStorage(inputs);
      }, debounceMs);

      setSaveTimeout(timeout);
    },
    [saveTimeout, saveToStorage, debounceMs]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  return {
    // State
    isLoading,
    isSaving,
    lastSaved,
    hasStorageSupport,

    // Actions
    loadFromStorage,
    saveToStorage,
    debouncedSave,
    clearStorage,

    // Utilities
    getStorageInfo,
    hasStoredData,

    // Status helpers
    canSave: hasStorageSupport && !isSaving,
    isReady: !isLoading && hasStorageSupport,
  };
}
