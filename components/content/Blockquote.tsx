import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BlockquoteProps {
  children: ReactNode;
  className?: string;
}

export function Blockquote({ children, className }: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-4 border-white/30 pl-6 py-4 my-8",
        "bg-white/5 rounded-r-lg",
        "text-[#e2e2e2] text-lg italic",
        className
      )}
    >
      {children}
    </blockquote>
  );
}
