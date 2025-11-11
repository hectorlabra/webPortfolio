"use client";
import { useEffect, useState, useRef } from "react";
import { TableOfContentsItem } from "@/lib/types/blog";
import { TableOfContents } from "./TableOfContents";
import { NewsletterInPost } from "./NewsletterInPost";

interface PostSidebarsClientProps {
  tableOfContents: TableOfContentsItem[];
  /** Optional offset extra added below hero height */
  offset?: number;
}

export function PostSidebarsClient({
  tableOfContents,
  offset = 16,
}: PostSidebarsClientProps) {
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(64); // default matches h-16
  const [show, setShow] = useState<boolean>(false);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [heroPassed, setHeroPassed] = useState<boolean>(false);
  const [atEnd, setAtEnd] = useState<boolean>(false);
  const resizeTimeout = useRef<number | null>(null);

  // Measure hero height
  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById("post-hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // Use scrollY + rect.top for cases where hero isn't at top? Here hero should start near top so just height.
        setHeroHeight(rect.height);
      }
      const header = document.getElementById("site-header");
      if (header) {
        const rect = header.getBoundingClientRect();
        setHeaderHeight(rect.height || 64);
      }
    };
    // Initial and delayed measure (fonts/layout shifts)
    measure();
    const raf = requestAnimationFrame(measure);
    const timeout = window.setTimeout(measure, 250);

    const handleResize = () => {
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(
        measure,
        150
      ) as unknown as number;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Visibility control with start and end sentinels + robust fallback
  useEffect(() => {
    const heroSentinel = document.getElementById("post-hero-sentinel");
    const endSentinel = document.getElementById("post-end-sentinel");

    let heroObserver: IntersectionObserver | null = null;
    let endObserver: IntersectionObserver | null = null;

    const endMargin = 80; // px before article end to start hiding

    if (heroSentinel) {
      heroObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // heroPassed: true when the hero sentinel is no longer visible
          setHeroPassed(!entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          // Trigger a bit earlier than the sticky header to counteract spacing below hero
          rootMargin: `-${headerHeight + 24}px 0px 0px 0px`,
        }
      );
      heroObserver.observe(heroSentinel);
    }

    if (endSentinel) {
      endObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // atEnd: true when approaching the end area
          setAtEnd(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          // Hide a bit before end so sidebars never collide with footer
          rootMargin: `0px 0px -${endMargin}px 0px`,
        }
      );
      endObserver.observe(endSentinel);
    }

    // Fallback with scroll if any sentinel is missing
    if (!heroSentinel || !endSentinel) {
      const onScroll = () => {
        const hPassed = window.scrollY >= Math.max(0, heroHeight - 1);
        let endReached = false;
        const article = document.getElementById("post-article");
        if (article) {
          const rect = article.getBoundingClientRect();
          const articleBottom = rect.bottom + window.scrollY;
          const viewportBottom = window.scrollY + window.innerHeight;
          endReached = viewportBottom >= articleBottom - endMargin;
        }
        setHeroPassed(hPassed);
        setAtEnd(endReached);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    return () => {
      if (heroObserver && heroSentinel) heroObserver.unobserve(heroSentinel);
      if (endObserver && endSentinel) endObserver.unobserve(endSentinel);
    };
  }, [headerHeight]);

  const computedTop = headerHeight + offset; // place below sticky navbar

  // Compute max-height for sidebars to avoid cutting and allow internal scroll
  useEffect(() => {
    const calc = () => {
      const bottomMargin = 24; // breathing room near viewport bottom
      const mh = Math.max(120, window.innerHeight - computedTop - bottomMargin);
      setMaxHeight(mh);
    };
    calc();
    const onResize = () => {
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(calc, 100) as unknown as number;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computedTop]);

  // Derive show flag from observers
  useEffect(() => {
    setShow(heroPassed && !atEnd);
  }, [heroPassed, atEnd]);

  const hasToc = tableOfContents && tableOfContents.length > 0;

  return (
    <>
      {/* Left TOC */}
      {hasToc && (
        <div
          className={
            "pointer-events-none xl:pointer-events-auto hidden xl:block transition-opacity duration-300 " +
            (show ? "opacity-100" : "opacity-0")
          }
          aria-hidden={!show}
          style={{
            position: "fixed",
            top: computedTop,
            left: "calc(50% - 350px - 220px)", // 350 = 700/2
            width: 200,
          }}
        >
          <div
            className="w-full"
            style={{
              pointerEvents: show ? "auto" : "none",
              maxHeight: maxHeight || undefined,
              overflowY: "auto",
            }}
          >
            <TableOfContents items={tableOfContents} />
          </div>
        </div>
      )}

      {/* Right Newsletter */}
      <div
        className={
          "pointer-events-none xl:pointer-events-auto hidden xl:block transition-opacity duration-300 " +
          (show ? "opacity-100" : "opacity-0")
        }
        aria-hidden={!show}
        style={{
          position: "fixed",
          top: computedTop,
          left: "calc(50% + 350px + 32px)", // 350 = 700/2, 32px gap
          width: 260,
        }}
      >
        <div
          className="w-full"
          style={{
            pointerEvents: show ? "auto" : "none",
            maxHeight: maxHeight || undefined,
            overflowY: "auto",
          }}
        >
          <NewsletterInPost variant="compact" />
        </div>
      </div>
    </>
  );
}
