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
        // User feedback: #e2e2e2, font-light (300), 1.8 spacing
        "text-[#e2e2e2] text-lg leading-[1.8] font-light tracking-normal mb-6",
        // Bold: subtle contrast (#e0e0e0), medium weight (500)
        "[&_strong]:text-[#e0e0e0] [&_strong]:font-medium",
        "[&_b]:text-[#e0e0e0] [&_b]:font-medium",
        className
      )}
    >
      {children}
    </p>
  );
}
