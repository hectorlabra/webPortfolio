// Server Component - Main home page
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import dynamic from "next/dynamic";

// Server Components - Static markup
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LegoBlocks } from "@/components/sections/home/lego-blocks";
import { SocialProof } from "@/components/sections/home/social-proof";

// Client Islands - Interactive components only
import { NewsletterForm } from "@/components/sections/home/newsletter-form-client";
import { LazyGeometricPattern } from "@/components/shared/geometric-pattern-client";
import { TypewriterText } from "@/components/shared/typewriter-text-client";

// Lazy load FAQ - below the fold (with loading state)
const FaqAccordion = dynamic(
  () =>
    import("@/components/sections/home/faq-accordion-client").then(
      (mod) => mod.FaqAccordion
    ),
  {
    loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-lg" />,
  }
);

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <main className="flex-1">
        {/* Hero Section - Mantener como referencia */}
        <section className="w-full min-h-[55vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center py-4 sm:py-6 md:py-4 lg:pt-0 lg:pb-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#0a0612] to-[#0a0612]/90 pointer-events-none"></div>
          <div className="container flex-1 flex flex-col justify-center px-4 md:px-6 pt-3 pb-6 sm:pt-0 sm:pb-0 relative z-10">
            {/* Social Proof Component */}
            <SocialProof />
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[60fr_40fr] lg:gap-16 mt-6 lg:mt-6">
              {/* Hero Content */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="font-mono text-[1.2rem] sm:text-lg md:text-xl lg:text-3xl font-bold tracking-tighter whitespace-nowrap">
                    De dev anónimo
                    <TypewriterText text=" → dev moderno." />
                  </h1>
                  <p className="text-base sm:text-lg text-white/70">
                    Actualiza tu stack, construye proyectos reales, publica tu
                    proceso y usa SEO práctico para atraer oportunidades
                    mientras avanzas.
                  </p>
                </div>
                {/* Highlight Banner */}
                <div className="inline-flex w-fit rounded-md bg-[#64E365]/20 px-4 py-3 text-base sm:px-5 sm:py-4 sm:text-lg md:px-6 md:text-xl text-[#64E365] font-medium border border-[#64E365]/30 shadow-[0_0_8px_rgba(100,227,101,0.2)] gap-4">
                  Construir → Publicar → Atraer
                </div>
                {/* Features List */}
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-3">
                    <Check className="h-8 w-6 sm:h-6 sm:w-6 text-[#64E365]" />
                    <span className="text-sm sm:text-base">
                      Construye con stack moderno (Next.js).
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-3">
                    <Check className="h-8 w-6 sm:h-6 sm:w-6 text-[#64E365]" />
                    <span className="text-sm sm:text-base">
                      Comparte lo que aprendes (LinkedIn).
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-3">
                    <Check className="h-8 w-6 sm:h-6 sm:w-6 text-[#64E365]" />
                    <span className="text-sm sm:text-base">
                      Atrae oportunidades con SEO (blog & free-tools).
                    </span>
                  </div>
                </div>
              </div>
              {/* Newsletter Signup */}
              <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0 mb-6 sm:mb-0">
                <div className="rounded-lg border-2 border-white/20 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur w-full animate-circular-glow shadow-sm shadow-white/5">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="font-mono text-lg sm:text-xl lg:text-[1.2rem] font-bold text-center">
                      Aprende a construir → publicar → atraer
                    </h2>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    {/* Newsletter Form Component */}
                    <NewsletterForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geometric Pattern - Priority (always visible in hero) */}
        <LazyGeometricPattern priority={true} />

        {/* Features Section - Con espaciado responsive */}
        <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="flex flex-col items-start space-y-5">
              <div className="space-y-3">
                <h2 className="font-mono text-3xl font-bold tracking-tighter">
                  Enseñamos el enfoque completo.
                </h2>
                <p className="text-lg text-white/70">
                  Todo lo que necesitas para construir tu carrera de developer,
                  incluso si eres un principiante absoluto. ✨
                </p>
              </div>
            </div>
            <div className="py-12">
              {/* LegoBlocks Component */}
              <LegoBlocks fullWidth={true} />
            </div>
            <div className="flex justify-start">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                  EMPIEZA AHORA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Social Proof Component */}
                <div className="self-center sm:self-auto">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geometric Pattern - Lazy loaded (pauses when off-screen) */}
        <LazyGeometricPattern />

        {/* Blog Section - Con espaciado responsive */}
        <section className="w-full py-16 sm:py-24 md:py-36 lg:py-52">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="flex flex-col items-start space-y-5">
              <div className="space-y-3">
                <h2 className="font-mono text-3xl font-bold tracking-tighter">
                  Últimos artículos
                </h2>
                <p className="text-lg text-white/70">
                  Construyendo tu carrera tech paso a paso con guías prácticas y
                  bloques de aprendizaje. 💻
                </p>
              </div>
            </div>
            <div className="py-12">
              {" "}
              {/* Contenedor con el mismo py-12 que Features */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden bg-white/5 border-white/15 transition-all hover:bg-white/8 hover:border-white/20 hover:translate-y-[-4px] shadow-lg shadow-purple-500/5"
                  >
                    <div className="aspect-[5/4] w-full overflow-hidden bg-white/5 relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                        alt={`Article ${i}`}
                        width={400}
                        height={300}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover w-full h-full transition-all hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 inline-block rounded-md bg-[#FFD100] px-3 py-1 text-xs font-medium text-[#0a0612]">
                        Categoría
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex justify-end items-center">
                        <p className="text-xs text-white/80">28 Mar</p>
                      </div>
                      <h3 className="mt-1 font-mono text-lg font-bold line-clamp-1 text-white">
                        Título del artículo
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">
                        Una breve descripción del artículo y lo que los lectores
                        pueden esperar aprender.
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-white/15 ring-1 ring-white/20 overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=28&width=28"
                            alt="Avatar"
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                        </div>
                        <p className="text-xs font-medium text-white/90">
                          Hector Labra
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs text-[#64E365] hover:text-[#64E365]/80 font-medium"
                        >
                          Leer artículo <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                  EMPIEZA AHORA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Social Proof Component */}
                <div className="self-center sm:self-auto">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geometric Pattern - Lazy loaded (pauses when off-screen) */}
        <LazyGeometricPattern />

        {/* FAQ Section - Con espaciado responsive */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="flex flex-col items-start space-y-5">
              <div className="space-y-3">
                <h2 className="font-mono text-3xl font-bold tracking-tighter">
                  Preguntas frecuentes.
                </h2>
                <p className="text-lg text-white/70">
                  Despeja tus dudas sobre carreras tech en tiempos de IA. 🚀
                </p>
              </div>
            </div>
            <div className="py-12">
              {" "}
              {/* Mismo espaciado que Features */}
              <FaqAccordion />
            </div>
            <div className="flex justify-start">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                  EMPIEZA AHORA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Social Proof Component */}
                <div className="self-center sm:self-auto">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
