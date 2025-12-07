import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export function Paragraph({ children, className }: ParagraphProps) {
  return (
    <p
      className={cn(
        "text-[#e2e2e2] text-lg leading-[1.75] font-normal mb-8",
        className
      )}
    >
      {children}
    </p>
  );
}
