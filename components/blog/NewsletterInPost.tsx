"use client";

import { NewsletterFormPostSidebar } from "@/components/sections/home/newsletter-form-post-sidebar";
import { NewsletterCard } from "@/components/sections/home/newsletter-card";

interface NewsletterInPostProps {
  variant?: "prominent" | "subtle" | "compact";
}

export function NewsletterInPost({
  variant = "prominent",
}: NewsletterInPostProps) {
  const isCompact = variant === "compact";

  // Para variant="prominent" usamos exactamente el mismo componente del home
  if (variant === "prominent") {
    return <NewsletterCard />;
  }

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-xl
        ${
          isCompact
            ? "border border-white/10 bg-white/5 p-5"
            : "border border-white/15 bg-white/5 p-6"
        }
      `}
    >
      <div className="relative z-10">
        {isCompact ? (
          <>
            <h3 className="font-mono font-semibold text-xs text-white/60 uppercase tracking-wider mb-3">
              Únete al Círculo de Builders
            </h3>
            {/* Widget derecho / variante compacta */}
            <NewsletterFormPostSidebar />
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
