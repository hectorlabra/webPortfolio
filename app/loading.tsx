// Global loading skeleton for all routes
export default function Loading() {
  return (
    <div className="w-full max-w-[1000px] mx-auto min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#64E365] rounded-full animate-spin" />
        
        {/* Loading text */}
        <p className="text-white/60 text-sm font-mono">Cargando...</p>
      </div>
    </div>
  );
}
