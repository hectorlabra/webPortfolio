import type { LegoBlockProps } from "./types";
import { LEGO_COLORS, BLOCK_DIMENSIONS } from "./config";

export function LegoBlock({ x, y, width, colorIndex }: LegoBlockProps) {
  const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
  const {
    height: blockHeight,
    depth,
    studRadius,
    studRadiusY,
  } = BLOCK_DIMENSIONS;

  // Calcular número de studs según el ancho
  const studCount = Math.max(2, Math.floor(width / 30));
  const studSpacing = width / (studCount + 1);

  return (
    <g>
      {/* Cara superior (isométrica) - con más brillo */}
      <polygon
        points={`
          ${x},${y}
          ${x + width},${y}
          ${x + width + depth},${y - depth * 0.5}
          ${x + depth},${y - depth * 0.5}
        `}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1.2"
      />

      {/* Cara frontal - con gradiente sutil */}
      <polygon
        points={`
          ${x},${y}
          ${x + width},${y}
          ${x + width},${y + blockHeight}
          ${x},${y + blockHeight}
        `}
        fill={color.shadow}
        stroke={color.stroke}
        strokeWidth="1"
      />

      {/* Cara lateral derecha - más oscura */}
      <polygon
        points={`
          ${x + width},${y}
          ${x + width + depth},${y - depth * 0.5}
          ${x + width + depth},${y + blockHeight - depth * 0.5}
          ${x + width},${y + blockHeight}
        `}
        fill={color.shadow}
        stroke={color.stroke}
        strokeWidth="1"
        opacity="0.75"
      />

      {/* Studs en la cara superior - más grandes y definidos */}
      {Array.from({ length: studCount }).map((_, i) => {
        const studX = x + studSpacing * (i + 1);
        const studY = y - 3;
        return (
          <g key={`stud-${i}`}>
            {/* Sombra del stud */}
            <ellipse
              cx={studX + depth / 2}
              cy={studY - depth * 0.25 + 1.5}
              rx={studRadius}
              ry={studRadiusY}
              fill="rgba(0,0,0,0.3)"
            />
            {/* Base del stud */}
            <ellipse
              cx={studX + depth / 2}
              cy={studY - depth * 0.25}
              rx={studRadius}
              ry={studRadiusY}
              fill={color.stroke}
              stroke={color.shadow}
              strokeWidth="0.8"
            />
            {/* Highlight del stud */}
            <ellipse
              cx={studX + depth / 2 - 1.5}
              cy={studY - depth * 0.25 - 0.5}
              rx={2}
              ry={1}
              fill="rgba(255,255,255,0.4)"
            />
          </g>
        );
      })}

      {/* Highlight en cara superior */}
      <line
        x1={x + 4}
        y1={y}
        x2={x + width - 4}
        y2={y}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />
    </g>
  );
}
