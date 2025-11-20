// Server Component - Static social proof display
export function SocialProof() {
  return (
    <div className="flex items-center gap-2">
        <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FFD24C"
            className="w-4 h-4"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
        <span className="text-white/80 text-[0.65rem] sm:text-xs flex items-center leading-none translate-y-[1px]">
          1,145+ <span className="underline ml-1">devs hispanos</span>
          <span className="ml-2">actualizando su carrera</span>
        </span>
    </div>
  );
}
