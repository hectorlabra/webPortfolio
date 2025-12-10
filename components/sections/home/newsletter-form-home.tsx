"use client";

import { NewsletterForm } from "./newsletter-form";

export function NewsletterFormHome(props: Parameters<typeof NewsletterForm>[0]) {
  return (
    <NewsletterForm
      {...props}
      tagline="Lives · insights · SEO práctico"
      taglineClassName="text-white/70 text-[0.65rem] sm:text-sm tracking-[0.04em] whitespace-nowrap text-center"
    />
  );
}
