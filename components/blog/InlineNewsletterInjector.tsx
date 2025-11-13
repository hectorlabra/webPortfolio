"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
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
  const rootRef = useRef<Root | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (injectedRef.current) return;
    if (typeof window === "undefined") return;

    const log = (...args: unknown[]) =>
      console.debug("[InlineNewsletterInjector]", ...args);
    const warn = (...args: unknown[]) =>
      console.warn("[InlineNewsletterInjector]", ...args);

    const isXL = window.matchMedia("(min-width: 1280px)").matches;
    if (isXL) {
      log("Abort injection: viewport >= 1280px");
      return;
    }

    const wrapperId = "inline-newsletter-wrapper";
    const renderNewsletter = (wrapper: HTMLElement, reason: string) => {
      log(`Rendering inline newsletter (${reason})`);
      rootRef.current = createRoot(wrapper);
      rootRef.current.render(
        <div
          className="opacity-0 translate-y-2 will-change-transform transition-all duration-500"
          data-inline-newsletter
        >
          <NewsletterInPost variant="compact" />
        </div>
      );
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
    };

    const createWrapper = () => {
      const wrapper = document.createElement("div");
      wrapper.id = wrapperId;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Suscripción al newsletter");
      wrapper.className = "block xl:hidden my-10";
      return wrapper;
    };

    const fallbackInject = (reason: string) => {
      if (injectedRef.current) return;
      const article = document.getElementById("post-article");
      if (!article) {
        warn("Fallback aborted: #post-article no encontrado");
        return;
      }

      const contentHost = article.querySelector(".blog-richtext");
      const firstRenderable =
        contentHost?.querySelector("h2, h3, p, pre") || contentHost;

      if (!firstRenderable || !firstRenderable.parentNode) {
        warn("Fallback aborted: No se encontró un nodo para insertar");
        return;
      }

      const wrapper = createWrapper();
      firstRenderable.parentNode.insertBefore(wrapper, firstRenderable);
      renderNewsletter(wrapper, reason);
    };

    const attemptInjection = () => {
      if (injectedRef.current) return;
      if (document.getElementById(wrapperId)) {
        log("Wrapper ya existe, marcando como inyectado");
        injectedRef.current = true;
        return;
      }
      const article = document.getElementById("post-article");
      if (!article) {
        log("#post-article aún no existe, se reintenta");
        return;
      }
      const headings = Array.from(article.querySelectorAll("h2"));
      if (headings.length === 0) {
        log("No se encontraron h2 todavía, esperando...");
        return; // esperar más
      }

      // Elegir segundo h2 si existe, sino el primero
      const target = headings[1] || headings[0];
      if (!target || !target.parentNode) {
        warn("Heading objetivo sin parentNode, no se pudo inyectar aún");
        return;
      }

      const wrapper = createWrapper();
      const sibling = target.nextSibling;
      target.parentNode.insertBefore(wrapper, target.nextSibling);
      log(
        `Newsletter insertado después del ${
          headings[1] ? "segundo" : "primer"
        } h2 (sibling: ${sibling?.nodeName ?? "none"})`
      );
      renderNewsletter(wrapper, "heading-match");
    };

    // Intento inmediato
    attemptInjection();
    if (injectedRef.current) return;

    // Observer para headings que aparezcan más tarde
    const article = document.getElementById("post-article");
    if (!article) return;
    let timeoutId: number | null = null;
    let fallbackTimeoutId: number | null = null;
    const observer = new MutationObserver(() => {
      attemptInjection();
      if (injectedRef.current) {
        if (observer) observer.disconnect();
        if (timeoutId) window.clearTimeout(timeoutId);
        if (fallbackTimeoutId) window.clearTimeout(fallbackTimeoutId);
      }
    });
    observer.observe(article, { childList: true, subtree: true });
    // Failsafe: dejar de observar tras 5s
    timeoutId = window.setTimeout(() => {
      if (observer) observer.disconnect();
      if (!injectedRef.current) {
        warn("Timeout alcanzado sin inyección, aplicando fallback");
        fallbackInject("fallback-timeout");
      }
    }, 5000) as unknown as number;

    // Fallback rápido si en 2.5s no aparece
    fallbackTimeoutId = window.setTimeout(() => {
      if (!injectedRef.current) {
        warn("Fallback rápido disparado (2.5s)");
        fallbackInject("fallback-early");
      }
    }, 2500);

    return () => {
      if (observer) observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
      if (fallbackTimeoutId) window.clearTimeout(fallbackTimeoutId);
      if (rootRef.current) {
        try {
          rootRef.current.unmount();
        } catch (error) {
          console.error(
            "[InlineNewsletterInjector] Error desmontando root",
            error
          );
        } finally {
          rootRef.current = null;
        }
      }
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
