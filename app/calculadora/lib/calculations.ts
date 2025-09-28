/**
 * Financial calculation functions for Revenue Calculator
 * Implements standard SaaS financial metrics and comparisons
 */

import {
  CalculatorInputs,
  CalculationResults,
  ValidationError,
} from "@/lib/types/calculator";

const CALCULATION_CACHE_KEYS: Array<keyof CalculatorInputs> = [
  "oneTimePrice",
  "oneTimeCost",
  "oneTimeCustomers",
  "subscriptionPrice",
  "subscriptionCost",
  "churnRate",
  "timeHorizon",
  "conversionRate",
  "discountRate",
];

const MAX_CALCULATION_CACHE_SIZE = 50;

const calculationResultsCache = new Map<string, CalculationResults>();

function formatCacheValue(value: number): string {
  if (Number.isNaN(value)) return "NaN";
  if (!Number.isFinite(value)) return value > 0 ? "Infinity" : "-Infinity";
  if (Object.is(value, -0)) return "0";
  return value === 0 ? "0" : value.toString();
}

function createInputsSignature(inputs: CalculatorInputs): string {
  return CALCULATION_CACHE_KEYS.map((key) =>
    formatCacheValue(inputs[key])
  ).join("|");
}

function addToCache(signature: string, results: CalculationResults) {
  calculationResultsCache.set(signature, results);
  if (calculationResultsCache.size > MAX_CALCULATION_CACHE_SIZE) {
    const oldestKey = calculationResultsCache.keys().next().value;
    if (oldestKey) {
      calculationResultsCache.delete(oldestKey);
    }
  }
}

export function clearCalculationCache() {
  calculationResultsCache.clear();
}

/**
 * Calculate Lifetime Value (LTV) for subscription model
 * Formula: (Monthly Revenue × Gross Margin) / (Churn Rate + Discount Rate)
 */
export function calculateLTV(
  monthlyRevenue: number,
  monthlyCost: number,
  churnRate: number,
  discountRate: number
): number {
  const grossMargin = monthlyRevenue - monthlyCost;
  const denominator = churnRate / 100 + discountRate / 100;

  if (denominator === 0) return 0;

  return grossMargin / denominator;
}

/**
 * Calculate payback period in months
 * Time needed to recover initial investment
 */
export function calculatePaybackPeriod(
  initialInvestment: number,
  monthlyProfit: number
): number {
  if (monthlyProfit <= 0) return Infinity;
  return initialInvestment / monthlyProfit;
}

/**
 * Calculate monthly revenue for subscription model with churn
 * Takes into account customer acquisition and churn over time
 */
export function calculateMonthlyRevenue(
  initialCustomers: number,
  monthlyPrice: number,
  churnRate: number,
  timeHorizon: number
): number[] {
  const revenues: number[] = [];
  let currentCustomers = initialCustomers;
  const monthlyChurnRate = churnRate / 100;

  for (let month = 1; month <= timeHorizon; month++) {
    revenues.push(currentCustomers * monthlyPrice);
    // Apply churn for next month
    currentCustomers = currentCustomers * (1 - monthlyChurnRate);
  }

  return revenues;
}

/**
 * Calculate cumulative revenue array from monthly revenue
 */
export function calculateCumulativeRevenue(monthlyRevenue: number[]): number[] {
  return monthlyRevenue.reduce(
    (acc: number[], current: number, index: number) => {
      const cumulative = index === 0 ? current : acc[index - 1] + current;
      acc.push(cumulative);
      return acc;
    },
    []
  );
}

/**
 * Calculate monthly profit (revenue - costs)
 */
export function calculateMonthlyProfit(
  monthlyRevenue: number[],
  monthlyCost: number,
  initialCustomers: number,
  churnRate: number
): number[] {
  const profits: number[] = [];
  let currentCustomers = initialCustomers;
  const monthlyChurnRate = churnRate / 100;

  monthlyRevenue.forEach((revenue) => {
    const totalCosts = currentCustomers * monthlyCost;
    profits.push(revenue - totalCosts);
    currentCustomers = currentCustomers * (1 - monthlyChurnRate);
  });

  return profits;
}

/**
 * Find break-even point where subscription model surpasses one-time model
 * Returns the month number, or -1 if never breaks even
 */
export function findBreakEvenPoint(
  oneTimeProfit: number,
  cumulativeSubscriptionProfit: number[]
): number {
  for (let i = 0; i < cumulativeSubscriptionProfit.length; i++) {
    if (cumulativeSubscriptionProfit[i] >= oneTimeProfit) {
      return i + 1; // Month numbers start at 1
    }
  }
  return -1; // Never breaks even within time horizon
}

/**
 * Calculate profit margin percentage
 */
export function calculateMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

/**
 * Main calculation function that processes all inputs and returns complete results
 */
export function calculateResults(inputs: CalculatorInputs): CalculationResults {
  const signature = createInputsSignature(inputs);
  const cachedResults = calculationResultsCache.get(signature);

  if (cachedResults) {
    return cachedResults;
  }

  // One-time model calculations
  const adjustedCustomers =
    inputs.oneTimeCustomers * (inputs.conversionRate / 100);
  const oneTimeRevenue = adjustedCustomers * inputs.oneTimePrice;
  const oneTimeTotalCost = adjustedCustomers * inputs.oneTimeCost;
  const oneTimeProfit = oneTimeRevenue - oneTimeTotalCost;
  const oneTimeMargin = calculateMargin(oneTimeRevenue, oneTimeTotalCost);

  // Subscription model calculations
  const subscriptionCustomers = adjustedCustomers; // Same conversion rate applied
  const monthlyRevenue = calculateMonthlyRevenue(
    subscriptionCustomers,
    inputs.subscriptionPrice,
    inputs.churnRate,
    inputs.timeHorizon
  );

  const monthlyProfit = calculateMonthlyProfit(
    monthlyRevenue,
    inputs.subscriptionCost,
    subscriptionCustomers,
    inputs.churnRate
  );

  const cumulativeRevenue = calculateCumulativeRevenue(monthlyRevenue);
  const cumulativeProfit = calculateCumulativeRevenue(monthlyProfit);

  // Advanced metrics
  const ltv = calculateLTV(
    inputs.subscriptionPrice,
    inputs.subscriptionCost,
    inputs.churnRate,
    inputs.discountRate
  );

  const monthlyNetProfit = inputs.subscriptionPrice - inputs.subscriptionCost;
  const paybackPeriod = calculatePaybackPeriod(
    inputs.subscriptionCost,
    monthlyNetProfit
  );

  // Comparisons
  const finalSubscriptionRevenue =
    cumulativeRevenue[cumulativeRevenue.length - 1] || 0;
  const finalSubscriptionProfit =
    cumulativeProfit[cumulativeProfit.length - 1] || 0;

  const revenueDifference = finalSubscriptionRevenue - oneTimeRevenue;
  const profitDifference = finalSubscriptionProfit - oneTimeProfit;
  const breakEvenPoint = findBreakEvenPoint(oneTimeProfit, cumulativeProfit);

  const results: CalculationResults = {
    // One-time results
    oneTimeRevenue: Math.round(oneTimeRevenue * 100) / 100,
    oneTimeProfit: Math.round(oneTimeProfit * 100) / 100,
    oneTimeMargin: Math.round(oneTimeMargin * 10) / 10,

    // Subscription results
    monthlyRevenue: monthlyRevenue.map((r) => Math.round(r * 100) / 100),
    cumulativeRevenue: cumulativeRevenue.map((r) => Math.round(r * 100) / 100),
    monthlyProfit: monthlyProfit.map((p) => Math.round(p * 100) / 100),
    cumulativeProfit: cumulativeProfit.map((p) => Math.round(p * 100) / 100),
    ltv: Math.round(ltv * 100) / 100,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,

    // Comparisons
    revenueDifference: Math.round(revenueDifference * 100) / 100,
    profitDifference: Math.round(profitDifference * 100) / 100,
    breakEvenPoint,
  };

  addToCache(signature, results);

  return results;
}

/**
 * Validate inputs for calculation
 * Returns array of validation errors
 */
export function validateCalculatorInputs(
  inputs: CalculatorInputs
): ValidationError[] {
  const errors: ValidationError[] = [];

  const addError = (
    field: keyof CalculatorInputs,
    message: string,
    severity: ValidationError["severity"] = "error"
  ) => {
    errors.push({ field, message, severity });
  };

  if (inputs.oneTimePrice <= 0)
    addError(
      "oneTimePrice",
      "El precio del producto único debe ser mayor a 0."
    );
  if (inputs.oneTimeCost < 0)
    addError("oneTimeCost", "El costo por cliente no puede ser negativo.");
  if (inputs.oneTimeCustomers <= 0)
    addError("oneTimeCustomers", "El número de clientes debe ser mayor a 0.");

  if (inputs.subscriptionPrice <= 0)
    addError(
      "subscriptionPrice",
      "El precio de suscripción debe ser mayor a 0."
    );
  if (inputs.subscriptionCost < 0)
    addError(
      "subscriptionCost",
      "El costo de suscripción no puede ser negativo."
    );
  if (inputs.churnRate < 0 || inputs.churnRate > 50)
    addError("churnRate", "La tasa de abandono debe estar entre 0% y 50%.");
  if (inputs.timeHorizon < 1 || inputs.timeHorizon > 60)
    addError(
      "timeHorizon",
      "El horizonte temporal debe estar entre 1 y 60 meses."
    );

  if (inputs.conversionRate <= 0 || inputs.conversionRate > 100)
    addError(
      "conversionRate",
      "La tasa de conversión debe estar entre 0% y 100%."
    );
  if (inputs.discountRate < 0 || inputs.discountRate > 50)
    addError("discountRate", "La tasa de descuento debe estar entre 0% y 50%.");

  return errors;
}
