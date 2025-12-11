// Minimal Client Component - Only for interactive newsletter forms
"use client";

import { NewsletterCard } from "@/components/sections/home/newsletter-card";
import { NewsletterFormHome } from "@/components/sections/home/newsletter-form-home";

interface NewsletterSectionProps {
  title?: string;
  compact?: boolean;
}

export function NewsletterSection({
  title,
  compact = false,
}: NewsletterSectionProps) {
  // Si no es compact, usamos el mismo componente del home
  if (!compact) {
    return <NewsletterCard />;
  }

  // Versión compacta para el CTA final
  return (
    <div className="max-w-md mx-auto">
      <NewsletterFormHome />
    </div>
  );
}
