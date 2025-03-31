export function LegoBlocks() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Primera fila */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-xs font-medium py-2 px-3 rounded text-center">
          NICHOS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-xs font-medium py-2 px-3 rounded text-center col-span-2">
          MARCA
        </div>
        <div className="bg-[#AF52DE] text-white font-mono text-xs font-medium py-2 px-3 rounded text-center">
          AUDIENCIA & COMUNIDADES
        </div>
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-xs font-medium py-2 px-3 rounded text-center">
          SEO
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-[#FF3B30] text-white font-mono text-xs font-medium py-2 px-3 rounded text-center">
          PRODUCTOS DIGITALES
        </div>
        <div className="bg-[#FFCC00] text-[#0a0612] font-mono text-xs font-medium py-2 px-3 rounded text-center">
          ANALÍTICA & OPTIMIZACIÓN
        </div>
        <div className="bg-[#FF3B30] text-white font-mono text-xs font-medium py-2 px-3 rounded text-center">
          CONTENIDO
        </div>
      </div>

      {/* Tercera fila */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#007AFF] text-white font-mono text-xs font-medium py-2 px-3 rounded text-center">
          FUNNELS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-xs font-medium py-2 px-3 rounded text-center">
          PRODUCTIVIDAD & MINDSET
        </div>
        <div className="bg-[#007AFF] text-white font-mono text-xs font-medium py-2 px-3 rounded text-center">
          PUBLICIDAD ONLINE
        </div>
      </div>
    </div>
  )
}

