"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GeometricPattern() {
  const prefersReducedMotion = useReducedMotion();
  
  // Ancho de un solo cubo (reducido un 15%)
  const cubeWidth = 110; // Reducido de 130 a 110
  const animationDuration = 60;
  
  // Configuración de la animación con un solo elemento
  const animationProps = {
    x: prefersReducedMotion ? 0 : [0, -cubeWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: animationDuration / 18, // Para que toda la fila se mueva en 60s
        ease: "linear",
      },
    },
  };

  return (
    <div className="relative w-full h-12 md:h-16 lg:h-20 bg-[#0a0612]">
      <div className="absolute top-0 left-0 w-screen h-full overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)" }}>
        <motion.div 
          className="absolute top-0 left-0"
          animate={animationProps}
        >
          <svg
            className="h-full"
            width={cubeWidth * 22} // Aumentado de 19 a 22 cubos para mantener la cobertura visual
            height="80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Definimos un solo cubo como patrón (reducido proporcionalmente) */}
              <g id="singleCube" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.9" fill="none">
                {/* Cara frontal - reducida proporcionalmente */}
                <path d={`M0,34 L38,15 L76,34 L38,53 L0,34`} /> {/* Valores reducidos ~15% */}
                {/* Cara superior - reducida proporcionalmente */}
                <path d={`M0,34 L38,15 L19,2 L-19,21 L0,34`} /> {/* Valores reducidos ~15% */}
                {/* Cara lateral - reducida proporcionalmente */}
                <path d={`M76,34 L38,53 L38,66 L76,47 L76,34`} /> {/* Valores reducidos ~15% */}
              </g>
            </defs>

            {/* Repetimos el cubo múltiples veces */}
            {Array.from({ length: 22 }).map((_, i) => (
              <use 
                key={i} 
                href="#singleCube" 
                x={i * cubeWidth} 
                y="0" 
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

