import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type HeadingLevel = 2 | 3 | 4;

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  id?: string;
  className?: string;
}

const headingStyles: Record<HeadingLevel, string> = {
  // Headings: off-white, normal tracking
  2: "text-[1.75rem] font-bold mt-16 mb-4 text-[#e8e8e8] leading-tight tracking-normal",
  3: "text-[1.35rem] font-semibold mt-12 mb-3 text-[#e8e8e8] leading-snug tracking-normal",
  4: "text-lg font-semibold mt-8 mb-2 text-[#e8e8e8] tracking-normal",
};

export function Heading({ level, children, id, className }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className={cn(headingStyles[level], className)}>
      {children}
    </Tag>
  );
}
