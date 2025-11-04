import type { LegoBlockProps } from "./types";
import { LEGO_COLORS, BLOCK_DIMENSIONS } from "./config";

export function LegoBlock({ x, y, width, colorIndex }: LegoBlockProps) {
  const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
  const { height: blockHeight, depth } = BLOCK_DIMENSIONS;

  // Perspectiva isométrica: vista desde arriba en ángulo
  // Cara frontal
  const frontFace = `M ${x} ${y + depth} L ${x + width} ${y + depth} L ${
    x + width
  } ${y + depth + blockHeight} L ${x} ${y + depth + blockHeight} Z`;

  // Cara derecha (lateral)
  const rightFace = `M ${x + width} ${y + depth} L ${
    x + width + depth
  } ${y} L ${x + width + depth} ${y + blockHeight} L ${x + width} ${
    y + depth + blockHeight
  } Z`;

  // Cara superior
  const topFace = `M ${x} ${y + depth} L ${x + width} ${y + depth} L ${
    x + width + depth
  } ${y} L ${x + depth} ${y} Z`;

  // Studs LEGO en la cara superior - distribución mejorada
  const studCount = width > 85 ? 3 : width > 70 ? 2 : 1;
  const studs = [];
  const studRadius = 2.5;
  const studSpacing = width / (studCount + 1);

  for (let i = 0; i < studCount; i++) {
    const offsetX = studSpacing * (i + 1);
    // Proyección isométrica del stud
    const studX = x + depth * 0.5 + offsetX;
    const studY = y + depth * 0.5 - offsetX * 0.5;

    studs.push(
      <g key={i}>
        {/* Base del stud */}
        <circle
          cx={studX}
          cy={studY}
          r={studRadius + 0.5}
          fill={color.shadow}
          opacity={0.3}
        />
        {/* Stud principal */}
        <circle
          cx={studX}
          cy={studY - 0.5}
          r={studRadius}
          fill={color.fill}
          opacity={0.85}
        />
        {/* Highlight del stud */}
        <circle
          cx={studX - 0.5}
          cy={studY - 1}
          r={0.8}
          fill="white"
          opacity={0.4}
        />
      </g>
    );
  }

  return (
    <g>
      {/* Cara derecha - profundidad */}
      <path d={rightFace} fill={color.shadow} />

      {/* Cara superior */}
      <path d={topFace} fill={color.stroke} />

      {/* Cara frontal */}
      <path d={frontFace} fill={color.fill} />

      {/* Studs LEGO */}
      {studs}

      {/* Highlights sutiles */}
      <line
        x1={x}
        y1={y + depth + 2}
        x2={x + width}
        y2={y + depth + 2}
        stroke="white"
        strokeWidth="1"
        opacity={0.25}
      />
      <line
        x1={x + depth}
        y1={y + 1}
        x2={x + width + depth}
        y2={y + 1}
        stroke="white"
        strokeWidth="0.5"
        opacity={0.15}
      />
    </g>
  );
}
