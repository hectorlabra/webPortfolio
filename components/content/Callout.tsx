import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CalloutVariant = "tip" | "warning" | "note";

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  className?: string;
}

const variantStyles: Record<CalloutVariant, string> = {
  tip: "bg-green-500/5 border-l-4 border-green-500 hover:bg-green-500/10",
  warning:
    "bg-yellow-500/10 border-l-4 border-yellow-500 hover:bg-yellow-500/15",
  note: "bg-white/5 border-l-4 border-white/30 hover:bg-white/10",
};

export function Callout({
  children,
  variant = "tip",
  className,
}: CalloutProps) {
  return (
    <aside
      className={cn(
        "my-6 p-6 rounded-r-lg transition-colors duration-200",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          // User feedback: #e2e2e2, font-light (300)
          "text-[#e2e2e2] text-lg leading-[1.8] font-light tracking-normal",
          "[&_strong]:text-[#e0e0e0] [&_strong]:font-medium",
          "[&_b]:text-[#e0e0e0] [&_b]:font-medium"
        )}
      >
        {children}
      </div>
    </aside>
  );
}
