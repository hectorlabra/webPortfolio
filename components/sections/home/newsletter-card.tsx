"use client";

import { NewsletterFormHome } from "./newsletter-form-home";

/**
 * Tarjeta completa de newsletter con título, lista de beneficios y formulario.
 * Se usa en:
 * - Home (hero)
 * - CTA final de artículos (variant="prominent" en NewsletterInPost)
 */
export function NewsletterCard() {
  return (
    <div className="rounded-lg border-2 border-white/20 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur w-full max-w-md mx-auto animate-circular-glow shadow-sm shadow-white/5">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="font-mono text-lg sm:text-xl lg:text-[1.2rem] font-bold text-center">
          Únete al Círculo de Builders
        </h2>

        <ul className="mx-auto w-full max-w-[200px] text-left text-xs text-white/60 space-y-1.5">
          <li className="grid grid-cols-[8px_1fr] items-start gap-2">
            <span className="w-[4px] h-[4px] rounded-full bg-[#FFD24C] mt-1.5" />
            <span>Lives: código + estrategia.</span>
          </li>
          <li className="grid grid-cols-[8px_1fr] items-start gap-2">
            <span className="w-[4px] h-[4px] rounded-full bg-[#FFD24C] mt-1.5" />
            <span>Insights de construcción.</span>
          </li>
          <li className="grid grid-cols-[8px_1fr] items-start gap-2">
            <span className="w-[4px] h-[4px] rounded-full bg-[#FFD24C] mt-1.5" />
            <span>SEO para atraer usuarios.</span>
          </li>
        </ul>
      </div>
      <div className="mt-4 sm:mt-6">
        <NewsletterFormHome />
      </div>
    </div>
  );
}
