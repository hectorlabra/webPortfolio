// Quien-soy specific loading skeleton
export default function QuienSoyLoading() {
  return (
    <div className="w-full max-w-[700px] mx-auto">
      <main className="flex-1">
        {/* Hero skeleton */}
        <section className="w-full min-h-[70vh] flex items-center py-12">
          <div className="container px-4 md:px-6 w-full">
            <div className="animate-pulse flex flex-col items-center space-y-6">
              {/* Avatar skeleton */}
              <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-[#64E365]/30" />

              {/* Name skeleton */}
              <div className="h-10 w-64 bg-white/10 rounded" />

              {/* Description skeleton */}
              <div className="space-y-2 w-full max-w-md">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-3/4 mx-auto bg-white/10 rounded" />
              </div>

              {/* GitHub graph skeleton */}
              <div className="w-full h-32 bg-white/5 border border-white/10 rounded-lg" />

              {/* Social buttons skeleton */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content skeleton */}
        <section className="w-full py-24">
          <div className="container px-4 md:px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-40 bg-white/10 rounded" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-full bg-white/10 rounded" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
