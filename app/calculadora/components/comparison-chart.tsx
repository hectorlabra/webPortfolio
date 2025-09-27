"use client";

import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  downsampleChartData,
} from "@/app/calculadora/lib/utils";

const CHART_HEIGHT = 360;
const MAX_CHART_POINTS = 48;

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
  const [containerSize, setContainerSize] = useState<
    Record<string, { width: number; height: number }>
  >({});

  const chartData = useMemo(
    () => transformToChartData(results, timeHorizon),
    [results, timeHorizon]
  );

  const breakEvenPoint = results.breakEvenPoint;
  const breakEvenIndex =
    breakEvenPoint > 0 && breakEvenPoint <= chartData.length
      ? breakEvenPoint - 1
      : null;

  const displayData = useMemo(
    () =>
      downsampleChartData(chartData, {
        maxPoints: MAX_CHART_POINTS,
        preserveIndices: breakEvenIndex !== null ? [breakEvenIndex] : undefined,
      }),
    [chartData, breakEvenIndex]
  );

  const hasData = displayData.length > 0;

  const breakEvenData = useMemo(() => {
    if (breakEvenPoint <= 0 || breakEvenPoint > timeHorizon) return null;

    return displayData.find((point) => point.month === breakEvenPoint) ?? null;
  }, [breakEvenPoint, timeHorizon, displayData]);

  const registerContainer = useCallback((key: string) => {
    return (node: HTMLDivElement | null) => {
      containerRefs.current[key] = node;

      const updateSize = (target: HTMLDivElement | null) => {
        const width = target?.offsetWidth ?? 0;
        const height = target?.offsetHeight ?? 0;

        setContainerSize((prev) => {
          const previous = prev[key];
          if (
            previous &&
            previous.width === width &&
            previous.height === height
          )
            return prev;

          return {
            ...prev,
            [key]: { width, height },
          };
        });
      };

      if (containerObservers.current[key]) {
        containerObservers.current[key]?.disconnect();
        containerObservers.current[key] = null;
      }

      if (node) {
        updateSize(node);

        if (typeof ResizeObserver !== "undefined") {
          const observer = new ResizeObserver(() => updateSize(node));
          observer.observe(node);
          containerObservers.current[key] = observer;
        }
      } else {
        updateSize(null);
      }
    };
  }, []);

  const renderRevenueChart = useCallback<ChartRenderer>(
    () => (
      <BarChart
        data={displayData}
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
    [displayData, breakEvenData]
  );

  const renderProfitChart = useCallback<ChartRenderer>(
    () => (
      <BarChart
        data={displayData}
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
    [displayData, breakEvenData]
  );

  const renderCumulativeChart = useCallback<ChartRenderer>(
    () => (
      <AreaChart
        data={displayData}
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
    [displayData, breakEvenData]
  );

  const renderTrendChart = useCallback<ChartRenderer>(
    () => (
      <LineChart
        data={displayData}
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
    [displayData, breakEvenData]
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

  useEffect(() => {
    const observers = containerObservers.current;

    return () => {
      Object.values(observers).forEach((observer) => observer?.disconnect());
    };
  }, []);

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

            {chartOptions.map((option) => {
              const size = containerSize[option.key];
              const width = size?.width ?? 0;
              const height = size?.height ?? 0;
              const canRenderChart = hasData && width > 0 && height > 0;

              return (
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
                      {canRenderChart ? (
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
                        modelos. El punto donde se cruzan las líneas indica
                        cuándo la suscripción supera al modelo único.
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
                        Visualización de tendencias de crecimiento acumulado.
                        Útil para identificar patrones y proyecciones a largo
                        plazo.
                      </p>
                    )}
                  </div>
                </TabsContent>
              );
            })}
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
