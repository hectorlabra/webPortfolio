export function Logo({ size = "default" }: { size?: "default" | "small" } = {}) {
  return (
    <div className="flex items-center gap-2">
      <svg 
        width={size === "small" ? "20" : "24"} 
        height={size === "small" ? "20" : "24"} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="12" width="8" height="8" fill="#00A3FF" />
        <rect x="4" y="4" width="8" height="8" fill="#FFD100" />
        <rect x="12" y="4" width="8" height="16" fill="#FF3B30" />
      </svg>
      <span className={`font-mono ${size === "small" ? "text-xs" : "text-sm"} font-bold`}>hectorlabra.dev</span>
    </div>
  )
}

