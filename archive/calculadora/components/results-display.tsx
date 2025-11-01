"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CalculationResults } from "@/lib/types/calculator";
import {
  formatCurrency,
  formatPercentage,
  formatTimePeriod,
  getValueColor,
  getTrendIndicator,
} from "@/app/calculadora/lib/utils";

const VIRTUALIZATION_THRESHOLD = 60;
const VIRTUALIZED_ROW_HEIGHT = 88;
const VIRTUALIZED_ROW_GAP = 12;
const VIRTUALIZED_ITEM_HEIGHT = VIRTUALIZED_ROW_HEIGHT + VIRTUALIZED_ROW_GAP;
const VIRTUAL_OVERSCAN = 4;

interface MonthlyItem {
  month: number;
  revenue: number;
  profit: number;
}

interface ResultsDisplayProps {
  results: CalculationResults;
  timeHorizon: number;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  progress?: number;
  description?: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  progress,
  description,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-[#64E365]/30 bg-[#64E365]/10";
      case "warning":
        return "border-[#FFD100]/30 bg-[#FFD100]/10";
      case "destructive":
        return "border-red-400/30 bg-red-400/10";
      default:
        return "border-white/20 bg-white/5";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-[#64E365]" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className={getVariantStyles()}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              {icon && <div className="text-white/60">{icon}</div>}
              <p className="text-sm font-medium text-white/80">{title}</p>
              {getTrendIcon()}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
            {description && (
              <p className="text-xs text-white/60 mt-2">{description}</p>
            )}
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-3 space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-white/60 text-right">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ComparisonCard({
  title,
  oneTimeValue,
  subscriptionValue,
  oneTimeLabel = "Producto Único",
  subscriptionLabel = "Suscripción",
  format = "currency",
}: {
  title: string;
  oneTimeValue: number;
  subscriptionValue: number;
  oneTimeLabel?: string;
  subscriptionLabel?: string;
  format?: "currency" | "percentage" | "number";
}) {
  const formatValue = (value: number) => {
    switch (format) {
      case "percentage":
        return formatPercentage(value);
      case "number":
        return value.toLocaleString();
      default:
        return formatCurrency(value);
    }
  };

  const difference = subscriptionValue - oneTimeValue;
  const percentageDiff =
    oneTimeValue === 0 ? 0 : (difference / oneTimeValue) * 100;
  const isSubscriptionBetter = difference > 0;

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-mono text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-white/10 border border-white/20">
            <p className="text-sm font-medium text-white/80">{oneTimeLabel}</p>
            <p className="text-xl font-bold text-white">
              {formatValue(oneTimeValue)}
            </p>
          </div>

          <div className="text-center p-3 rounded-lg bg-[#64E365]/20 border border-[#64E365]/30">
            <p className="text-sm font-medium text-[#64E365]">
              {subscriptionLabel}
            </p>
            <p className="text-xl font-bold text-white">
              {formatValue(subscriptionValue)}
            </p>
          </div>
        </div>

        <div className="text-center">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isSubscriptionBetter
                ? "bg-[#64E365]/20 text-[#64E365] border border-[#64E365]/30"
                : "bg-red-400/20 text-red-400 border border-red-400/30"
            }`}
          >
            <span>{getTrendIndicator(difference)}</span>
            <span>
              {isSubscriptionBetter ? "+" : ""}
              {formatValue(Math.abs(difference))}
            </span>
            <span className="text-xs">
              ({percentageDiff > 0 ? "+" : ""}
              {formatPercentage(percentageDiff, 1)})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyListItem({
  item,
  height,
}: {
  item: MonthlyItem;
  height?: number;
}) {
  const profitColor = getValueColor(item.profit)
    .replace("text-green-600", "text-[#64E365]")
    .replace("text-red-600", "text-red-400");

  return (
    <div
      role="listitem"
      className="flex h-full flex-col gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
      style={height ? { height } : undefined}
    >
      <div className="flex items-center space-x-3">
        <span className="min-w-[60px] rounded-md border border-white/15 bg-white/10 px-2 py-1 text-center font-mono text-[11px] text-white/70">
          Mes {item.month}
        </span>
        <div>
          <p className="font-medium text-white/90">
            {formatCurrency(item.revenue)}
          </p>
          <p className="text-xs text-white/60">Ingresos</p>
        </div>
      </div>

      <div className="text-left sm:text-right">
        <p className={`font-medium ${profitColor}`}>
          {formatCurrency(item.profit)}
        </p>
        <p className="text-xs text-white/60">Beneficio</p>
      </div>
    </div>
  );
}

function VirtualizedMonthlyList({ items }: { items: MonthlyItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
    setScrollTop(0);
  }, [items]);

  const effectiveHeight = containerHeight || VIRTUALIZED_ITEM_HEIGHT * 4;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / VIRTUALIZED_ITEM_HEIGHT) - VIRTUAL_OVERSCAN
  );
  const visibleCount =
    Math.ceil(effectiveHeight / VIRTUALIZED_ITEM_HEIGHT) + VIRTUAL_OVERSCAN * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * VIRTUALIZED_ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      className="h-80 overflow-y-auto pr-2"
      role="list"
      aria-label="Evolución mensual completa"
    >
      <div
        className="relative"
        style={{ height: items.length * VIRTUALIZED_ITEM_HEIGHT }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.month}
            className="absolute left-0 right-0"
            style={{
              transform: `translateY(${
                offsetY + index * VIRTUALIZED_ITEM_HEIGHT
              }px)`,
              height: VIRTUALIZED_ITEM_HEIGHT,
              paddingBottom: VIRTUALIZED_ROW_GAP,
            }}
          >
            <MonthlyListItem item={item} height={VIRTUALIZED_ROW_HEIGHT} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyList({
  items,
  virtualize,
}: {
  items: MonthlyItem[];
  virtualize: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-white/60">
        No hay datos mensuales disponibles para este horizonte.
      </p>
    );
  }

  if (virtualize) {
    return <VirtualizedMonthlyList items={items} />;
  }

  return (
    <div className="space-y-3" role="list">
      {items.map((item) => (
        <MonthlyListItem key={item.month} item={item} />
      ))}
    </div>
  );
}

export function ResultsDisplay({
  results,
  timeHorizon,
  className,
}: ResultsDisplayProps) {
  const finalSubscriptionRevenue =
    results.cumulativeRevenue[results.cumulativeRevenue.length - 1] || 0;
  const finalSubscriptionProfit =
    results.cumulativeProfit[results.cumulativeProfit.length - 1] || 0;

  const isSubscriptionBetter = results.profitDifference > 0;
  const breakEvenReached =
    results.breakEvenPoint > 0 && results.breakEvenPoint <= timeHorizon;

  // Calculate progress towards break-even
  const breakEvenProgress = breakEvenReached
    ? 100
    : results.breakEvenPoint === -1
    ? 0
    : Math.min((timeHorizon / results.breakEvenPoint) * 100, 100);

  const monthlyItems = useMemo<MonthlyItem[]>(
    () =>
      results.monthlyRevenue.map((revenue, index) => ({
        month: index + 1,
        revenue,
        profit: results.monthlyProfit[index] || 0,
      })),
    [results.monthlyProfit, results.monthlyRevenue]
  );

  const shouldVirtualize = monthlyItems.length > VIRTUALIZATION_THRESHOLD;
  const recentItems = shouldVirtualize
    ? monthlyItems
    : monthlyItems.slice(-Math.min(6, monthlyItems.length));
  const monthlyTitleSuffix = shouldVirtualize
    ? `${monthlyItems.length} meses`
    : `Últimos ${recentItems.length} meses`;
  const monthlyDescription = shouldVirtualize
    ? "Desplázate para revisar ingresos y beneficios de todo el horizonte."
    : "Ingresos y beneficios mensuales del modelo de suscripción.";

  return (
    <div
      className={`space-y-6 ${className}`}
      role="region"
      aria-live="polite"
      aria-label="Resultados de la comparación entre modelos"
    >
      {/* Resumen General */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-mono text-white">
          Resultados de la Comparación
        </h2>
        <p className="text-white/70">
          Análisis para {timeHorizon} meses de operación
        </p>
      </div>

      {/* Indicador Principal */}
      <Card
        className={`border-2 ${
          isSubscriptionBetter
            ? "border-[#64E365]/50 bg-[#64E365]/10"
            : "border-red-400/50 bg-red-400/10"
        }`}
      >
        <CardContent className="text-center py-6">
          <div className="space-y-2">
            {isSubscriptionBetter ? (
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#64E365]" />
            ) : (
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            )}
            <h3
              className={`text-xl font-bold font-mono ${
                isSubscriptionBetter ? "text-[#64E365]" : "text-red-400"
              }`}
            >
              {isSubscriptionBetter
                ? "El modelo de suscripción es más rentable"
                : "El modelo único es más rentable (en este período)"}
            </h3>
            <p
              className={`text-sm ${
                isSubscriptionBetter ? "text-[#64E365]/80" : "text-red-400/80"
              }`}
            >
              Diferencia: {formatCurrency(Math.abs(results.profitDifference))}
              {isSubscriptionBetter
                ? " a favor de suscripción"
                : " a favor del modelo único"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Lifetime Value (LTV)"
          value={formatCurrency(results.ltv)}
          icon={<Target className="h-4 w-4" />}
          variant={results.ltv > 0 ? "success" : "warning"}
          description="Valor total de cada cliente de suscripción"
        />

        <MetricCard
          title="Período de Recuperación"
          value={formatTimePeriod(results.paybackPeriod)}
          icon={<Calendar className="h-4 w-4" />}
          variant={
            results.paybackPeriod < 12
              ? "success"
              : results.paybackPeriod < 24
              ? "warning"
              : "destructive"
          }
          description="Tiempo para recuperar la inversión"
        />

        <MetricCard
          title="Punto de Equilibrio"
          value={
            breakEvenReached ? `Mes ${results.breakEvenPoint}` : "No alcanzado"
          }
          icon={<Zap className="h-4 w-4" />}
          variant={breakEvenReached ? "success" : "warning"}
          progress={breakEvenProgress}
          description="Cuándo la suscripción supera al modelo único"
        />

        <MetricCard
          title="Margen Producto Único"
          value={formatPercentage(results.oneTimeMargin)}
          icon={<TrendingUp className="h-4 w-4" />}
          variant={
            results.oneTimeMargin > 50
              ? "success"
              : results.oneTimeMargin > 20
              ? "warning"
              : "destructive"
          }
          description="Rentabilidad del modelo único"
        />
      </div>

      {/* Comparaciones Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparisonCard
          title="Comparación de Ingresos"
          oneTimeValue={results.oneTimeRevenue}
          subscriptionValue={finalSubscriptionRevenue}
        />

        <ComparisonCard
          title="Comparación de Beneficios"
          oneTimeValue={results.oneTimeProfit}
          subscriptionValue={finalSubscriptionProfit}
        />
      </div>

      {/* Desglose Mensual (Últimos 6 meses) */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white">
            <Calendar className="h-5 w-5 text-[#64E365]" />
            <span>Evolución Mensual ({monthlyTitleSuffix})</span>
          </CardTitle>
          <CardDescription className="text-white/70">
            {monthlyDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyList items={recentItems} virtualize={shouldVirtualize} />
        </CardContent>
      </Card>

      {/* Resumen Final */}
      <Card className="bg-white/5 border-white/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-mono font-semibold text-white">
              Resumen Ejecutivo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="space-y-1 text-white/70">
                <p className="font-medium text-white/90">Modelo Único</p>
                <p>{formatCurrency(results.oneTimeRevenue)} ingresos</p>
                <p>{formatCurrency(results.oneTimeProfit)} beneficio</p>
                <p>{formatPercentage(results.oneTimeMargin)} margen</p>
              </div>

              <div className="space-y-1 text-white/70">
                <p className="font-medium text-[#64E365]">
                  Suscripción ({timeHorizon}m)
                </p>
                <p>{formatCurrency(finalSubscriptionRevenue)} ingresos</p>
                <p>{formatCurrency(finalSubscriptionProfit)} beneficio</p>
                <p>{formatCurrency(results.ltv)} LTV</p>
              </div>

              <div className="space-y-1 text-white/70">
                <p className="font-medium text-white/90">Diferencia</p>
                <p
                  className={getValueColor(results.revenueDifference)
                    .replace("text-green-600", "text-[#64E365]")
                    .replace("text-red-600", "text-red-400")}
                >
                  {getTrendIndicator(results.revenueDifference)}{" "}
                  {formatCurrency(Math.abs(results.revenueDifference))}
                </p>
                <p
                  className={getValueColor(results.profitDifference)
                    .replace("text-green-600", "text-[#64E365]")
                    .replace("text-red-600", "text-red-400")}
                >
                  {getTrendIndicator(results.profitDifference)}{" "}
                  {formatCurrency(Math.abs(results.profitDifference))}
                </p>
                <p className="text-white/50">
                  {breakEvenReached
                    ? `Equilibrio: ${results.breakEvenPoint}m`
                    : "Sin equilibrio"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
