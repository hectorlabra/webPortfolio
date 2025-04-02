interface LegoBlocksProps {
  fullWidth?: boolean;
}

export function LegoBlocks({ fullWidth = false }: LegoBlocksProps) {
  return (
    <div className={`w-full ${fullWidth ? '' : 'max-w-3xl mx-auto'}`}>
      {/* Primera fila */}
      <div className="grid grid-cols-12 gap-2 mb-2">
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-2">
          NICHOS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-3">
          MARCA
        </div>
        <div className="bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-4">
          AUDIENCIA & COMUNIDADES
        </div>
        <div className="bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-3">
          SEO
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-12 gap-2 mb-2">
        <div className="bg-[#FF3B30] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-3">
          PRODUCTOS DIGITALES
        </div>
        <div className="bg-[#FFCC00] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-5">
          ANALÍTICA & OPTIMIZACIÓN
        </div>
        <div className="bg-[#FF3B30] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-4">
          CONTENIDO
        </div>
      </div>

      {/* Tercera fila */}
      <div className="grid grid-cols-12 gap-2">
        <div className="bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-4">
          FUNNELS
        </div>
        <div className="bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-5">
          PRODUCTIVIDAD & MINDSET
        </div>
        <div className="bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-3">
          PUBLICIDAD ONLINE
        </div>
      </div>
    </div>
  )
}

