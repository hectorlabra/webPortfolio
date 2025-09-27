import { describe, it, expect, vi } from "vitest";
import {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatTimePeriod,
  formatMonthLabel,
  transformToChartData,
  getValueColor,
  getTrendIndicator,
  debounce,
  clamp,
  isValidPositiveNumber,
  parseNumber,
  downsampleChartData,
} from "@/app/calculadora/lib/utils";

// Minimal fake results shape for transformToChartData
const fakeResults = {
  oneTimeRevenue: 1000,
  oneTimeProfit: 700,
  monthlyRevenue: [100, 90, 80],
  monthlyProfit: [70, 60, 50],
  cumulativeRevenue: [100, 190, 270],
  revenueDifference: 500,
  breakEvenPoint: 2,
  ltv: 350,
  paybackPeriod: 5,
};

describe("formatCurrency", () => {
  it("formats with symbol by default", () => {
    expect(formatCurrency(1234.56)).toMatch(/\$1,234\.56/);
  });
  it("honors fraction digit options", () => {
    expect(
      formatCurrency(10.2, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    ).toBe("$10.20");
  });
  it("can hide symbol", () => {
    expect(formatCurrency(100, { showSymbol: false })).toBe("100");
  });
});

describe("formatPercentage", () => {
  it("defaults to 1 decimal", () => {
    expect(formatPercentage(12.345)).toBe("12.3%");
  });
  it("supports custom decimals", () => {
    expect(formatPercentage(12.345, 2)).toBe("12.35%");
  });
});

describe("formatCompactNumber", () => {
  it("formats billions", () => {
    expect(formatCompactNumber(1_500_000_000)).toBe("$1.5B");
  });
  it("formats millions", () => {
    expect(formatCompactNumber(2_400_000)).toBe("$2.4M");
  });
  it("formats thousands", () => {
    expect(formatCompactNumber(25_000)).toBe("$25.0K");
  });
  it("falls back to currency", () => {
    expect(formatCompactNumber(250)).toBe("$250");
  });
});

describe("formatTimePeriod", () => {
  it("handles Infinity", () => {
    expect(formatTimePeriod(Infinity)).toBe("Nunca");
  });
  it("handles less than 1 month", () => {
    expect(formatTimePeriod(0.2)).toBe("Menos de 1 mes");
  });
  it("handles singular", () => {
    expect(formatTimePeriod(1)).toBe("1 mes");
  });
  it("handles months < 12", () => {
    expect(formatTimePeriod(5)).toBe("5 meses");
  });
  it("handles whole years", () => {
    expect(formatTimePeriod(24)).toBe("2 años");
  });
  it("handles years with remaining months", () => {
    expect(formatTimePeriod(14)).toBe("1 año y 2 meses");
  });
});

describe("formatMonthLabel", () => {
  it("month <= 12", () => {
    expect(formatMonthLabel(6)).toBe("Mes 6");
  });
  it("first month of later year", () => {
    expect(formatMonthLabel(13)).toBe("Año 2");
  });
  it("inner month of later year", () => {
    expect(formatMonthLabel(15)).toBe("A2M3");
  });
});

describe("transformToChartData", () => {
  it("creates timeHorizon entries with derived labels", () => {
    const data = transformToChartData(fakeResults as any, 3);
    expect(data).toHaveLength(3);
    expect(data[0].monthLabel).toBe("Mes 1");
    expect(data[2].subscriptionRevenue).toBe(80);
    expect(data[2].cumulativeSubscription).toBe(270);
  });
});

describe("getValueColor", () => {
  it("positive", () => expect(getValueColor(5)).toBe("text-green-600"));
  it("negative", () => expect(getValueColor(-1)).toBe("text-red-600"));
  it("zero", () => expect(getValueColor(0)).toBe("text-gray-600"));
});

describe("getTrendIndicator", () => {
  it("positive", () => expect(getTrendIndicator(3)).toBe("↑"));
  it("negative", () => expect(getTrendIndicator(-2)).toBe("↓"));
  it("neutral", () => expect(getTrendIndicator(0)).toBe("→"));
});

describe("debounce", () => {
  it("delays execution", async () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 50);
    debounced();
    debounced();
    expect(spy).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 70));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("clamp", () => {
  it("below min", () => expect(clamp(-5, 0, 10)).toBe(0));
  it("within range", () => expect(clamp(5, 0, 10)).toBe(5));
  it("above max", () => expect(clamp(15, 0, 10)).toBe(10));
});

describe("isValidPositiveNumber", () => {
  it("valid positive", () => expect(isValidPositiveNumber(5)).toBe(true));
  it("negative", () => expect(isValidPositiveNumber(-1)).toBe(false));
  it("NaN string", () => expect(isValidPositiveNumber("abc")).toBe(false));
});

describe("parseNumber", () => {
  it("passes through finite number", () => expect(parseNumber(42, 0)).toBe(42));
  it("returns fallback for NaN", () => expect(parseNumber("abc", 7)).toBe(7));
  it("parses currency-like string", () =>
    expect(parseNumber("$1,234.50", 0)).toBeCloseTo(1234.5));
});

describe("downsampleChartData", () => {
  it("returns shallow copy when data within limit", () => {
    const data = [1, 2, 3];
    const result = downsampleChartData(data, { maxPoints: 5 });
    expect(result).toEqual(data);
    expect(result).not.toBe(data);
  });

  it("limits number of points while preserving first/last", () => {
    const data = Array.from({ length: 10 }, (_, index) => ({
      index,
      value: index,
    }));

    const result = downsampleChartData(data, { maxPoints: 4 });

    expect(result[0].index).toBe(0);
    expect(result[result.length - 1].index).toBe(9);
    expect(result.length).toBeLessThanOrEqual(5); // includes last point addition
  });

  it("preserves specified indices", () => {
    const data = Array.from({ length: 20 }, (_, index) => index);
    const preserveIndex = 13;
    const result = downsampleChartData(data, {
      maxPoints: 5,
      preserveIndices: [preserveIndex],
    });

    expect(result).toContain(preserveIndex);
  });
});
