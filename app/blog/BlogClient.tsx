// Minimal Client Component - Only for interactive newsletter forms
"use client";

import { NewsletterFormHome } from "@/components/sections/home/newsletter-form-home";

interface NewsletterSectionProps {
  title: string;
  compact?: boolean;
}

export function NewsletterSection({
  title,
  compact = false,
}: NewsletterSectionProps) {
  return (
    <div
      className={
        compact
          ? "max-w-md mx-auto"
          : "rounded-lg border-2 border-white/20 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur w-full animate-circular-glow shadow-sm shadow-white/5"
      }
    >
      {!compact && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="font-mono text-xl sm:text-2xl lg:text-[1.4rem] font-bold text-center">
            {title}
          </h2>
        </div>
      )}
      <div className={compact ? "" : "mt-4 sm:mt-6"}>
        <NewsletterFormHome />
      </div>
    </div>
  );
}
