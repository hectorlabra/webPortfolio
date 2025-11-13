"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { NewsletterInPost } from "./NewsletterInPost";

/**
 * InlineNewsletterInjector
 * -------------------------------------------------------------
 * Injecta el bloque compacto de newsletter dentro del artículo.
 * Reglas:
 *  - Solo en pantallas < 1280px (mobile + tablet) para no duplicar sidebars.
 *  - Intenta colocar DESPUÉS del segundo <h2>. Si sólo existe un <h2>, usa ese.
 *  - Si los headings todavía no están renderizados al primer intento (casos raros
 *    por rehidratación diferida), se utiliza un MutationObserver hasta encontrarlos
 *    (timeout de seguridad para evitar loops).
 *  - Evita inyecciones duplicadas usando ref y comprobando wrapper existente.
 */
export function InlineNewsletterInjector() {
  const injectedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (injectedRef.current) return;
    if (typeof window === "undefined") return;

    const isXL = window.matchMedia("(min-width: 1280px)").matches;
    if (isXL) return;

    const wrapperId = "inline-newsletter-wrapper";
    const attemptInjection = () => {
      if (injectedRef.current) return;
      if (document.getElementById(wrapperId)) {
        injectedRef.current = true;
        return;
      }
      const article = document.getElementById("post-article");
      if (!article) return;
      const headings = Array.from(article.querySelectorAll("h2"));
      if (headings.length === 0) return; // esperar más

      // Elegir segundo h2 si existe, sino el primero
      const target = headings[1] || headings[0];
      if (!target || !target.parentNode) return;

      const wrapper = document.createElement("div");
      wrapper.id = wrapperId;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Suscripción al newsletter");
      wrapper.className = "block xl:hidden my-10";
      target.parentNode.insertBefore(wrapper, target.nextSibling);

      const root = createRoot(wrapper);
      root.render(
        <div
          className="opacity-0 translate-y-2 will-change-transform transition-all duration-500"
          data-inline-newsletter
        >
          <NewsletterInPost variant="compact" />
        </div>
      );
      requestAnimationFrame(() => {
        const el = wrapper.querySelector("[data-inline-newsletter]") as HTMLElement | null;
        if (el) {
          el.classList.remove("opacity-0", "translate-y-2");
          el.classList.add("opacity-100", "translate-y-0");
        }
      });
      injectedRef.current = true;
    };

    // Intento inmediato
    attemptInjection();
    if (injectedRef.current) return;

    // Observer para headings que aparezcan más tarde
    const article = document.getElementById("post-article");
    if (!article) return;
    let timeoutId: number | null = null;
    const observer = new MutationObserver(() => {
      attemptInjection();
      if (injectedRef.current) {
        if (observer) observer.disconnect();
        if (timeoutId) window.clearTimeout(timeoutId);
      }
    });
    observer.observe(article, { childList: true, subtree: true });
    // Failsafe: dejar de observar tras 5s
    timeoutId = window.setTimeout(() => {
      if (observer) observer.disconnect();
    }, 5000) as unknown as number;

    return () => {
      if (observer) observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
      const existing = document.getElementById(wrapperId);
      if (existing && existing.parentNode) {
        try {
          existing.remove();
        } catch {}
      }
    };
  }, [mounted]);

  return null; // No direct render; injection happens imperatively
}
