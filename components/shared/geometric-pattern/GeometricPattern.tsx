"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLegoBlocks } from "./useLegoBlocks";
import { LegoBlock } from "./LegoBlock";
import { ANIMATION_CONFIG } from "./config";

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

  const { desktopBlocks, mobileBlocks, desktopTotalWidth, mobileTotalWidth } =
    useLegoBlocks();

  const desktopAnimationProps = {
    x: prefersReducedMotion ? 0 : [0, -desktopTotalWidth],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: ANIMATION_CONFIG.desktop,
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
        duration: ANIMATION_CONFIG.mobile,
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
