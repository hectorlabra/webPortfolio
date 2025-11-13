"use client";

import { useEffect } from "react";
import { TableOfContentsItem } from "@/lib/types/blog";
import { TableOfContents } from "./TableOfContents";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileTOCSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: TableOfContentsItem[];
}

export function MobileTOCSheet({ open, onOpenChange, items }: MobileTOCSheetProps) {
  // Prevent background scroll when open (fallback if Sheet doesn't handle)
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const hasToc = items && items.length > 0;
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <div className={cn("h-full flex flex-col w-full", "px-4 py-6")}>        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-white/80 font-mono">Índice del artículo</h2>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar índice"
            className="text-white/60 hover:text-white transition-colors text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 pb-4 -mr-1">
          {hasToc ? (
            <TableOfContents items={items} />
          ) : (
            <p className="text-xs text-white/40">No hay títulos disponibles.</p>
          )}
        </div>
      </div>
    </Sheet>
  );
}
