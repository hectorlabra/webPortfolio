"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function GeometricPattern() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Ancho de un solo cubo (reducido un 15%)
  const cubeWidth = 110;
  const animationDuration = 60;

  // Versiones separadas de animación, pero con la misma estructura básica
  const desktopAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -cubeWidth * 2],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: animationDuration / 9,
        ease: "linear",
      },
    },
  };

  // Para móvil, hacemos una animación más agresiva con mayor desplazamiento
  const mobileAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -220], // Valor fijo para garantizar movimiento
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 3, // Más rápido para que sea obvio
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
            className="absolute top-0 left-0 h-full"
            animate={mobileAnimationProps} // Usar la animación móvil específica
          >
            <svg
              className="h-full"
              width={cubeWidth * 12} // Reducido para prueba
              height="100%"
              viewBox="0 0 1320 120" // Actualizado para reflejar el nuevo width
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMid meet" // Cambiado a xMin para que empiece desde la izquierda
            >
              <defs>
                <g
                  id="mobileCube"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="0.9"
                  fill="none"
                >
                  <path d={`M0,34 L38,15 L76,34 L38,53 L0,34`} />
                  <path d={`M0,34 L38,15 L19,2 L-19,21 L0,34`} />
                  <path d={`M76,34 L38,53 L38,66 L76,47 L76,34`} />
                </g>
              </defs>

              {Array.from({ length: 12 }).map((_, i) => (
                <use key={i} href="#mobileCube" x={i * cubeWidth} y="10" />
              ))}
            </svg>
          </motion.div>
        ) : (
          <motion.div
            className="absolute top-0 left-0 h-full"
            animate={desktopAnimationProps}
          >
            <svg
              className="h-full"
              width={cubeWidth * 22}
              height="80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <g
                  id="desktopCube"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="0.9"
                  fill="none"
                >
                  <path d={`M0,34 L38,15 L76,34 L38,53 L0,34`} />
                  <path d={`M0,34 L38,15 L19,2 L-19,21 L0,34`} />
                  <path d={`M76,34 L38,53 L38,66 L76,47 L76,34`} />
                </g>
              </defs>

              {Array.from({ length: 22 }).map((_, i) => (
                <use key={i} href="#desktopCube" x={i * cubeWidth} y="0" />
              ))}
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
