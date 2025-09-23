"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp, BarChart3, Activity, Zap } from "lucide-react";
import { CalculationResults } from "@/lib/types/calculator";
import {
  transformToChartData,
  formatCurrency,
  formatCompactNumber,
} from "@/app/calculadora/lib/utils";

interface ComparisonChartProps {
  results: CalculationResults;
  timeHorizon: number;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartType: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  chartType,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const getTooltipContent = () => {
    switch (chartType) {
      case "revenue-comparison":
        return (
          <div className="space-y-2">
            <p className="font-medium">{label}</p>
            <div className="space-y-1">
              <p className="text-blue-600">
                Único:{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "oneTimeRevenue")?.value ||
                    0
                )}
              </p>
              <p className="text-green-600">
                Suscripción:{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "subscriptionRevenue")
                    ?.value || 0
                )}
              </p>
            </div>
          </div>
        );

      case "profit-comparison":
        return (
          <div className="space-y-2">
            <p className="font-medium">{label}</p>
            <div className="space-y-1">
              <p className="text-blue-600">
                Único:{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "oneTimeProfit")?.value || 0
                )}
              </p>
              <p className="text-green-600">
                Suscripción:{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "subscriptionProfit")
                    ?.value || 0
                )}
              </p>
            </div>
          </div>
        );

      case "cumulative":
        return (
          <div className="space-y-2">
            <p className="font-medium">{label}</p>
            <div className="space-y-1">
              <p className="text-blue-600">
                Único (Acum.):{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "cumulativeOneTime")
                    ?.value || 0
                )}
              </p>
              <p className="text-green-600">
                Suscripción (Acum.):{" "}
                {formatCurrency(
                  payload.find((p) => p.dataKey === "cumulativeSubscription")
                    ?.value || 0
                )}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <p className="font-medium">{label}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border">
      {getTooltipContent()}
    </div>
  );
}

export function ComparisonChart({
  results,
  timeHorizon,
  className,
}: ComparisonChartProps) {
  const [selectedView, setSelectedView] = useState<string>("cumulative");

  const chartData = transformToChartData(results, timeHorizon);

  // Find break-even point for reference line
  const breakEvenPoint = results.breakEvenPoint;
  const breakEvenData =
    breakEvenPoint > 0 && breakEvenPoint <= timeHorizon
      ? chartData[breakEvenPoint - 1]
      : null;

  const RevenueComparisonChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip chartType="revenue-comparison" />} />
        <Legend />
        <Bar
          dataKey="oneTimeRevenue"
          fill="#3B82F6"
          name="Producto Único"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="subscriptionRevenue"
          fill="#10B981"
          name="Suscripción Mensual"
          radius={[2, 2, 0, 0]}
        />
        {breakEvenData && (
          <ReferenceLine
            x={breakEvenData.monthLabel}
            stroke="#EF4444"
            strokeDasharray="5 5"
            label={{ value: "Punto de Equilibrio", position: "top" }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const ProfitComparisonChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip chartType="profit-comparison" />} />
        <Legend />
        <Bar
          dataKey="oneTimeProfit"
          fill="#3B82F6"
          name="Beneficio Único"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="subscriptionProfit"
          fill="#10B981"
          name="Beneficio Mensual"
          radius={[2, 2, 0, 0]}
        />
        {breakEvenData && (
          <ReferenceLine
            x={breakEvenData.monthLabel}
            stroke="#EF4444"
            strokeDasharray="5 5"
            label={{ value: "Punto de Equilibrio", position: "top" }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const CumulativeChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip chartType="cumulative" />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="cumulativeOneTime"
          stackId="1"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.6}
          name="Acumulado Único"
        />
        <Area
          type="monotone"
          dataKey="cumulativeSubscription"
          stackId="2"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.6}
          name="Acumulado Suscripción"
        />
        {breakEvenData && (
          <ReferenceLine
            x={breakEvenData.monthLabel}
            stroke="#EF4444"
            strokeDasharray="5 5"
            label={{ value: "Equilibrio", position: "top" }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  const TrendChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip chartType="cumulative" />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="cumulativeOneTime"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Único (Acumulado)"
        />
        <Line
          type="monotone"
          dataKey="cumulativeSubscription"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Suscripción (Acumulado)"
        />
        {breakEvenData && (
          <ReferenceLine
            x={breakEvenData.monthLabel}
            stroke="#EF4444"
            strokeDasharray="5 5"
            label={{ value: "Equilibrio", position: "top" }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const chartOptions = [
    {
      key: "cumulative",
      label: "Acumulado",
      icon: <Activity className="h-4 w-4" />,
      component: CumulativeChart,
    },
    {
      key: "revenue",
      label: "Ingresos",
      icon: <BarChart3 className="h-4 w-4" />,
      component: RevenueComparisonChart,
    },
    {
      key: "profit",
      label: "Beneficios",
      icon: <TrendingUp className="h-4 w-4" />,
      component: ProfitComparisonChart,
    },
    {
      key: "trend",
      label: "Tendencias",
      icon: <Zap className="h-4 w-4" />,
      component: TrendChart,
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Comparación Visual</span>
              </CardTitle>
              <CardDescription>
                Análisis gráfico de ingresos y beneficios para {timeHorizon}{" "}
                meses
              </CardDescription>
            </div>

            {breakEvenPoint > 0 && breakEvenPoint <= timeHorizon && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-300"
              >
                Equilibrio: Mes {breakEvenPoint}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={selectedView}
            onValueChange={setSelectedView}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              {chartOptions.map((option) => (
                <TabsTrigger
                  key={option.key}
                  value={option.key}
                  className="flex items-center space-x-2"
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {chartOptions.map((option) => (
              <TabsContent
                key={option.key}
                value={option.key}
                className="space-y-4"
              >
                <div className="bg-muted/30 p-4 rounded-lg">
                  <option.component />
                </div>

                {/* Chart Description */}
                <div className="text-sm text-muted-foreground space-y-2">
                  {option.key === "cumulative" && (
                    <p>
                      Muestra la evolución acumulada de ingresos para ambos
                      modelos. El punto donde se cruzan las líneas indica cuándo
                      la suscripción supera al modelo único.
                    </p>
                  )}

                  {option.key === "revenue" && (
                    <p>
                      Comparación mensual de ingresos. El modelo único genera
                      ingresos constantes, mientras que la suscripción declina
                      debido al churn.
                    </p>
                  )}

                  {option.key === "profit" && (
                    <p>
                      Comparación mensual de beneficios después de costos.
                      Considera tanto costos de adquisición como operativos.
                    </p>
                  )}

                  {option.key === "trend" && (
                    <p>
                      Visualización de tendencias de crecimiento acumulado. Útil
                      para identificar patrones y proyecciones a largo plazo.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Chart Legend and Key Insights */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Modelo Único</span>
              </h4>
              <ul className="space-y-1 text-muted-foreground pl-5">
                <li>• Ingresos inmediatos</li>
                <li>• Sin ingresos recurrentes</li>
                <li>• Beneficio constante</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Suscripción</span>
              </h4>
              <ul className="space-y-1 text-muted-foreground pl-5">
                <li>• Ingresos mensuales</li>
                <li>• Afectado por churn</li>
                <li>• Crecimiento acumulativo</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded border-dashed border-2 border-red-500"></div>
                <span>Punto de Equilibrio</span>
              </h4>
              <ul className="space-y-1 text-muted-foreground pl-5">
                <li>• Cruce de rentabilidad</li>
                <li>• Momento decisivo</li>
                <li>• Validación del modelo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
