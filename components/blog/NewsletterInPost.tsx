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
              ? "border-2 border-white/20 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur"
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
        {/* Header */}
        {!isCompact && (
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0">
              {isProminent ? (
                <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-green" />
                </div>
              ) : (
                <Mail className="w-6 h-6 text-accent-green" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold font-mono text-white text-xl md:text-2xl mb-2">
                {isProminent ? "¿Te gustó este artículo?" : "Mantente al día"}
              </h3>
              <p className="text-white/70 text-[0.55rem] sm:text-[0.75rem] tracking-[0.1em] whitespace-nowrap">
                {isProminent
                  ? "Lives · insights · SEO"
                  : "Únete al Círculo de Builders y recibe los mejores artículos cada semana."}
              </p>
            </div>
          </div>
        )}

        {isCompact && (
          <h3 className="font-mono font-semibold text-xs text-white/60 uppercase tracking-wider mb-3">
            Únete al Círculo de Builders
          </h3>
        )}

        {/* Newsletter Form */}
        <NewsletterForm
          compact={true}
          tagline="Lives · insights · SEO"
          taglineClassName="text-white/70 text-[0.6rem] sm:text-[0.85rem] tracking-[0.1em] whitespace-nowrap text-center"
        />

        {/* Footer text */}
        {!isCompact && (
          <p className="text-xs text-white/50 mt-4 text-center">
            🔒 Tu email está seguro. Puedes cancelar en cualquier momento.
          </p>
        )}
      </div>
    </div>
  );
}
