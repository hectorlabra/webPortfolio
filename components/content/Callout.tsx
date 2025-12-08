import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CalloutVariant = "tip" | "warning" | "note";

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  {
    label: string;
    emoji: string;
    // Lego Colors with calibrated opacity for dark mode
    colorClass: string;
    borderColorClass: string;
    bgClass: string;
  }
> = {
  tip: {
    label: "TIP",
    emoji: "💡",
    colorClass: "text-[#4CD964]",
    borderColorClass: "border-[#4CD964]",
    bgClass: "bg-[#4CD964]/10",
  },
  warning: {
    label: "ADVERTENCIA",
    emoji: "⚠️",
    colorClass: "text-[#FFD100]",
    borderColorClass: "border-[#FFD100]",
    bgClass: "bg-[#FFD100]/10",
  },
  note: {
    label: "NOTA",
    emoji: "📝",
    colorClass: "text-[#007AFF]",
    borderColorClass: "border-[#007AFF]",
    bgClass: "bg-[#007AFF]/10",
  },
};

export function Callout({
  children,
  variant = "tip",
  className,
}: CalloutProps) {
  const config = variantConfig[variant];

  return (
    <aside
      className={cn(
        "my-8 rounded-lg overflow-hidden border",
        config.borderColorClass,
        config.bgClass,
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Header / Sidebar for Mobile/Desktop */}
        <div
          className={cn(
            "flex items-center gap-3 p-4 sm:p-5 sm:w-48 sm:border-r border-b sm:border-b-0 border-white/10 shrink-0",
            "bg-black/20"
          )}
        >
          <span className="text-xl">{config.emoji}</span>
          <span
            className={cn(
              "font-mono text-sm font-bold tracking-wider uppercase",
              config.colorClass
            )}
          >
            {config.label}
          </span>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            "p-5 sm:p-6",
            // FORCE Inconsolata (font-mono) as requested
            "font-mono"
          )}
        >
          <div
            className={cn(
              "text-[#e2e2e2] text-lg leading-[1.8] font-normal",
              "[&_strong]:text-white [&_strong]:font-bold",
              "[&_b]:text-white [&_b]:font-bold"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
