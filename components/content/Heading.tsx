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
  2: "text-[1.75rem] font-bold mt-20 mb-6 text-white leading-tight tracking-tight",
  3: "text-[1.35rem] font-semibold mt-14 mb-4 text-white leading-snug",
  4: "text-lg font-semibold mt-10 mb-3 text-white",
};

export function Heading({ level, children, id, className }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className={cn(headingStyles[level], className)}>
      {children}
    </Tag>
  );
}
