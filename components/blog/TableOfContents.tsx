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
        <li key={item.id} className={cn("", level > 0 && "ml-4")}>
          <button
            onClick={() => handleClick(item.id)}
            className={cn(
              "group relative block w-full text-left py-2.5 px-3 text-sm rounded-lg transition-all",
              "hover:bg-white/5",
              isActive && "bg-white/5",
              level === 0 && "font-medium text-white/90",
              level > 0 && "text-white/70"
            )}
          >
            {/* Progress Dot Indicator */}
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all",
                isActive
                  ? "bg-accent-green w-2 h-2 shadow-[0_0_8px_rgba(100,227,101,0.6)]"
                  : "bg-white/20 group-hover:bg-accent-green/50 group-hover:w-2 group-hover:h-2"
              )}
            />
            
            <span className={cn(
              "block transition-colors",
              isActive && "text-accent-green"
            )}>
              {item.text}
            </span>
          </button>
          {item.children && item.children.length > 0 && (
            <ul className="mt-1 space-y-1">
              {renderItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <nav className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-accent-green rounded-full" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">
          En este artículo
        </h3>
      </div>
      <ul className="space-y-1 pl-1">{renderItems(items)}</ul>
    </nav>
  );
}
