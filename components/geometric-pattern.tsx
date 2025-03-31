export function GeometricPattern() {
  return (
    <div className="relative w-full h-16 bg-[#0a0612]">
      {/* Contenedor que mantiene la altura pero permite overflow */}
      <div className="absolute top-0 left-0 w-screen h-full overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)" }}>
        <svg
          className="w-screen h-full"
          viewBox="0 0 2400 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" fill="none">
            {/* Patrón de cubos con mejor espaciado */}
            {Array.from({ length: 25 }).map((_, i) => (
              <g key={i}>
                {/* Cara frontal del cubo */}
                <path d={`M${i * 95},40 L${i * 95 + 30},25 L${i * 95 + 60},40 L${i * 95 + 30},55 L${i * 95},40`} />
                
                {/* Cara superior del cubo */}
                <path d={`M${i * 95},40 L${i * 95 + 30},25 L${i * 95 + 15},10 L${i * 95 - 15},25 L${i * 95},40`} />
                
                {/* Cara lateral del cubo */}
                <path d={`M${i * 95 + 60},40 L${i * 95 + 30},55 L${i * 95 + 30},70 L${i * 95 + 60},55 L${i * 95 + 60},40`} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

