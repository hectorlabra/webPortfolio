import { createElement, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  withAnchor?: boolean;
  id?: string; // when provided and withAnchor is true, an anchor link will be shown
}

const sizeByLevel: Record<HeadingLevel, string> = {
  1: "text-3xl sm:text-4xl lg:text-5xl",
  2: "text-2xl sm:text-3xl",
  3: "text-xl sm:text-2xl",
  4: "text-lg",
  5: "text-base",
  6: "text-sm uppercase tracking-wide",
};

const weightByLevel: Record<HeadingLevel, string> = {
  1: "font-bold tracking-tight",
  2: "font-bold tracking-tight",
  3: "font-bold tracking-tight",
  4: "font-semibold tracking-tight",
  5: "font-semibold tracking-tight",
  6: "font-semibold",
};

export function Heading({
  level = 2,
  withAnchor = false,
  id,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as unknown as keyof JSX.IntrinsicElements;
  const heading = createElement(
    Tag,
    {
      id,
      className: cn(
        "font-mono text-white",
        sizeByLevel[level],
        weightByLevel[level],
        // maintain tight line-height for big titles
        level <= 2 ? "leading-tight" : undefined,
        className
      ),
      ...rest,
    },
    children
  );

  if (!withAnchor || !id) return heading;

  return (
    <div className={cn("flex items-baseline gap-2")}>
      {heading}
      <a href={`#${id}`} className="anchor-link text-xs">
        #
      </a>
    </div>
  );
}

export default Heading;
