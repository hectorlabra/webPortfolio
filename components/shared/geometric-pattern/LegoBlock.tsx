import type { LegoBlockProps } from "./types";
import { LEGO_COLORS, BLOCK_DIMENSIONS } from "./config";

export function LegoBlock({ x, y, width, colorIndex }: LegoBlockProps) {
  const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
  const { height: blockHeight } = BLOCK_DIMENSIONS;

  return (
    <g>
      {/* Bloque simple 2D sin isométrico */}
      <rect
        x={x}
        y={y}
        width={width}
        height={blockHeight}
        fill={color.fill}
        stroke="none"
      />

      {/* Highlight superior (sutil, dentro del bloque) */}
      <line
        x1={x}
        y1={y + 1}
        x2={x + width}
        y2={y + 1}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
    </g>
  );
}
