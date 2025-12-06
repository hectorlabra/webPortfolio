"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TableOfContentsItem } from "@/lib/types/blog";
import { Twitter, Linkedin, Link as LinkIcon } from "lucide-react";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  onItemClick?: (id: string) => void;
}

export function TableOfContents({ items, onItemClick }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareText, setShareText] = useState<string>("");

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    setShareUrl(url);
    setShareText(document.title || "");
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (onItemClick) {
      onItemClick(id);
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

      {/* Share actions */}
      <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Compartir
        </p>
        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Compartir en X"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Compartir en LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              if (!shareUrl) return;
              navigator.clipboard?.writeText(shareUrl).catch(() => {});
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Copiar enlace"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
