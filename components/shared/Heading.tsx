import { createElement, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  withAnchor?: boolean;
  id?: string; // when provided and withAnchor is true, an anchor link will be shown
}

const sizeByLevel: Record<HeadingLevel, string> = {
  1: "text-4xl sm:text-5xl lg:text-6xl" /* 36-48-60px Marc Lou range */,
  2: "text-3xl sm:text-4xl" /* 30-36px */,
  3: "text-2xl sm:text-[1.75rem]" /* 24-28px */,
  4: "text-xl" /* 20px */,
  5: "text-base",
  6: "text-sm uppercase tracking-wide",
};

const weightByLevel: Record<HeadingLevel, string> = {
  1: "font-extrabold" /* 800 weight for H1 */,
  2: "font-bold" /* 700 weight */,
  3: "font-bold" /* 700 weight */,
  4: "font-semibold" /* 600 weight */,
  5: "font-semibold",
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
  type HeadingTagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const Tag = `h${level}` as HeadingTagName;
  const heading = createElement(
    Tag,
    {
      id,
      className: cn(
        "font-mono text-white",
        sizeByLevel[level],
        weightByLevel[level],
        // maintain tight line-height and letter-spacing for headlines - Marc Lou
        level <= 2
          ? "leading-none tracking-[-0.025em]"
          : "leading-tight tracking-[-0.01em]",
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
