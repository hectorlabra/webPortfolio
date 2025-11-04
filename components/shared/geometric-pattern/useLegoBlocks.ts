import { useMemo } from "react";
import type { LegoBlockProps } from "./types";
import { BLOCK_CONFIG } from "./config";

interface UseLegoBlocksReturn {
  desktopBlocks: LegoBlockProps[];
  mobileBlocks: LegoBlockProps[];
  desktopTotalWidth: number;
  mobileTotalWidth: number;
}

export function useLegoBlocks(): UseLegoBlocksReturn {
  return useMemo(() => {
    const { gap, widths, rowGap } = BLOCK_CONFIG;

    // Desktop blocks
    const desktopBlocks: LegoBlockProps[] = [];
    let xPos = 0;

    // Fila inferior
    for (let i = 0; i < 20; i++) {
      const width = widths[i % widths.length];
      desktopBlocks.push({
        x: xPos,
        y: 35,
        width,
        colorIndex: i % 2, // Alterna entre verde y amarillo
      });
      xPos += width + gap;
    }

    const desktopTotalWidth = xPos;

    // Fila superior - offset exacto al 50% del ancho promedio
    const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
    const offset = Math.floor((avgWidth + gap) / 2);
    xPos = -offset;

    for (let i = 0; i < 20; i++) {
      const width = widths[(i + 4) % widths.length];
      desktopBlocks.push({
        x: xPos,
        y: 35 - rowGap,
        width,
        colorIndex: (i + 1) % 2, // Colores alternados inversos
      });
      xPos += width + gap;
    }

    // Mobile blocks
    const mobileBlocks: LegoBlockProps[] = [];
    xPos = 0;

    // Fila inferior
    for (let i = 0; i < 15; i++) {
      const width = widths[i % widths.length];
      mobileBlocks.push({
        x: xPos,
        y: 35,
        width,
        colorIndex: i % 2,
      });
      xPos += width + gap;
    }

    const mobileTotalWidth = xPos;

    // Fila superior mobile
    xPos = -offset;
    for (let i = 0; i < 15; i++) {
      const width = widths[(i + 3) % widths.length];
      mobileBlocks.push({
        x: xPos,
        y: 35 - rowGap,
        width,
        colorIndex: (i + 1) % 2,
      });
      xPos += width + gap;
    }

    return {
      desktopBlocks,
      mobileBlocks,
      desktopTotalWidth,
      mobileTotalWidth,
    };
  }, []);
}
