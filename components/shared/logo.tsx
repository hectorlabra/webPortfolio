"use client";

import { LEGO_COLORS } from "./geometric-pattern/config";

export function Logo({
  size = "default",
}: { size?: "default" | "small" } = {}) {
  const isSmall = size === "small";

  // Sistema minimalista alemán: precisión, geometría pura, grid estricto
  // Ajuste fino: bloques aún más pequeños para equilibrar mejor con el texto
  // Reduce nuevamente para que los bloques queden discretos junto al texto
  const unit = isSmall ? 1.6 : 2.1;
  const blockSize = unit * 2.6; // bloques cuadrados perfectos (reducidos para mejor balance con el texto)
  const gap = unit * 0.15; // gap mínimo, casi flush

  // Grid 2x2 preciso (Bauhaus-inspired)
  const x1 = 0;
  const x2 = blockSize + gap;
  const y1 = 0;
  const y2 = blockSize + gap;

  const viewBox = {
    w: x2 + blockSize,
    h: y2 + blockSize,
  } as const;

  // Reduce el tamaño real del símbolo (no solo el sistema de unidades)
  // para que la diferencia sea claramente visible junto al texto
  const svgHeight = isSmall ? 16 : 20;
  const svgWidth = svgHeight; // logo cuadrado, perfecto

  // Bloque minimalista: flat design, sin sombras, bordes precisos
  const MinimalBlock = ({
    x,
    y,
    size,
    colorIndex,
  }: {
    x: number;
    y: number;
    size: number;
    colorIndex: number;
  }) => {
    const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
    const strokeW = unit * 0.15;
    const radius = unit * 0.25; // corner radius sutil

    return (
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={radius}
        ry={radius}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={strokeW}
      />
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative"
        style={{ height: `${svgHeight}px`, width: `${svgWidth}px` }}
      >
        <svg
          role="img"
          aria-label="hectorlabra.dev"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>hectorlabra.dev</title>

          {/* Grid 2x2: verde, rojo, azul, vacío (asimetría intencional) */}
          <MinimalBlock x={x1} y={y1} size={blockSize} colorIndex={0} />
          <MinimalBlock x={x2} y={y1} size={blockSize} colorIndex={2} />
          <MinimalBlock x={x1} y={y2} size={blockSize} colorIndex={3} />
          {/* x2,y2 vacío - espacio negativo funcional */}
        </svg>
      </div>

      <span
        className={`font-mono ${
          isSmall ? "text-[11px]" : "text-sm"
        } font-semibold tracking-tight`}
      >
        hectorlabra.dev
      </span>
    </div>
  );
}
