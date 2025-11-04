"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Color palette for LEGO blocks
const LEGO_COLORS = [
  { fill: "#64E365", stroke: "#4CAF50" }, // Verde
  { fill: "#FFD100", stroke: "#FFA500" }, // Amarillo
  { fill: "#FF3B30", stroke: "#CC0000" }, // Rojo
  { fill: "#007AFF", stroke: "#0052CC" }, // Azul
  { fill: "#4CD964", stroke: "#2D9E4A" }, // Verde manzana
  { fill: "#FFCC00", stroke: "#CCAA00" }, // Amarillo oro
];

interface LegoBlockProps {
  x: number;
  y: number;
  width: number;
  height: number;
  colorIndex: number;
}

function LegoBlock({ x, y, width, height, colorIndex }: LegoBlockProps) {
  const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
  const stubSize = 4;
  const stubSpacing = width / 4;

  return (
    <g>
      {/* Main block rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1"
        rx="1"
      />

      {/* LEGO studs (puntitos característicos) - solo arriba */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={`stud-${i}`}
          cx={x + stubSpacing * (i + 0.5)}
          cy={y + height / 2}
          r={stubSize / 2}
          fill={color.stroke}
          opacity="0.6"
        />
      ))}

      {/* Highlight line */}
      <line
        x1={x}
        y1={y + 1}
        x2={x + width}
        y2={y + 1}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
      />
    </g>
  );
}

export function GeometricPattern() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Bloques más pequeños y compactos
  const blockWidth = 90;
  const blockHeight = 24;
  const blockGap = 6;

  // Desktop: 1 fila con muchos bloques para cubrir y loop
  const desktopBlocks: LegoBlockProps[] = [];
  for (let i = 0; i < 30; i++) {
    desktopBlocks.push({
      x: i * (blockWidth + blockGap),
      y: 0,
      width: blockWidth,
      height: blockHeight,
      colorIndex: i,
    });
  }

  // Mobile: 1 fila con bloques suficientes
  const mobileBlocks: LegoBlockProps[] = [];
  for (let i = 0; i < 20; i++) {
    mobileBlocks.push({
      x: i * (blockWidth + blockGap),
      y: 0,
      width: blockWidth,
      height: blockHeight,
      colorIndex: i,
    });
  }

  const repeatWidth = (blockWidth + blockGap) * 6; // Repetir cada 6 bloques

  const desktopAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -repeatWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 12,
        ease: "linear",
      },
    },
  };

  const mobileAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -repeatWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 10,
        ease: "linear",
      },
    },
  };

  return (
    <div className="relative w-full h-20 md:h-16 lg:h-20 bg-[#0a0612]">
      <div
        className="absolute top-0 left-0 w-screen h-full overflow-hidden"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        {isMobile ? (
          <motion.div
            className="absolute top-0 left-0 h-full flex items-center"
            animate={mobileAnimationProps}
          >
            <svg
              width={(blockWidth + blockGap) * 20}
              height="100%"
              viewBox={`0 0 ${(blockWidth + blockGap) * 20} ${
                blockHeight + 10
              }`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMid meet"
            >
              <g transform={`translate(0, 5)`}>
                {mobileBlocks.map((block, idx) => (
                  <LegoBlock key={idx} {...block} />
                ))}
              </g>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            className="absolute top-0 left-0 h-full flex items-center"
            animate={desktopAnimationProps}
          >
            <svg
              width={(blockWidth + blockGap) * 30}
              height="100%"
              viewBox={`0 0 ${(blockWidth + blockGap) * 30} ${
                blockHeight + 10
              }`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <g transform={`translate(0, 5)`}>
                {desktopBlocks.map((block, idx) => (
                  <LegoBlock key={idx} {...block} />
                ))}
              </g>
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
