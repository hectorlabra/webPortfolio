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
        relative overflow-hidden rounded-xl
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
        {/* Header */}
        <div
          className={`flex items-start gap-3 ${isCompact ? "mb-4" : "mb-6"}`}
        >
          <div className="flex-shrink-0">
            {isProminent ? (
              <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-green" />
              </div>
            ) : (
              <Mail
                className={`${
                  isCompact ? "w-5 h-5" : "w-6 h-6"
                } text-accent-green`}
              />
            )}
          </div>

          <div className="flex-1">
            <h3
              className={`font-bold font-mono text-white ${
                isCompact ? "text-base mb-1" : "text-xl md:text-2xl mb-2"
              }`}
            >
              {isProminent
                ? "¿Te gustó este artículo?"
                : isCompact
                ? "Newsletter"
                : "Mantente al día"}
            </h3>
            <p
              className={`text-white/70 ${
                isCompact ? "text-xs leading-snug" : "text-sm md:text-base"
              }`}
            >
              {isProminent
                ? "Recibe contenido similar directamente en tu inbox. Sin spam, solo calidad."
                : isCompact
                ? "Artículos de calidad cada semana."
                : "Únete al newsletter y recibe los mejores artículos cada semana."}
            </p>
          </div>
        </div>

        {/* Newsletter Form */}
        <NewsletterForm compact={true} />

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
