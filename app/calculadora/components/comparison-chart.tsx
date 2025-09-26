"use client";

import { JSX, useCallback, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import type { TooltipProps } from "recharts";
import { TrendingUp, BarChart3, Activity, Zap } from "lucide-react";
import { CalculationResults } from "@/lib/types/calculator";
import {
  transformToChartData,
  formatCurrency,
  formatCompactNumber,
} from "@/app/calculadora/lib/utils";

const CHART_HEIGHT = 360;

type ChartRenderer = () => JSX.Element;

export interface ComparisonChartProps {
  results: CalculationResults;
  timeHorizon: number;
  className?: string;
}

type ChartTooltipPayloadItem = NonNullable<
  TooltipProps<number, string>["payload"]
>[number];

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
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

  const getNumberValue = (entry?: ChartTooltipPayloadItem) => {
    if (!entry) return 0;

    const { value } = entry;

    if (typeof value === "number") {
      return value;
    }

    if (Array.isArray(value)) {
      const numeric = Number(value[0]);
      return Number.isFinite(numeric) ? numeric : 0;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const getTooltipContent = () => {
    switch (chartType) {
      case "revenue-comparison":
        return (
          <div className="space-y-2">
            <p className="font-medium">{label}</p>
            <div className="space-y-1">
              <p className="text-white/80">
                Único:{" "}
                {formatCurrency(
                  getNumberValue(
                    payload.find((p) => p.dataKey === "oneTimeRevenue")
                  )
                )}
              </p>
              <p className="text-[#64E365]">
                Suscripción:{" "}
                {formatCurrency(
                  getNumberValue(
                    payload.find((p) => p.dataKey === "subscriptionRevenue")
                  )
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
              <p className="text-white/80">
                Único:{" "}
                {formatCurrency(
                  getNumberValue(
                    payload.find((p) => p.dataKey === "oneTimeProfit")
                  )
                )}
              </p>
              <p className="text-[#64E365]">
                Suscripción:{" "}
                {formatCurrency(
                  getNumberValue(
                    payload.find((p) => p.dataKey === "subscriptionProfit")
                  )
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
                  getNumberValue(
                    payload.find((p) => p.dataKey === "cumulativeOneTime")
                  )
                )}
              </p>
              <p className="text-green-600">
                Suscripción (Acum.):{" "}
                {formatCurrency(
                  getNumberValue(
                    payload.find((p) => p.dataKey === "cumulativeSubscription")
                  )
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
              <p key={index} style={{ color: entry.color ?? "#ffffff" }}>
                {entry.name}: {formatCurrency(getNumberValue(entry))}
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
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerObservers = useRef<Record<string, ResizeObserver | null>>({});
  const [containerWidth, setContainerWidth] = useState<Record<string, number>>(
    {}
  );

  const chartData = useMemo(
    () => transformToChartData(results, timeHorizon),
    [results, timeHorizon]
  );

  const hasData = chartData.length > 0;

  // Find break-even point for reference line
  const breakEvenPoint = results.breakEvenPoint;
  const breakEvenData = useMemo(() => {
    if (breakEvenPoint <= 0 || breakEvenPoint > timeHorizon) return null;
    return chartData[breakEvenPoint - 1];
  }, [breakEvenPoint, timeHorizon, chartData]);

  const registerContainer = useCallback((key: string) => {
    return (node: HTMLDivElement | null) => {
      containerRefs.current[key] = node;

      const updateSize = () => {
        const width = node?.offsetWidth ?? 0;
        setContainerWidth((prev) =>
          prev[key] === width ? prev : { ...prev, [key]: width }
        );
      };

      if (containerObservers.current[key]) {
        containerObservers.current[key]?.disconnect();
        containerObservers.current[key] = null;
      }

      if (node) {
        updateSize();

        if (typeof ResizeObserver !== "undefined") {
          const observer = new ResizeObserver(() => updateSize());
          observer.observe(node);
          containerObservers.current[key] = observer;
        }
      }
    };
  }, []);

  const renderRevenueChart = useCallback<ChartRenderer>(
    () => (
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
          isAnimationActive={false}
          animationDuration={0}
        />
        <Bar
          dataKey="subscriptionRevenue"
          fill="#10B981"
          name="Suscripción Mensual"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
          animationDuration={0}
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
    ),
    [chartData, breakEvenData]
  );

  const renderProfitChart = useCallback<ChartRenderer>(
    () => (
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
          fill="rgba(255, 255, 255, 0.7)"
          name="Beneficio Único"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
          animationDuration={0}
        />
        <Bar
          dataKey="subscriptionProfit"
          fill="#64E365"
          name="Beneficio Mensual"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
          animationDuration={0}
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
    ),
    [chartData, breakEvenData]
  );

  const renderCumulativeChart = useCallback<ChartRenderer>(
    () => (
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
          stroke="rgba(255, 255, 255, 0.8)"
          fill="rgba(255, 255, 255, 0.6)"
          fillOpacity={0.6}
          name="Acumulado Único"
          isAnimationActive={false}
          animationDuration={0}
        />
        <Area
          type="monotone"
          dataKey="cumulativeSubscription"
          stackId="2"
          stroke="#64E365"
          fill="#64E365"
          fillOpacity={0.6}
          name="Acumulado Suscripción"
          isAnimationActive={false}
          animationDuration={0}
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
    ),
    [chartData, breakEvenData]
  );

  const renderTrendChart = useCallback<ChartRenderer>(
    () => (
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
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth={3}
          dot={{ r: 4, fill: "rgba(255, 255, 255, 0.8)" }}
          name="Único (Acumulado)"
          isAnimationActive={false}
          animationDuration={0}
        />
        <Line
          type="monotone"
          dataKey="cumulativeSubscription"
          stroke="#64E365"
          strokeWidth={3}
          dot={{ r: 4, fill: "#64E365" }}
          name="Suscripción (Acumulado)"
          isAnimationActive={false}
          animationDuration={0}
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
    ),
    [chartData, breakEvenData]
  );

  const chartOptions = useMemo(
    () => [
      {
        key: "cumulative",
        label: "Acumulado",
        icon: <Activity className="h-4 w-4" />,
        render: renderCumulativeChart,
      },
      {
        key: "revenue",
        label: "Ingresos",
        icon: <BarChart3 className="h-4 w-4" />,
        render: renderRevenueChart,
      },
      {
        key: "profit",
        label: "Beneficios",
        icon: <TrendingUp className="h-4 w-4" />,
        render: renderProfitChart,
      },
      {
        key: "trend",
        label: "Tendencias",
        icon: <Zap className="h-4 w-4" />,
        render: renderTrendChart,
      },
    ],
    [
      renderCumulativeChart,
      renderRevenueChart,
      renderProfitChart,
      renderTrendChart,
    ]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            <div className="space-y-1 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 font-mono text-white">
                <BarChart3 className="h-5 w-5 text-[#64E365]" />
                <span>Comparación Visual</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Análisis gráfico de ingresos y beneficios para {timeHorizon}{" "}
                meses
              </CardDescription>
            </div>

            {breakEvenPoint > 0 && breakEvenPoint <= timeHorizon && (
              <Badge
                variant="outline"
                className="self-center sm:self-auto bg-[#FFD100]/20 text-[#FFD100] border-[#FFD100]/30"
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
            <TabsList
              className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2"
              aria-label="Cambiar visualización del análisis"
            >
              {chartOptions.map((option) => (
                <TabsTrigger
                  key={option.key}
                  value={option.key}
                  className="flex flex-col items-center gap-1 text-[11px] sm:flex-row sm:justify-center sm:gap-2 sm:text-sm"
                >
                  <span className="flex items-center justify-center">
                    {option.icon}
                  </span>
                  <span className="leading-tight sm:leading-normal text-center sm:text-left">
                    {option.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {chartOptions.map((option) => (
              <TabsContent
                key={option.key}
                value={option.key}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div
                    ref={registerContainer(option.key)}
                    className="w-full"
                    style={{ minHeight: CHART_HEIGHT }}
                  >
                    {hasData && (containerWidth[option.key] ?? 0) > 0 ? (
                      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                        {option.render()}
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[360px] items-center justify-center text-sm text-white/60">
                        Preparando visualización...
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart Description */}
                <div className="text-sm text-white/70 space-y-2">
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
      <Card className="bg-white/5 border-white/20">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2 text-white">
                <div className="w-3 h-3 bg-white/70 rounded"></div>
                <span>Modelo Único</span>
              </h4>
              <ul className="space-y-1 text-white/70 pl-5">
                <li>• Ingresos inmediatos</li>
                <li>• Sin ingresos recurrentes</li>
                <li>• Beneficio constante</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2 text-white">
                <div className="w-3 h-3 bg-[#64E365] rounded"></div>
                <span>Suscripción</span>
              </h4>
              <ul className="space-y-1 text-white/70 pl-5">
                <li>• Ingresos mensuales</li>
                <li>• Afectado por churn</li>
                <li>• Crecimiento acumulativo</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2 text-white">
                <div className="w-3 h-3 bg-red-400 rounded border-dashed border-2 border-red-400"></div>
                <span>Punto de Equilibrio</span>
              </h4>
              <ul className="space-y-1 text-white/70 pl-5">
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
