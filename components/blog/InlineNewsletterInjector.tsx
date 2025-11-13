"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { NewsletterInPost } from "./NewsletterInPost";

/**
 * Injects a compact newsletter signup block after the second H2 in the article.
 * Only active on screens smaller than XL (mirroring hidden sidebars).
 * Falls back silently if fewer than 2 H2 headings exist.
 */
export function InlineNewsletterInjector() {
  const injectedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (injectedRef.current) return; // prevent duplicate injection
    if (typeof window === "undefined") return;

    // Respect xl breakpoint: do not inject on large screens
    const isXL = window.matchMedia("(min-width: 1280px)").matches;
    if (isXL) return;

    const article = document.getElementById("post-article");
    if (!article) return;

    // Collect H2 headings (exclude those inside code blocks if any)
    const headings = Array.from(article.querySelectorAll("h2"));
    if (headings.length < 2) return; // not enough content depth

    const target = headings[1]; // second H2
    if (!target.parentNode) return;

    const wrapperId = "inline-newsletter-wrapper";
    if (document.getElementById(wrapperId)) {
      injectedRef.current = true;
      return; // Already present
    }

    const wrapper = document.createElement("div");
    wrapper.id = wrapperId;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Suscripción al newsletter");
    wrapper.className = "block xl:hidden my-10";

    // Insert after the heading
    target.parentNode.insertBefore(wrapper, target.nextSibling);

    // Mount React component into wrapper
    const root = createRoot(wrapper);
    root.render(
      <div
        className="opacity-0 translate-y-2 will-change-transform transition-all duration-500"
        data-inline-newsletter
      >
        <NewsletterInPost variant="compact" />
      </div>
    );

    // Animate in after a tick
    requestAnimationFrame(() => {
      const el = wrapper.querySelector(
        "[data-inline-newsletter]"
      ) as HTMLElement | null;
      if (el) {
        el.classList.remove("opacity-0", "translate-y-2");
        el.classList.add("opacity-100", "translate-y-0");
      }
    });

    injectedRef.current = true;

    return () => {
      // Clean up if component unmounts (navigation) - remove wrapper root
      try {
        wrapper.remove();
      } catch {}
    };
  }, [mounted]);

  return null; // No direct render; injection happens imperatively
}
