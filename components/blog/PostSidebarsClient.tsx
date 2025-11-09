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
  offset = 32,
}: PostSidebarsClientProps) {
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
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

  // Visibility control via scroll position and optional sentinel
  useEffect(() => {
    const sentinel = document.getElementById("post-hero-sentinel");
    let observer: IntersectionObserver | null = null;

    if (sentinel) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // When sentinel leaves viewport (entry.boundingClientRect.top < 0 && !entry.isIntersecting) -> show sidebars
          if (!entry.isIntersecting) {
            setShow(true);
          } else {
            setShow(false);
          }
        },
        {
          root: null,
          threshold: 0,
          // A small negative rootMargin top ensures we only hide while fully inside initial view
          rootMargin: "0px 0px -10% 0px",
        }
      );
      observer.observe(sentinel);
    } else {
      // Fallback: scroll listener if sentinel missing
      const onScroll = () => {
        if (window.scrollY >= heroHeight - 80) setShow(true);
        else setShow(false);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    return () => {
      if (observer && sentinel) observer.unobserve(sentinel);
    };
  }, [heroHeight]);

  const computedTop = heroHeight + offset; // dynamic top positioning

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
            style={{ pointerEvents: show ? "auto" : "none" }}
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
          style={{ pointerEvents: show ? "auto" : "none" }}
        >
          <NewsletterInPost variant="compact" />
        </div>
      </div>
    </>
  );
}
