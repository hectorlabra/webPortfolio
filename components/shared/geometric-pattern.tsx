"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Color palette for LEGO blocks
const LEGO_COLORS = [
  { fill: "#64E365", stroke: "#4CAF50", shadow: "#2D7A2F" }, // Verde
  { fill: "#FFD100", stroke: "#FFA500", shadow: "#CC8800" }, // Amarillo
  { fill: "#FF3B30", stroke: "#CC0000", shadow: "#990000" }, // Rojo
  { fill: "#007AFF", stroke: "#0052CC", shadow: "#003D99" }, // Azul
  { fill: "#4CD964", stroke: "#2D9E4A", shadow: "#1A5C2A" }, // Verde manzana
  { fill: "#FFCC00", stroke: "#CCAA00", shadow: "#998800" }, // Amarillo oro
];

interface LegoBlockProps {
  x: number;
  y: number;
  width: number;
  colorIndex: number;
}

function LegoBlock({ x, y, width, colorIndex }: LegoBlockProps) {
  const color = LEGO_COLORS[colorIndex % LEGO_COLORS.length];
  const blockHeight = 24; // Altura fija más apropiada
  const depth = 12; // Profundidad isométrica

  // Calcular número de studs según el ancho
  const studCount = Math.max(2, Math.floor(width / 25));
  const studSpacing = width / (studCount + 1);

  return (
    <g>
      {/* Cara superior (isométrica) */}
      <polygon
        points={`
          ${x},${y}
          ${x + width},${y}
          ${x + width + depth},${y - depth * 0.5}
          ${x + depth},${y - depth * 0.5}
        `}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1"
        opacity="0.95"
      />

      {/* Cara frontal */}
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
        opacity="0.8"
      />

      {/* Cara lateral derecha */}
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
        opacity="0.7"
      />

      {/* Studs en la cara superior */}
      {Array.from({ length: studCount }).map((_, i) => {
        const studX = x + studSpacing * (i + 1);
        const studY = y - 2;
        return (
          <g key={`stud-${i}`}>
            {/* Sombra del stud */}
            <ellipse
              cx={studX + depth / 2}
              cy={studY - depth * 0.25 + 1}
              rx={4}
              ry={2}
              fill={color.shadow}
              opacity="0.4"
            />
            {/* Stud principal */}
            <ellipse
              cx={studX + depth / 2}
              cy={studY - depth * 0.25}
              rx={4}
              ry={2}
              fill={color.stroke}
              stroke={color.stroke}
              strokeWidth="0.5"
            />
          </g>
        );
      })}

      {/* Highlight en cara superior */}
      <line
        x1={x + 3}
        y1={y - 1}
        x2={x + width - 3}
        y2={y - 1}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
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

  // Configuración más simple: una sola fila de bloques con anchos variados
  const blockGap = 8;
  const blockWidths = [60, 80, 70, 90, 65, 75, 85, 55]; // Anchos variados

  // Desktop blocks
  const desktopBlocks: LegoBlockProps[] = [];
  let xPos = 0;

  for (let i = 0; i < 20; i++) {
    const width = blockWidths[i % blockWidths.length];
    desktopBlocks.push({
      x: xPos,
      y: 30, // Centrado verticalmente
      width,
      colorIndex: i,
    });
    xPos += width + blockGap;
  }

  const desktopTotalWidth = xPos;

  // Mobile blocks
  const mobileBlocks: LegoBlockProps[] = [];
  xPos = 0;

  for (let i = 0; i < 15; i++) {
    const width = blockWidths[i % blockWidths.length];
    mobileBlocks.push({
      x: xPos,
      y: 30,
      width,
      colorIndex: i,
    });
    xPos += width + blockGap;
  }

  const mobileTotalWidth = xPos;

  const desktopAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -desktopTotalWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 25,
        ease: "linear",
      },
    },
  };

  const mobileAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -mobileTotalWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 20,
        ease: "linear",
      },
    },
  };

  return (
    <div className="relative w-full h-20 md:h-16 lg:h-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
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
              width={mobileTotalWidth * 2}
              height="100%"
              viewBox={`0 0 ${mobileTotalWidth * 2} 80`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMid meet"
            >
              {/* Primera copia */}
              {mobileBlocks.map((block, idx) => (
                <LegoBlock key={idx} {...block} />
              ))}
              {/* Segunda copia para loop seamless */}
              <g transform={`translate(${mobileTotalWidth}, 0)`}>
                {mobileBlocks.map((block, idx) => (
                  <LegoBlock key={`dup-${idx}`} {...block} />
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
              width={desktopTotalWidth * 2}
              height="100%"
              viewBox={`0 0 ${desktopTotalWidth * 2} 80`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Primera copia */}
              {desktopBlocks.map((block, idx) => (
                <LegoBlock key={idx} {...block} />
              ))}
              {/* Segunda copia para loop seamless */}
              <g transform={`translate(${desktopTotalWidth}, 0)`}>
                {desktopBlocks.map((block, idx) => (
                  <LegoBlock key={`dup-${idx}`} {...block} />
                ))}
              </g>
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
