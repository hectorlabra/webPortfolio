"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import uPlot, { type AlignedData, type Options } from "uplot";
import "uplot/dist/uPlot.min.css";

const SHORT_SERIES_LENGTH = 24;
const LONG_SERIES_LENGTH = 120;

type Mode = "short" | "long";

type ModeMetrics = {
  generation: number;
  firstRender: number | null;
  lastRender: number | null;
  samples: number;
  lastUpdatedAt: number | null;
};

type MeasurementEntry = {
  id: string;
  mode: Mode;
  type: "initial" | "update";
  duration: number;
  samples: number;
  timestamp: number;
  points: number;
};

function generateSeries(length: number) {
  const start = Date.now();
  const x: number[] = [];
  const revenue: number[] = [];
  const profit: number[] = [];

  for (let i = 0; i < length; i += 1) {
    x.push(i);
    const base = 1000 + i * 120 + Math.sin(i / 2) * 200;
    const growthFactor = 1 + i / length;
    revenue.push(Math.round(base * growthFactor));
    profit.push(Math.round(revenue[revenue.length - 1] * 0.45));
  }

  const data: AlignedData = [x, revenue, profit];
  const generationTime = performance.now() - start;

  return { data, generationTime };
}

function createChartOptions(title: string): Options {
  return {
    title,
    width: 720,
    height: 360,
    axes: [
      {
        label: "Mes",
        stroke: "#9CA3AF",
        grid: { stroke: "rgba(255,255,255,0.08)" },
      },
      {
        label: "Ingresos",
        stroke: "#9CA3AF",
        grid: { stroke: "rgba(255,255,255,0.08)" },
      },
    ],
    series: [
      {},
      {
        label: "Ingresos",
        stroke: "#38BDF8",
        width: 2,
      },
      {
        label: "Utilidad",
        stroke: "#34D399",
        width: 2,
      },
    ],
    legend: {
      live: false,
    },
  };
}

export function UPlotDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<uPlot | null>(null);
  const [mode, setMode] = useState<Mode>("short");
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<Record<Mode, ModeMetrics>>({
    short: {
      generation: 0,
      firstRender: null,
      lastRender: null,
      samples: 0,
      lastUpdatedAt: null,
    },
    long: {
      generation: 0,
      firstRender: null,
      lastRender: null,
      samples: 0,
      lastUpdatedAt: null,
    },
  });
  const [history, setHistory] = useState<MeasurementEntry[]>([]);

  const { data, description, buildTime } = useMemo(() => {
    const length = mode === "short" ? SHORT_SERIES_LENGTH : LONG_SERIES_LENGTH;
    const { data: alignedData, generationTime: buildTime } =
      generateSeries(length);

    const summary = `Muestras: ${length} puntos`;

    return {
      data: alignedData,
      description: summary,
      buildTime,
    };
  }, [mode]);

  const recordMeasurement = (
    entryType: MeasurementEntry["type"],
    duration: number,
    points: number
  ) => {
    const timestamp = Date.now();
    let nextSamples = 0;
    let firstRenderDuration = duration;

    setRenderTime(duration);
    setMetrics((prev) => {
      const previous = prev[mode];
      nextSamples = previous.samples + 1;
      firstRenderDuration =
        previous.firstRender !== null ? previous.firstRender : duration;

      return {
        ...prev,
        [mode]: {
          ...previous,
          firstRender: firstRenderDuration,
          lastRender: duration,
          samples: nextSamples,
          lastUpdatedAt: timestamp,
        },
      };
    });

    setHistory((prevHistory) =>
      [
        {
          id: `${timestamp}-${mode}-${nextSamples}`,
          mode,
          type: entryType,
          duration,
          samples: nextSamples,
          timestamp,
          points,
        },
        ...prevHistory,
      ].slice(0, 8)
    );

    const label = entryType === "initial" ? "Initial render" : "Data update";
    console.info(
      `[uPlot][${mode}] ${label} (${points} pts, muestra #${nextSamples}): ${duration.toFixed(
        2
      )} ms`
    );
  };

  useEffect(() => {
    setMetrics((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        generation: buildTime,
      },
    }));
  }, [buildTime, mode]);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) {
      return;
    }

    const datasetLength = data[0]?.length ?? 0;
    const options = createChartOptions("Comparativa Ingresos vs Utilidad");

    if (!chartRef.current) {
      const start = performance.now();
      chartRef.current = new uPlot(options, data, target);
      const duration = performance.now() - start;
      recordMeasurement("initial", duration, datasetLength);
    } else {
      const start = performance.now();
      chartRef.current.setData(data);
      const duration = performance.now() - start;
      recordMeasurement("update", duration, datasetLength);
    }

    const handleResize = () => {
      if (!chartRef.current) return;
      chartRef.current.setSize({
        width: target.clientWidth,
        height: target.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, mode]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const handleModeChange = (nextMode: Mode) => {
    setRenderTime(null);
    setMode(nextMode);
  };

  const shortMetrics = metrics.short;
  const longMetrics = metrics.long;

  const formatMs = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value)
      ? `${value.toFixed(2)} ms`
      : "Pendiente";

  return (
    <section className="space-y-6 rounded-xl border border-white/10 bg-white/5 p-6 text-white">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">uPlot Demo</h2>
        <p className="text-sm text-white/70">
          Comparativa rápida entre datasets pequeños (24 puntos) y extendidos
          (120 puntos). Usa los controles para alternar y observar los tiempos
          registrados.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleModeChange("short")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            mode === "short"
              ? "bg-[#34D399] text-black"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          Dataset corto (24)
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("long")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            mode === "long"
              ? "bg-[#34D399] text-black"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          Dataset largo (120)
        </button>
      </div>

      <div className="grid gap-4 rounded-lg border border-white/15 bg-black/20 p-4 text-sm text-white/70 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            Dataset corto (24 puntos)
          </h3>
          <ul className="space-y-1">
            <li>Generación: {formatMs(shortMetrics.generation)}</li>
            <li>Primera renderización: {formatMs(shortMetrics.firstRender)}</li>
            <li>Última medición: {formatMs(shortMetrics.lastRender)}</li>
            <li>Muestras registradas: {shortMetrics.samples}</li>
            {shortMetrics.lastUpdatedAt && (
              <li>
                Medido por última vez:{" "}
                {new Date(shortMetrics.lastUpdatedAt).toLocaleTimeString()}
              </li>
            )}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            Dataset largo (120 puntos)
          </h3>
          <ul className="space-y-1">
            <li>Generación: {formatMs(longMetrics.generation)}</li>
            <li>Primera renderización: {formatMs(longMetrics.firstRender)}</li>
            <li>Última medición: {formatMs(longMetrics.lastRender)}</li>
            <li>Muestras registradas: {longMetrics.samples}</li>
            {longMetrics.lastUpdatedAt && (
              <li>
                Medido por última vez:{" "}
                {new Date(longMetrics.lastUpdatedAt).toLocaleTimeString()}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-white/70">
        <p>{description}</p>
        {typeof renderTime === "number" ? (
          <p>Último render medido: {renderTime.toFixed(2)} ms</p>
        ) : (
          <p>Último render medido: midiendo…</p>
        )}
      </div>

      {history.length > 0 && (
        <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-white/70">
          <h3 className="text-sm font-semibold text-white">
            Historial de mediciones
          </h3>
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
              >
                <span>
                  {new Date(entry.timestamp).toLocaleTimeString()} ·{" "}
                  {entry.mode === "short" ? "Corto" : "Largo"} ({entry.points}{" "}
                  pts) ·{" "}
                  {entry.type === "initial" ? "Inicial" : "Actualización"} #
                  {entry.samples}
                </span>
                <span className="font-mono text-white">
                  {entry.duration.toFixed(2)} ms
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        ref={containerRef}
        className="h-[360px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/40"
      />
    </section>
  );
}

export default UPlotDemo;
