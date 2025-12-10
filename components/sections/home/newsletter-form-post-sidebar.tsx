"use client";

import { NewsletterForm } from "./newsletter-form";

export function NewsletterFormPostSidebar(
  props: Parameters<typeof NewsletterForm>[0]
) {
  return (
    <NewsletterForm
      {...props}
      compact
      tagline="Lives · insights · SEO práctico"
      taglineClassName="text-white/70 text-[0.7rem] sm:text-[0.8rem] tracking-[0.04em] whitespace-nowrap text-center"
    />
  );
}
