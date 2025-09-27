"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import uPlot, { type AlignedData, type Options } from "uplot";
import "uplot/dist/uPlot.min.css";

const SHORT_SERIES_LENGTH = 24;
const LONG_SERIES_LENGTH = 120;

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
  const [mode, setMode] = useState<"short" | "long">("short");
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [generationTime, setGenerationTime] = useState<number>(0);

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

  useEffect(() => {
    const target = containerRef.current;
    if (!target) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const start = performance.now();
    const chart = new uPlot(
      createChartOptions("Comparativa Ingresos vs Utilidad"),
      data,
      target
    );
    chartRef.current = chart;
    setRenderTime(performance.now() - start);
    setGenerationTime(buildTime);

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
      chart.destroy();
    };
  }, [data, buildTime]);

  const handleModeChange = (nextMode: "short" | "long") => {
    setRenderTime(null);
    setMode(nextMode);
  };

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

      <div className="grid gap-2 text-sm text-white/70">
        <span>{description}</span>
        {typeof generationTime === "number" && (
          <span>Generación de datos: {generationTime.toFixed(2)} ms</span>
        )}
        {typeof renderTime === "number" && (
          <span>Render uPlot: {renderTime.toFixed(2)} ms</span>
        )}
        {renderTime === null && <span>Render uPlot: midiendo…</span>}
      </div>

      <div
        ref={containerRef}
        className="h-[360px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/40"
      />
    </section>
  );
}

export default UPlotDemo;
