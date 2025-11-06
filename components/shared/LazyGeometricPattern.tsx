"use client";

import { useEffect, useRef, useState } from "react";
import { GeometricPattern } from "./geometric-pattern";

interface LazyGeometricPatternProps {
  /**
   * If true, always renders and animates (for hero sections)
   * If false, lazy loads and pauses when off-screen
   */
  priority?: boolean;
}

export function LazyGeometricPattern({
  priority = false,
}: LazyGeometricPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(priority);

  useEffect(() => {
    // If priority, always show
    if (priority) {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Load when close to viewport (200px margin)
          if (entry.isIntersecting) {
            setHasLoaded(true);
            setIsVisible(true);
          } else {
            // Pause animation when off-screen (but keep loaded)
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [priority]);

  return (
    <div ref={containerRef} className="w-full">
      {hasLoaded ? (
        <div
          style={{
            opacity: isVisible ? 1 : 0.3,
            transition: "opacity 0.3s ease",
          }}
        >
          <GeometricPattern />
        </div>
      ) : (
        // Placeholder with same height to prevent layout shift
        <div className="w-full h-16 bg-transparent" aria-hidden="true" />
      )}
    </div>
  );
}
