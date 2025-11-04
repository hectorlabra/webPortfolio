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
    const { widths, rowGap } = BLOCK_CONFIG;

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

    const collectOverlappingFamilies = (
      blocks: LegoBlockProps[],
      x: number,
      width: number
    ) => {
      const topEnd = x + width;
      const families = new Set<ReturnType<typeof colorFamily>>();
      for (const block of blocks) {
        const blockEnd = block.x + block.width;
        if (!(topEnd <= block.x || x >= blockEnd)) {
          families.add(colorFamily(block.colorIndex));
        }
      }
      return families;
    };

    // Desktop blocks
    const desktopBlocks: LegoBlockProps[] = [];
    let xPos = 0;

    // Fila inferior - secuencia normal de colores
    const bottomBlocks: LegoBlockProps[] = [];
    let bottomPointer = 0;
    let prevBottomFamily: ReturnType<typeof colorFamily> | null = null;
    for (let i = 0; i < 20; i++) {
      const width = widths[i % widths.length];
      const { colorIndex, nextPointer } = findNextColor(
        bottomPointer,
        prevBottomFamily,
        new Set()
      );
      const block = {
        x: xPos,
        y: 35,
        width,
        colorIndex,
      };
      bottomBlocks.push(block);
      desktopBlocks.push(block);
      bottomPointer = nextPointer;
      prevBottomFamily = colorFamily(colorIndex);
      xPos += width;
    }

    const desktopTotalWidth = xPos;

    // Fila superior - offset para encaje + verificación de colores
    const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
    const offset = Math.floor(avgWidth / 2);
    xPos = -offset;
    let topPointer = (bottomPointer + 3) % palette.length;
    let prevTopFamily: ReturnType<typeof colorFamily> | null = null;
    for (let i = 0; i < 21; i++) {
      const width = widths[(i + 4) % widths.length];
      const overlappingFamilies = collectOverlappingFamilies(
        bottomBlocks,
        xPos,
        width
      );
      const { colorIndex, nextPointer } = findNextColor(
        topPointer,
        prevTopFamily,
        overlappingFamilies
      );
      desktopBlocks.push({
        x: xPos,
        y: 35 - rowGap,
        width,
        colorIndex,
      });
      topPointer = nextPointer;
      prevTopFamily = colorFamily(colorIndex);
      xPos += width;
    }

    // Mobile blocks
    const mobileBlocks: LegoBlockProps[] = [];
    xPos = 0;

    // Fila inferior
    const bottomBlocksMobile: LegoBlockProps[] = [];
    bottomPointer = 0;
    prevBottomFamily = null;
    for (let i = 0; i < 15; i++) {
      const width = widths[i % widths.length];
      const { colorIndex, nextPointer } = findNextColor(
        bottomPointer,
        prevBottomFamily,
        new Set()
      );
      const block = {
        x: xPos,
        y: 35,
        width,
        colorIndex,
      };
      bottomBlocksMobile.push(block);
      mobileBlocks.push(block);
      bottomPointer = nextPointer;
      prevBottomFamily = colorFamily(colorIndex);
      xPos += width;
    }

    const mobileTotalWidth = xPos;

    // Fila superior mobile
    xPos = -offset;
    topPointer = (bottomPointer + 3) % palette.length;
    prevTopFamily = null;
    for (let i = 0; i < 16; i++) {
      const width = widths[(i + 3) % widths.length];
      const overlappingFamilies = collectOverlappingFamilies(
        bottomBlocksMobile,
        xPos,
        width
      );
      const { colorIndex, nextPointer } = findNextColor(
        topPointer,
        prevTopFamily,
        overlappingFamilies
      );
      mobileBlocks.push({
        x: xPos,
        y: 35 - rowGap,
        width,
        colorIndex,
      });
      topPointer = nextPointer;
      prevTopFamily = colorFamily(colorIndex);
      xPos += width;
    }

    return {
      desktopBlocks,
      mobileBlocks,
      desktopTotalWidth,
      mobileTotalWidth,
    };
  }, []);
}
