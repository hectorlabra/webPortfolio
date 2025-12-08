import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ListProps {
  items: ReactNode[];
  ordered?: boolean;
  className?: string;
}

export function List({ items, ordered = false, className }: ListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        // User feedback: #e2e2e2, font-light (300)
        "text-[#e2e2e2] text-lg leading-[1.8] font-light tracking-normal mb-6 pl-6",
        ordered ? "list-decimal" : "list-disc",
        // Bold: subtle contrast (#e0e0e0), medium weight (500)
        "[&_strong]:text-[#e0e0e0] [&_strong]:font-medium",
        "[&_b]:text-[#e0e0e0] [&_b]:font-medium",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="mb-3 pl-2">
          {item}
        </li>
      ))}
    </Tag>
  );
}

// Alternative: ListItem for more control
interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return <li className={cn("mb-3 pl-2", className)}>{children}</li>;
}
