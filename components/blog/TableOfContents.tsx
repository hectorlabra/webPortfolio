"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TableOfContentsItem } from "@/lib/types/blog";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      }
    );

    // Observar todos los headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  const renderItems = (items: TableOfContentsItem[], level = 0) => {
    return items.map((item) => {
      const isActive = activeId === item.id;

      return (
        <li key={item.id} className={cn("", level > 0 && "ml-3")}>
          <button
            onClick={() => handleClick(item.id)}
            className={cn(
              "block w-full text-left py-1 text-xs transition-colors text-white/60",
              "hover:text-white",
              isActive && "text-white font-medium"
            )}
          >
            {item.text}
          </button>
          {item.children && item.children.length > 0 && (
            <ul className="mt-0.5 space-y-0.5">
              {renderItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <nav className="space-y-2">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
        En este artículo
      </h3>
      <ul className="space-y-0.5 border-l border-white/10 pl-3">
        {renderItems(items)}
      </ul>
    </nav>
  );
}
