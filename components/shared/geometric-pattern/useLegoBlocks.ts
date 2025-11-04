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
    const { widths } = BLOCK_CONFIG;

    const colorFamily = (idx: number): "green" | "yellow" | "red" | "blue" => {
      if (idx === 0 || idx === 4) return "green";
      if (idx === 1 || idx === 5) return "yellow";
      if (idx === 2) return "red";
      return "blue"; // idx === 3
    };

    const palette = [3, 0, 2, 1, 4, 5];

    const findNextColor = (
      startPointer: number,
      prevFamily: ReturnType<typeof colorFamily> | null,
      blockedFamilies: Set<ReturnType<typeof colorFamily>>
    ) => {
      for (let offset = 0; offset < palette.length; offset++) {
        const pointer = (startPointer + offset) % palette.length;
        const candidate = palette[pointer];
        const family = colorFamily(candidate);
        if (family !== prevFamily && !blockedFamilies.has(family)) {
          return {
            colorIndex: candidate,
            nextPointer: (pointer + 1) % palette.length,
          };
        }
      }

      // Fallback: devolver el primer color que no esté bloqueado aunque repita familia
      for (let pointer = 0; pointer < palette.length; pointer++) {
        const candidate = palette[pointer];
        if (!blockedFamilies.has(colorFamily(candidate))) {
          return {
            colorIndex: candidate,
            nextPointer: (pointer + 1) % palette.length,
          };
        }
      }

      // Último recurso: simplemente avanzar
      const candidate = palette[startPointer];
      return {
        colorIndex: candidate,
        nextPointer: (startPointer + 1) % palette.length,
      };
    };

    // Desktop blocks - una sola fila - una sola fila
    const desktopBlocks: LegoBlockProps[] = [];
    let xPos = 0;
    let pointer = 0;
    let prevFamily: ReturnType<typeof colorFamily> | null = null;

    for (let i = 0; i < 25; i++) {
      const width = widths[i % widths.length];
      const { colorIndex, nextPointer } = findNextColor(
        pointer,
        prevFamily,
        new Set()
      );
      desktopBlocks.push({
        x: xPos,
        y: 30,
        width,
        colorIndex,
      });
      pointer = nextPointer;
      prevFamily = colorFamily(colorIndex);
      xPos += width;
    }

    const desktopTotalWidth = xPos;

    // Mobile blocks - una sola fila
    const mobileBlocks: LegoBlockProps[] = [];
    xPos = 0;
    pointer = 0;
    prevFamily = null;

    for (let i = 0; i < 18; i++) {
      const width = widths[i % widths.length];
      const { colorIndex, nextPointer } = findNextColor(
        pointer,
        prevFamily,
        new Set()
      );
      mobileBlocks.push({
        x: xPos,
        y: 30,
        width,
        colorIndex,
      });
      pointer = nextPointer;
      prevFamily = colorFamily(colorIndex);
      xPos += width;
    }

    const mobileTotalWidth = xPos;

    return {
      desktopBlocks,
      mobileBlocks,
      desktopTotalWidth,
      mobileTotalWidth,
    };
  }, []);
}
