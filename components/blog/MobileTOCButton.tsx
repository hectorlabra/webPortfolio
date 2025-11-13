"use client";

import { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/lib/types/blog";
import { MobileTOCSheet } from "./MobileTOCSheet";
import { List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileTOCButtonProps {
  items: TableOfContentsItem[];
  /** Optional scroll threshold before showing button */
  threshold?: number;
}

export function MobileTOCButton({
  items,
  threshold = 400,
}: MobileTOCButtonProps) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShow(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const hasToc = items && items.length > 0;
  if (!hasToc) return null;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.button
            key="mobile-toc-fab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setOpen(true)}
            aria-label="Abrir índice del artículo"
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-accent-green text-[#0a0612] shadow-lg shadow-accent-green/30 flex items-center justify-center xl:hidden focus:outline-none focus:ring-2 focus:ring-accent-green/60 focus:ring-offset-2 focus:ring-offset-[#0a0612]"
          >
            <List className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
      <MobileTOCSheet open={open} onOpenChangeAction={setOpen} items={items} />
    </>
  );
}
