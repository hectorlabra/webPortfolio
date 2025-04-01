export function Logo({ size = "default" }: { size?: "default" | "small" } = {}) {
  const scale = size === "small" ? 0.62 : 0.72;  // Ligeramente reducido
  const baseWidth = 34 * scale;
  const baseHeight = 34 * scale;

  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex items-center justify-center" 
        style={{ 
          height: size === "small" ? "20px" : "24px",
          marginTop: size === "small" ? "-2px" : "-3px" // Ajuste fino para centrar verticalmente
        }}
      >
        <svg 
          width={baseWidth} 
          height={baseHeight} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pieza amarilla (base izquierda) - perspectiva isométrica */}
          <g transform="translate(6, 14)">
            {/* Cara superior */}
            <path d="M2 12l8 -4l8 4v8l-8 4l-8 -4z" fill="#FFD100" />
            {/* Cara derecha */}
            <path d="M10 8l8 4v8l-8 -4v-8z" fill="#D4AD00" />
            {/* Cara izquierda */}
            <path d="M2 12l8 -4v8l-8 4v-8z" fill="#E6BC00" />
            {/* Conectores LEGO */}
            <circle cx="6" cy="10" r="1.2" fill="#E6BC00" stroke="#FFD100" strokeWidth="0.3" />
            <circle cx="10" cy="10" r="1.2" fill="#E6BC00" stroke="#FFD100" strokeWidth="0.3" />
          </g>

          {/* Pieza azul (base derecha) - perspectiva isométrica */}
          <g transform="translate(18, 14)">
            {/* Cara superior */}
            <path d="M2 12l8 -4l8 4v8l-8 4l-8 -4z" fill="#00A3FF" />
            {/* Cara derecha */}
            <path d="M10 8l8 4v8l-8 -4v-8z" fill="#0081CC" />
            {/* Cara izquierda */}
            <path d="M2 12l8 -4v8l-8 4v-8z" fill="#0090E0" />
            {/* Conectores LEGO */}
            <circle cx="6" cy="10" r="1.2" fill="#0090E0" stroke="#00A3FF" strokeWidth="0.3" />
            <circle cx="10" cy="10" r="1.2" fill="#0090E0" stroke="#00A3FF" strokeWidth="0.3" />
          </g>

          {/* Pieza roja (encima) - perspectiva isométrica */}
          <g transform="translate(12, 4)">
            {/* Cara superior */}
            <path d="M2 12l8 -4l8 4v8l-8 4l-8 -4z" fill="#FF3B30" />
            {/* Cara derecha */}
            <path d="M10 8l8 4v8l-8 -4v-8z" fill="#CC2F26" />
            {/* Cara izquierda */}
            <path d="M2 12l8 -4v8l-8 4v-8z" fill="#E0352C" />
            {/* Conectores LEGO */}
            <circle cx="6" cy="10" r="1.2" fill="#E0352C" stroke="#FF3B30" strokeWidth="0.3" />
            <circle cx="10" cy="10" r="1.2" fill="#E0352C" stroke="#FF3B30" strokeWidth="0.3" />
          </g>
        </svg>
      </div>
      <span className={`font-mono ${size === "small" ? "text-xs" : "text-sm"} font-bold`}>hectorlabra.dev</span>
    </div>
  );
}

