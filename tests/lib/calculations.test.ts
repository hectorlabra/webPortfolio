import { describe, it, expect } from "vitest";
import {
  calculateLTV,
  calculatePaybackPeriod,
  calculateMonthlyRevenue,
  calculateMonthlyProfit,
  calculateCumulativeRevenue,
  findBreakEvenPoint,
  calculateMargin,
  calculateResults,
  validateCalculatorInputs,
} from "@/app/calculadora/lib/calculations";

const baseInputs = {
  oneTimePrice: 200,
  oneTimeCost: 40,
  oneTimeCustomers: 1000,
  conversionRate: 2.5,
  subscriptionPrice: 30,
  subscriptionCost: 5,
  churnRate: 5,
  timeHorizon: 24,
  discountRate: 10,
};

describe("Financial calculations", () => {
  it("calculates LTV correctly with non-zero denominator", () => {
    const ltv = calculateLTV(30, 5, 5, 10); // (25)/(0.05+0.10) = 25/0.15 = 166.66
    expect(ltv).toBeCloseTo(166.66, 1);
  });

  it("returns 0 LTV when denominator is zero", () => {
    const ltv = calculateLTV(30, 5, 0, 0);
    expect(ltv).toBe(0);
  });

  it("calculates payback period properly", () => {
    const period = calculatePaybackPeriod(100, 20);
    expect(period).toBe(5);
  });

  it("returns Infinity payback when monthly profit <= 0", () => {
    const period = calculatePaybackPeriod(100, 0);
    expect(period).toBe(Infinity);
  });

  it("computes monthly revenue with churn decay", () => {
    const rev = calculateMonthlyRevenue(100, 10, 10, 3);
    // month 1: 100*10=1000, month2: 90*10=900, month3: 81*10=810
    expect(rev).toEqual([1000, 900, 810]);
  });

  it("computes monthly profit considering costs and churn", () => {
    const rev = [1000, 900, 810];
    const profits = calculateMonthlyProfit(rev, 2, 100, 10); // cost month1 = 100*2=200 => 800, month2: 90*2=180 =>720, month3:81*2=162 =>648
    expect(profits).toEqual([800, 720, 648]);
  });

  it("calculates cumulative revenue", () => {
    const cum = calculateCumulativeRevenue([100, 200, 300]);
    expect(cum).toEqual([100, 300, 600]);
  });

  it("finds break-even correctly", () => {
    const be = findBreakEvenPoint(100, [50, 99, 101]);
    expect(be).toBe(3);
  });

  it("returns -1 when never breaks even", () => {
    const be = findBreakEvenPoint(500, [50, 200, 400]);
    expect(be).toBe(-1);
  });

  it("calculates margin", () => {
    expect(calculateMargin(200, 50)).toBeCloseTo(75);
  });

  it("returns 0 margin when revenue is 0", () => {
    expect(calculateMargin(0, 50)).toBe(0);
  });
});

describe("Results aggregation", () => {
  it("calculates full results shape", () => {
    const results = calculateResults(baseInputs as any);
    expect(results).toHaveProperty("oneTimeRevenue");
    expect(results).toHaveProperty("monthlyRevenue");
    expect(results.monthlyRevenue.length).toBe(baseInputs.timeHorizon);
  });
});

describe("Validation", () => {
  it("detects invalid inputs", () => {
    const errors = validateCalculatorInputs({
      ...baseInputs,
      oneTimePrice: 0,
      subscriptionPrice: 0,
      churnRate: 60,
      timeHorizon: 0,
      conversionRate: 0,
      discountRate: 60,
    } as any);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns empty array for valid inputs", () => {
    const errors = validateCalculatorInputs(baseInputs as any);
    expect(errors).toEqual([]);
  });
});
