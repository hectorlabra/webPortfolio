interface LegoBlocksProps {
  fullWidth?: boolean;
}

export function LegoBlocks({ fullWidth = false }: LegoBlocksProps) {
  return (
    <div className={`w-full ${fullWidth ? '' : 'max-w-3xl mx-auto'}`}>
      {/* Primera fila */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          NICHOS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-4 px-3 rounded-sm text-center col-span-1">
          MARCA
        </div>
        <div className="bg-[rgb(97,69,235)] text-white font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          AUDIENCIA & COMUNIDADES
        </div>
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          SEO
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-[#FF3B30] text-white font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          PRODUCTOS DIGITALES
        </div>
        <div className="bg-[#FFCC00] text-[#0a0612] font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          ANALÍTICA & OPTIMIZACIÓN
        </div>
        <div className="bg-[#FF3B30] text-white font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          CONTENIDO
        </div>
      </div>

      {/* Tercera fila */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#007AFF] text-white font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          FUNNELS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          PRODUCTIVIDAD & MINDSET
        </div>
        <div className="bg-[#007AFF] text-white font-mono text-sm font-medium py-4 px-3 rounded-sm text-center">
          PUBLICIDAD ONLINE
        </div>
      </div>
    </div>
  )
}

