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
            {/* Patrón de hexágonos repetidos para cubrir todo el ancho */}
            {Array.from({ length: 24 }).map((_, i) => (
              <g key={i}>
                {/* Hexágono central */}
                <path d={`M${i * 100},40 L${i * 100 + 25},25 L${i * 100 + 50},40 L${i * 100 + 25},55 L${i * 100},40`} />
                
                {/* Hexágono inferior */}
                <path d={`M${i * 100 - 50},70 L${i * 100 - 25},55 L${i * 100},70 L${i * 100 - 25},85 L${i * 100 - 50},70`} />
                
                {/* Hexágono superior */}
                <path d={`M${i * 100 - 50},10 L${i * 100 - 25},-5 L${i * 100},10 L${i * 100 - 25},25 L${i * 100 - 50},10`} />
                
                {/* Líneas conectoras */}
                <path d={`M${i * 100 - 25},25 L${i * 100 - 25},55`} />
                <path d={`M${i * 100 + 25},55 L${i * 100 + 25},85`} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

