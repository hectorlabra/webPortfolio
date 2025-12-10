"use client";

import { NewsletterForm } from "./newsletter-form";

export function NewsletterFormFooter(
  props: Parameters<typeof NewsletterForm>[0]
) {
  return (
    <NewsletterForm
      {...props}
      minimal
      compact={false}
      tagline="Lives · insights · SEO práctico"
      taglineClassName="text-white/70 text-[0.55rem] sm:text-[0.75rem] tracking-[0.04em] whitespace-nowrap text-center"
    />
  );
}
