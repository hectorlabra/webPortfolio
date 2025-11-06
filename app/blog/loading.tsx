// Blog-specific loading skeleton
export default function BlogLoading() {
  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <main className="flex-1">
        {/* Hero skeleton */}
        <section className="w-full min-h-[70vh] flex items-center py-8">
          <div className="container px-4 md:px-6 w-full">
            <div className="animate-pulse space-y-8">
              {/* Stats skeleton */}
              <div className="flex gap-3">
                <div className="h-4 w-20 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>

              <div className="grid gap-8 lg:grid-cols-[60fr_40fr]">
                {/* Content skeleton */}
                <div className="space-y-6">
                  <div className="h-10 w-3/4 bg-white/10 rounded" />
                  <div className="h-6 w-full bg-white/10 rounded" />

                  {/* Categories grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-white/5 border border-white/10 rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Newsletter skeleton */}
                <div className="h-64 bg-white/5 border-2 border-white/20 rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Articles skeleton */}
        <section className="w-full py-24">
          <div className="container px-4 md:px-6">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-white/10 rounded mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-96 bg-white/5 border border-white/15 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
