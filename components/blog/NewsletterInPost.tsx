"use client";

import { NewsletterForm } from "@/components/sections/home/newsletter-form-client";
import { Mail, Sparkles } from "lucide-react";

interface NewsletterInPostProps {
  variant?: "prominent" | "subtle" | "compact";
}

export function NewsletterInPost({
  variant = "prominent",
}: NewsletterInPostProps) {
  const isProminent = variant === "prominent";
  const isCompact = variant === "compact";

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-xl
        ${
          isProminent
            ? "border-2 border-accent-green bg-gradient-to-br from-accent-green/10 to-accent-yellow/5 p-8 shadow-[0_0_30px_rgba(100,227,101,0.2)]"
            : isCompact
            ? "border border-white/10 bg-white/5 p-5"
            : "border border-white/15 bg-white/5 p-6"
        }
      `}
    >
      {/* Decorative elements */}
      {isProminent && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-yellow/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        {isProminent ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-3">
              <h3 className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-white">
                Únete al Círculo de Builders
              </h3>
              <ul className="mx-auto w-full max-w-[240px] text-left text-xs text-white/60 space-y-1.5">
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
            <NewsletterForm
              compact={true}
              tagline="Lives · insights · SEO práctico"
              taglineClassName="text-white/70 text-[0.65rem] sm:text-sm tracking-[0.1em] whitespace-nowrap"
            />
          </div>
        ) : isCompact ? (
          <>
            <h3 className="font-mono font-semibold text-xs text-white/60 uppercase tracking-wider mb-3">
              Únete al Círculo de Builders
            </h3>
            <NewsletterForm
              compact={true}
              tagline="Lives · insights · SEO"
              taglineClassName="text-white/70 text-[0.8rem] sm:text-[0.9rem] tracking-[0.03em] whitespace-nowrap text-center"
            />
          </>
        ) : (
          <p className="text-xs text-white/50 mt-4 text-center">
            🔒 Tu email está seguro. Puedes cancelar en cualquier momento.
          </p>
        )}
      </div>
    </div>
  );
}
