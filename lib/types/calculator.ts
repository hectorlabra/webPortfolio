/**
 * TypeScript interfaces for Calculator de Ingresos
 * Data models for one-time vs recurring revenue comparison
 */

export interface CalculatorInputs {
  // Producto único
  oneTimePrice: number; // Precio del producto único ($)
  oneTimeCost: number; // Costo de adquisición por cliente ($)
  oneTimeCustomers: number; // Número de clientes objetivo

  // Modelo de suscripción
  subscriptionPrice: number; // Precio mensual de suscripción ($)
  subscriptionCost: number; // Costo mensual por cliente ($)
  churnRate: number; // Tasa de abandono mensual (%)
  timeHorizon: number; // Horizonte temporal (meses)

  // Métricas adicionales
  conversionRate: number; // Tasa de conversión (%)
  discountRate: number; // Tasa de descuento para LTV (%)
}

export interface CalculationResults {
  // Resultados producto único
  oneTimeRevenue: number; // Ingresos totales únicos
  oneTimeProfit: number; // Beneficio total único
  oneTimeMargin: number; // Margen único (%)

  // Resultados suscripción
  monthlyRevenue: number[]; // Ingresos mensuales
  cumulativeRevenue: number[]; // Ingresos acumulados
  monthlyProfit: number[]; // Beneficio mensual
  cumulativeProfit: number[]; // Beneficio acumulado
  ltv: number; // Lifetime Value
  paybackPeriod: number; // Periodo de recuperación (meses)

  // Comparación
  revenueDifference: number; // Diferencia en ingresos
  profitDifference: number; // Diferencia en beneficios
  breakEvenPoint: number; // Punto de equilibrio (meses)
}

export interface CalculatorState {
  inputs: CalculatorInputs;
  results: CalculationResults | null;
  isCalculating: boolean;
  hasResults: boolean;
  lastCalculated: Date | null;
}

// Configuración y constantes
export interface CalculatorConfig {
  readonly MIN_TIME_HORIZON: number;
  readonly MAX_TIME_HORIZON: number;
  readonly MIN_CHURN_RATE: number;
  readonly MAX_CHURN_RATE: number;
  readonly DEFAULT_DISCOUNT_RATE: number;
  readonly CURRENCY_DECIMALS: number;
  readonly PERCENTAGE_DECIMALS: number;
}

// Tipos de validación
export interface ValidationError {
  field: keyof CalculatorInputs;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Tipos para los gráficos
export interface ChartDataPoint {
  month: number;
  monthLabel: string;
  oneTimeRevenue: number;
  oneTimeProfit: number;
  subscriptionRevenue: number;
  subscriptionProfit: number;
  cumulativeOneTime: number;
  cumulativeSubscription: number;
}

export interface InsightData {
  type: "revenue" | "profit" | "breakeven" | "recommendation";
  title: string;
  description: string;
  value?: number;
  isPositive?: boolean;
}

// Valores por defecto
export const DEFAULT_INPUTS: CalculatorInputs = {
  oneTimePrice: 97,
  oneTimeCost: 20,
  oneTimeCustomers: 1000,
  subscriptionPrice: 29,
  subscriptionCost: 5,
  churnRate: 5,
  timeHorizon: 24,
  conversionRate: 2.5,
  discountRate: 10,
};

export const CALCULATOR_CONFIG: CalculatorConfig = {
  MIN_TIME_HORIZON: 1,
  MAX_TIME_HORIZON: 60,
  MIN_CHURN_RATE: 0,
  MAX_CHURN_RATE: 50,
  DEFAULT_DISCOUNT_RATE: 10,
  CURRENCY_DECIMALS: 2,
  PERCENTAGE_DECIMALS: 1,
};
