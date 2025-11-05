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

  return (
    <g>
      {/* Cara derecha - profundidad con borde pixel-art */}
      <path
        d={rightFace}
        fill={color.shadow}
        stroke={color.shadow}
        strokeWidth="0.5"
      />

      {/* Cara superior con borde definido */}
      <path
        d={topFace}
        fill={color.stroke}
        stroke={color.shadow}
        strokeWidth="0.5"
        opacity={0.95}
      />

      {/* Cara frontal con borde pixel-art */}
      <path
        d={frontFace}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1"
      />

      {/* Sombra interna sutil en cara frontal - efecto pixel art */}
      <rect
        x={x + 1}
        y={y + depth + blockHeight - 3}
        width={width - 2}
        height={2}
        fill={color.shadow}
        opacity={0.2}
      />

      {/* Highlight superior - más marcado estilo pixel art */}
      <line
        x1={x}
        y1={y + depth + 1}
        x2={x + width}
        y2={y + depth + 1}
        stroke="white"
        strokeWidth="1.5"
        opacity={0.35}
      />

      {/* Borde superior de la cara top - efecto digital */}
      <line
        x1={x + depth + 1}
        y1={y + 1}
        x2={x + width + depth - 1}
        y2={y + 1}
        stroke="white"
        strokeWidth="0.5"
        opacity={0.25}
      />
    </g>
  );
}
