"use client";

import { useEffect, useRef } from "react";
import { CopyCodeButton } from "./CopyCodeButton";
import { createRoot } from "react-dom/client";

interface CodeBlockEnhancerProps {
  children: React.ReactNode;
}

export function CodeBlockEnhancer({ children }: CodeBlockEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const codeBlocks = containerRef.current.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      // Evitar agregar múltiples botones
      if (pre.querySelector(".copy-code-button-container")) return;

      const code = pre.querySelector("code");
      if (!code) return;

      const codeText = code.textContent || "";

      // Crear contenedor para el botón
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "copy-code-button-container";
      pre.appendChild(buttonContainer);

      // Renderizar el botón de React
      const root = createRoot(buttonContainer);
      root.render(<CopyCodeButton code={codeText} />);
    });
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}
