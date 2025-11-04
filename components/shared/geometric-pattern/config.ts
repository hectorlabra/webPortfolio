import type { LegoColor, BlockConfiguration } from "./types";

// Colores del branding - solo verde y amarillo
export const LEGO_COLORS: LegoColor[] = [
  { fill: "#64E365", stroke: "#4CAF50", shadow: "#2D7A2F" }, // Verde
  { fill: "#FFD100", stroke: "#FFA500", shadow: "#CC8800" }, // Amarillo
];

// Configuración de bloques
export const BLOCK_CONFIG: BlockConfiguration = {
  gap: 4, // Gap más ajustado
  widths: [70, 85, 75, 95, 65, 80, 90, 60], // Anchos variados
  rowGap: 21, // Separación entre filas
};

// Dimensiones del bloque
export const BLOCK_DIMENSIONS = {
  height: 20,
  depth: 10,
  studRadius: 5, // Studs más grandes
  studRadiusY: 2.5,
} as const;

// Duración de animaciones
export const ANIMATION_CONFIG = {
  desktop: 30,
  mobile: 24,
} as const;
