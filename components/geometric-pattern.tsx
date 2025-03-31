export function GeometricPattern() {
  return (
    <div className="w-full h-16 overflow-hidden bg-[#0a0612]">
      <svg
        className="w-full"
        viewBox="0 0 1200 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" fill="none">
          {/* Primera fila de hexágonos completos */}
          <path d="M200,40 L225,25 L250,40 L225,55 L200,40" />
          <path d="M300,40 L325,25 L350,40 L325,55 L300,40" />
          <path d="M400,40 L425,25 L450,40 L425,55 L400,40" />
          <path d="M500,40 L525,25 L550,40 L525,55 L500,40" />
          <path d="M600,40 L625,25 L650,40 L625,55 L600,40" />
          <path d="M700,40 L725,25 L750,40 L725,55 L700,40" />

          {/* Segunda fila de hexágonos (desplazados) */}
          <path d="M150,70 L175,55 L200,70 L175,85 L150,70" />
          <path d="M250,70 L275,55 L300,70 L275,85 L250,70" />
          <path d="M350,70 L375,55 L400,70 L375,85 L350,70" />
          <path d="M450,70 L475,55 L500,70 L475,85 L450,70" />
          <path d="M550,70 L575,55 L600,70 L575,85 L550,70" />
          <path d="M650,70 L675,55 L700,70 L675,85 L650,70" />
          <path d="M750,70 L775,55 L800,70 L775,85 L750,70" />

          {/* Segunda fila de hexágonos (desplazados hacia arriba) */}
          <path d="M150,10 L175,-5 L200,10 L175,25 L150,10" />
          <path d="M250,10 L275,-5 L300,10 L275,25 L250,10" />
          <path d="M350,10 L375,-5 L400,10 L375,25 L350,10" />
          <path d="M450,10 L475,-5 L500,10 L475,25 L450,10" />
          <path d="M550,10 L575,-5 L600,10 L575,25 L550,10" />
          <path d="M650,10 L675,-5 L700,10 L675,25 L650,10" />
          <path d="M750,10 L775,-5 L800,10 L775,25 L750,10" />

          {/* Líneas conectoras */}
          <path d="M175,25 L175,55" />
          <path d="M225,55 L225,85" />
          <path d="M275,25 L275,55" />
          <path d="M325,55 L325,85" />
          <path d="M375,25 L375,55" />
          <path d="M425,55 L425,85" />
          <path d="M475,25 L475,55" />
          <path d="M525,55 L525,85" />
          <path d="M575,25 L575,55" />
          <path d="M625,55 L625,85" />
          <path d="M675,25 L675,55" />
          <path d="M725,55 L725,85" />
          <path d="M775,25 L775,55" />
        </g>
      </svg>
    </div>
  )
}

