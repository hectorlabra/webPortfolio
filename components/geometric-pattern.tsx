"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GeometricPattern() {
  const prefersReducedMotion = useReducedMotion();
  
  // Ancho de un solo cubo
  const cubeWidth = 130;
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
    <div className="relative w-full h-16 bg-[#0a0612]">
      <div className="absolute top-0 left-0 w-screen h-full overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)" }}>
        <motion.div 
          className="absolute top-0 left-0"
          animate={animationProps}
        >
          <svg
            className="h-full"
            width={cubeWidth * 19} // Un cubo extra para transición fluida
            height="80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Definimos un solo cubo como patrón */}
              <g id="singleCube" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.9" fill="none">
                {/* Cara frontal */}
                <path d={`M0,40 L45,18 L90,40 L45,62 L0,40`} />
                {/* Cara superior */}
                <path d={`M0,40 L45,18 L22,2 L-23,24 L0,40`} />
                {/* Cara lateral */}
                <path d={`M90,40 L45,62 L45,78 L90,56 L90,40`} />
              </g>
            </defs>

            {/* Repetimos el cubo múltiples veces */}
            {Array.from({ length: 19 }).map((_, i) => (
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

