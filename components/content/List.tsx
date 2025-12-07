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
        "text-[#e2e2e2] text-lg leading-[1.75] mb-8 pl-6",
        ordered ? "list-decimal" : "list-disc",
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
