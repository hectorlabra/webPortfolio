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
        "border-l-4 border-white/20 pl-6 py-4 my-6",
        "bg-white/5 rounded-r-lg",
        // User feedback: #e2e2e2, font-light (300)
        "text-[#e2e2e2] text-lg leading-[1.8] font-light tracking-normal",
        "[&_strong]:text-[#e0e0e0] [&_strong]:font-medium",
        className
      )}
    >
      {children}
    </blockquote>
  );
}
