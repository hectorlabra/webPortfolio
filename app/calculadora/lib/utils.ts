/**
 * Utility functions for data formatting and display
 * Handles currency, percentages, and other display formats
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartDataPoint, CalculationResults } from "@/lib/types/calculator";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as currency (USD)
 */
export function formatCurrency(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    showSymbol = true,
  } = options;

  const formatted = new Intl.NumberFormat("en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  return formatted;
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

/**
 * Format time period (months to readable format)
 */
export function formatTimePeriod(months: number): string {
  if (months === Infinity) return "Nunca";
  if (months < 1) return "Menos de 1 mes";
  if (months === 1) return "1 mes";
  if (months < 12) return `${Math.ceil(months)} meses`;

  const years = Math.floor(months / 12);
  const remainingMonths = Math.ceil(months % 12);

  if (remainingMonths === 0) {
    return `${years} año${years > 1 ? "s" : ""}`;
  }

  return `${years} año${years > 1 ? "s" : ""} y ${remainingMonths} mes${
    remainingMonths > 1 ? "es" : ""
  }`;
}

/**
 * Format month labels for charts (1 -> "Mes 1", 12 -> "Año 1")
 */
export function formatMonthLabel(month: number): string {
  if (month <= 12) return `Mes ${month}`;

  const years = Math.floor((month - 1) / 12);
  const monthInYear = ((month - 1) % 12) + 1;

  if (monthInYear === 1) return `Año ${years + 1}`;
  return `A${years + 1}M${monthInYear}`;
}

/**
 * Transform calculation results into chart data points
 */
export function transformToChartData(
  results: CalculationResults,
  timeHorizon: number
): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = [];

  for (let month = 1; month <= timeHorizon; month++) {
    const index = month - 1;

    chartData.push({
      month,
      monthLabel: formatMonthLabel(month),
      oneTimeRevenue: results.oneTimeRevenue,
      oneTimeProfit: results.oneTimeProfit,
      subscriptionRevenue: results.monthlyRevenue[index] || 0,
      subscriptionProfit: results.monthlyProfit[index] || 0,
      cumulativeOneTime: results.oneTimeRevenue,
      cumulativeSubscription: results.cumulativeRevenue[index] || 0,
    });
  }

  return chartData;
}

/**
 * Calculate color based on positive/negative value
 */
export function getValueColor(value: number): string {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-gray-600";
}

/**
 * Get trend indicator (↑, ↓, →)
 */
export function getTrendIndicator(value: number): string {
  if (value > 0) return "↑";
  if (value < 0) return "↓";
  return "→";
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if value is a valid positive number
 */
export function isValidPositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Safe number parsing with fallback
 */
export function parseNumber(
  value: string | number,
  fallback: number = 0
): number {
  if (typeof value === "number") return isFinite(value) ? value : fallback;

  const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return isFinite(parsed) ? parsed : fallback;
}

/**
 * Generate insights text based on calculation results
 */
export function generateInsightsText(
  results: CalculationResults,
  timeHorizon: number
): {
  title: string;
  description: string;
  isPositive: boolean;
}[] {
  const insights = [];

  // Revenue comparison
  if (results.revenueDifference > 0) {
    insights.push({
      title: "Ingresos Superiores",
      description: `El modelo de suscripción genera ${formatCurrency(
        results.revenueDifference
      )} más en ${timeHorizon} meses`,
      isPositive: true,
    });
  } else if (results.revenueDifference < 0) {
    insights.push({
      title: "Ingresos Menores",
      description: `El modelo único genera ${formatCurrency(
        Math.abs(results.revenueDifference)
      )} más`,
      isPositive: false,
    });
  }

  // Break-even point
  if (results.breakEvenPoint > 0 && results.breakEvenPoint <= timeHorizon) {
    insights.push({
      title: "Punto de Equilibrio",
      description: `La suscripción supera el modelo único en ${formatTimePeriod(
        results.breakEvenPoint
      )}`,
      isPositive: true,
    });
  } else if (results.breakEvenPoint === -1) {
    insights.push({
      title: "Sin Equilibrio",
      description: `La suscripción no supera el modelo único en ${timeHorizon} meses`,
      isPositive: false,
    });
  }

  // LTV insight
  if (results.ltv > 0) {
    insights.push({
      title: "Valor de Vida",
      description: `Cada cliente de suscripción vale ${formatCurrency(
        results.ltv
      )} a largo plazo`,
      isPositive: true,
    });
  }

  // Payback period
  if (results.paybackPeriod < 12) {
    insights.push({
      title: "Recuperación Rápida",
      description: `Recuperas la inversión en ${formatTimePeriod(
        results.paybackPeriod
      )}`,
      isPositive: true,
    });
  } else if (results.paybackPeriod < 24) {
    insights.push({
      title: "Recuperación Moderada",
      description: `Recuperas la inversión en ${formatTimePeriod(
        results.paybackPeriod
      )}`,
      isPositive: false,
    });
  }

  return insights;
}
