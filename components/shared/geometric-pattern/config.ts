import type { LegoColor, BlockConfiguration } from "./types";

// Paleta completa de colores LEGO
export const LEGO_COLORS: LegoColor[] = [
  { fill: "#64E365", stroke: "#4CAF50", shadow: "#2D7A2F" }, // Verde
  { fill: "#FFD100", stroke: "#FFA500", shadow: "#CC8800" }, // Amarillo
  { fill: "#FF3B30", stroke: "#CC0000", shadow: "#990000" }, // Rojo
  { fill: "#007AFF", stroke: "#0052CC", shadow: "#003D99" }, // Azul
  { fill: "#4CD964", stroke: "#2D9E4A", shadow: "#1A5C2A" }, // Verde manzana
  { fill: "#FFCC00", stroke: "#CCAA00", shadow: "#998800" }, // Amarillo oro
];

// Configuración de bloques
export const BLOCK_CONFIG: BlockConfiguration = {
  gap: 0, // Sin espacios - bloques pegados
  widths: [70, 85, 75, 95, 65, 80, 90, 60], // Anchos variados
  rowGap: 20, // Separación entre filas
};

// Dimensiones del bloque
export const BLOCK_DIMENSIONS = {
  height: 20,
} as const;

// Duración de animaciones
export const ANIMATION_CONFIG = {
  desktop: 30,
  mobile: 24,
} as const;
