interface LegoBlocksProps {
  fullWidth?: boolean;
}

// Server Component - No client-side interactivity needed
export function LegoBlocks({ fullWidth = false }: LegoBlocksProps) {
  // Texts to display
  const texts = [
    "STACK",
    "IA",
    "PROYECTOS",
    "PLANTILLAS",
    "BLOG",
    "SEO",
    "LINKEDIN",
    "NEWSLETTER",
    "MONETIZAR",
    "AUTORIDAD",
  ];

  // Define the slots in the original DOM order, keeping all classNames/styles intact.
  const slots = [
    // Primera fila
    {
      className:
        "bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-1 sm:col-span-1 md:col-span-2 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(255,209,0,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-1 sm:col-span-2 md:col-span-3 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(76,217,100,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-2 sm:col-span-2 md:col-span-4 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(0,122,255,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#FFD100] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-2 sm:col-span-1 md:col-span-3 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(255,209,0,0.3)]",
      text: "",
    },

    // Segunda fila
    {
      className:
        "bg-[#FF3B30] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-1 sm:col-span-2 md:col-span-3 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(255,59,48,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#FFCC00] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-1 sm:col-span-2 md:col-span-5 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(255,204,0,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#FF3B30] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-2 sm:col-span-2 md:col-span-4 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(255,59,48,0.3)]",
      text: "",
    },

    // Tercera fila
    {
      className:
        "bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-4 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(0,122,255,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#4CD964] text-[#0a0612] font-mono text-sm font-medium py-5 px-3 text-center col-span-1 sm:col-span-2 md:col-span-5 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(76,217,100,0.3)]",
      text: "",
    },
    {
      className:
        "bg-[#007AFF] text-white font-mono text-sm font-medium py-5 px-3 text-center col-span-2 sm:col-span-2 md:col-span-3 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-[0_0_15px_rgba(0,122,255,0.3)]",
      text: "",
    },
  ];

  // Helper to extract md:col-span-X number from className
  const getMdSpan = (c: string) => {
    const m = c.match(/md:col-span-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  // Sort texts by length (shorter first)
  const sortedTexts = [...texts].sort((a, b) => a.length - b.length);

  // Sort slots by their md span (smallest first) to map shorter texts to smaller slots
  const slotsBySize = [...slots].sort(
    (a, b) => getMdSpan(a.className) - getMdSpan(b.className)
  );

  // Assign texts to slots by size
  for (let i = 0; i < slotsBySize.length; i++) {
    slotsBySize[i].text = sortedTexts[i] ?? "";
  }

  // Create a map from className to assigned text so we can render in original order
  const assigned = new Map<string, string>();
  for (const s of slotsBySize) assigned.set(s.className, s.text);

  return (
    <div className={`w-full ${fullWidth ? "" : "max-w-3xl mx-auto"}`}>
      {/* Primera fila */}
      <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-2">
        <div className={slots[0].className}>
          {assigned.get(slots[0].className)}
        </div>
        <div className={slots[1].className}>
          {assigned.get(slots[1].className)}
        </div>
        <div className={slots[2].className}>
          {assigned.get(slots[2].className)}
        </div>
        <div className={slots[3].className}>
          {assigned.get(slots[3].className)}
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-2">
        <div className={slots[4].className}>
          {assigned.get(slots[4].className)}
        </div>
        <div className={slots[5].className}>
          {assigned.get(slots[5].className)}
        </div>
        <div className={slots[6].className}>
          {assigned.get(slots[6].className)}
        </div>
      </div>

      {/* Tercera fila */}
      <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-12 gap-2">
        <div className={slots[7].className}>
          {assigned.get(slots[7].className)}
        </div>
        <div className={slots[8].className}>
          {assigned.get(slots[8].className)}
        </div>
        <div className={slots[9].className}>
          {assigned.get(slots[9].className)}
        </div>
      </div>
    </div>
  );
}
