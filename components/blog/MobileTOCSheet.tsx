"use client";

import { useEffect } from "react";
import { TableOfContentsItem } from "@/lib/types/blog";
import { TableOfContents } from "./TableOfContents";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileTOCSheetProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void; // renamed to silence Next.js warning
  items: TableOfContentsItem[];
}

export function MobileTOCSheet({
  open,
  onOpenChangeAction,
  items,
}: MobileTOCSheetProps) {
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
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent
        side="left"
        className="bg-[#0a0612] text-white border-r border-white/10 px-4 py-6 flex flex-col w-3/4 sm:max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <SheetTitle className="text-sm font-semibold tracking-wide text-white/80 font-mono">
            Índice del artículo
          </SheetTitle>
          <button
            onClick={() => onOpenChangeAction(false)}
            aria-label="Cerrar índice"
            className="text-white/60 hover:text-white transition-colors text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 pb-4 -mr-1">
          {hasToc ? (
            <TableOfContents items={items} onItemClick={() => onOpenChangeAction(false)} />
          ) : (
            <p className="text-xs text-white/40">No hay títulos disponibles.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
