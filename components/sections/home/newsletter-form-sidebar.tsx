"use client";

import { NewsletterForm } from "./newsletter-form";

export function NewsletterFormSidebar(
  props: Parameters<typeof NewsletterForm>[0]
) {
  return (
    <NewsletterForm
      {...props}
      compact
      tagline="Lives · insights · SEO"
      taglineClassName="text-white/70 text-[0.6rem] sm:text-[0.85rem] tracking-[0.04em] whitespace-nowrap text-center"
    />
  );
}
