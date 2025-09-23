"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
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
  formatCompactNumber,
  getValueColor,
  getTrendIndicator,
} from "@/app/calculadora/lib/utils";

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
  icon?: React.ReactNode;
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
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "destructive":
        return "border-red-200 bg-red-50";
      default:
        return "";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
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
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {getTrendIcon()}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-3 space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-700">{oneTimeLabel}</p>
            <p className="text-xl font-bold text-blue-900">
              {formatValue(oneTimeValue)}
            </p>
          </div>

          <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-700">
              {subscriptionLabel}
            </p>
            <p className="text-xl font-bold text-green-900">
              {formatValue(subscriptionValue)}
            </p>
          </div>
        </div>

        <div className="text-center">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isSubscriptionBetter
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen General */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Resultados de la Comparación</h2>
        <p className="text-muted-foreground">
          Análisis para {timeHorizon} meses de operación
        </p>
      </div>

      {/* Indicador Principal */}
      <Card
        className={`border-2 ${
          isSubscriptionBetter
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <CardContent className="text-center py-6">
          <div className="space-y-2">
            {isSubscriptionBetter ? (
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            ) : (
              <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
            )}
            <h3
              className={`text-xl font-bold ${
                isSubscriptionBetter ? "text-green-800" : "text-red-800"
              }`}
            >
              {isSubscriptionBetter
                ? "El modelo de suscripción es más rentable"
                : "El modelo único es más rentable (en este período)"}
            </h3>
            <p
              className={`text-sm ${
                isSubscriptionBetter ? "text-green-700" : "text-red-700"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Evolución Mensual (Últimos 6 meses)</span>
          </CardTitle>
          <CardDescription>
            Ingresos y beneficios mensuales del modelo de suscripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.monthlyRevenue.slice(-6).map((revenue, index) => {
              const actualIndex = results.monthlyRevenue.length - 6 + index;
              const profit = results.monthlyProfit[actualIndex] || 0;
              const month = actualIndex + 1;

              return (
                <div
                  key={month}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="min-w-[60px]">
                      Mes {month}
                    </Badge>
                    <div>
                      <p className="font-medium">{formatCurrency(revenue)}</p>
                      <p className="text-sm text-muted-foreground">Ingresos</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-medium ${getValueColor(profit)}`}>
                      {formatCurrency(profit)}
                    </p>
                    <p className="text-sm text-muted-foreground">Beneficio</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Final */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Resumen Ejecutivo</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-blue-700">Modelo Único</p>
                <p>{formatCurrency(results.oneTimeRevenue)} ingresos</p>
                <p>{formatCurrency(results.oneTimeProfit)} beneficio</p>
                <p>{formatPercentage(results.oneTimeMargin)} margen</p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-green-700">
                  Suscripción ({timeHorizon}m)
                </p>
                <p>{formatCurrency(finalSubscriptionRevenue)} ingresos</p>
                <p>{formatCurrency(finalSubscriptionProfit)} beneficio</p>
                <p>{formatCurrency(results.ltv)} LTV</p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-purple-700">Diferencia</p>
                <p className={getValueColor(results.revenueDifference)}>
                  {getTrendIndicator(results.revenueDifference)}{" "}
                  {formatCurrency(Math.abs(results.revenueDifference))}
                </p>
                <p className={getValueColor(results.profitDifference)}>
                  {getTrendIndicator(results.profitDifference)}{" "}
                  {formatCurrency(Math.abs(results.profitDifference))}
                </p>
                <p className="text-muted-foreground">
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
