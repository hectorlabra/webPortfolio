import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { TypewriterText } from "@/components/shared/typewriter-text-client";
import { Heading } from "@/components/shared/Heading";
import { NewsletterInPost } from "@/components/blog/NewsletterInPost";
import { SocialProof } from "@/components/sections/home/social-proof";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { PostSidebarsClient } from "@/components/blog/PostSidebarsClient";
import { MobileTOCButton } from "@/components/blog/MobileTOCButton";

// Importar el contenido TSX directamente
import HojaDeRutaContent, {
  metadata as articleMetadata,
} from "@/content/articles/hoja-de-ruta";

// Table of Contents generado manualmente (ya que no hay MD parser)
const tableOfContents = [
  { id: "el-roadmap-completo", text: "El Roadmap Completo", level: 1 },
  {
    id: "como-construir-software",
    text: "Cómo Construir Software Que Genera Ingresos",
    level: 1,
  },
  { id: "la-problematica-real", text: "La Problemática Real", level: 1 },
  { id: "mi-historia", text: "Mi Historia", level: 1 },
  { id: "el-camino-y-la-estrella", text: "El Camino y La Estrella", level: 1 },
  { id: "tu-primer-paso", text: "Tu Primer Paso", level: 1 },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${articleMetadata.title} | Héctor Labra`,
    description: articleMetadata.description,
    openGraph: {
      title: `${articleMetadata.title} | Héctor Labra`,
      description: articleMetadata.description,
      url: "https://hectorlabra.dev/hoja-de-ruta",
    },
  };
}

export default function HojaDeRutaPage() {
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Sidebars - TOC only, no newsletter */}
      <PostSidebarsClient tableOfContents={tableOfContents} showNewsletter />

      {/* Mobile TOC Access */}
      <MobileTOCButton items={tableOfContents} />

      {/* Hero Section */}
      <section
        id="post-hero"
        className="relative w-full overflow-hidden pt-12 pb-6"
      >
        <LazyGeometricPattern priority opacity={0.25} />
        <div className="relative z-10 mx-auto max-w-[700px] px-4 sm:px-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">
                Hoja de ruta
              </p>
              <Heading
                level={1}
                className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1] tracking-[-0.025em]"
              >
                {articleMetadata.title}
              </Heading>
              <p className="text-lg text-white/70">
                <TypewriterText text="Combina IA, SEO y producto para dejar de depender solo de tu salario" />
              </p>
            </div>

            <p className="text-base text-white/70">
              Esta guía te acompaña desde la mentalidad emprendedora hasta la
              ejecución práctica (stack, métricas y monetización). Si tienes un
              empleo estable y quieres crear un segundo ingreso real, este es tu
              plan paso a paso.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90"
                asChild
              >
                <a href="mailto:hello@hectorlabra.dev">Agendar una llamada</a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white/80 hover:border-white hover:text-white"
              >
                Descargar resumen
              </Button>
            </div>
          </div>
        </div>
        {/* Sentinel for sidebar visibility */}
        <div id="post-hero-sentinel" className="absolute bottom-0 h-1 w-full" />
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-[700px] px-4 sm:px-6 pb-16 pt-0">
        <article id="post-article" className="font-reading">
          {/* Contenido TSX directo - sin dangerouslySetInnerHTML */}
          <HojaDeRutaContent />

          {/* Inline Newsletter solo mobile/tablet (desktop se muestra en sidebar) */}
          <div className="block xl:hidden my-10">
            <NewsletterInPost variant="compact" />
          </div>
        </article>

        {/* End sentinel for sidebar hide */}
        <div id="post-end-sentinel" className="h-1 w-full" />

        {/* CTA Section */}
        {/* CTA Newsletter prominente (desktop y mobile) */}
        <div id="post-cta-newsletter" className="mt-12">
          <NewsletterInPost variant="prominent" />
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-white">
          <Heading level={2} className="text-2xl text-white">
            ¿Listo para convertir tu tracción en ingresos recurrentes?
          </Heading>
          <p className="mt-3 text-base text-white/70">
            Apalanca este roadmap y trabaja con alguien que ha monetizado con
            tráfico orgánico, micro-SaaS y automatizaciones sin depender de una
            sola fuente de ingresos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="sm"
              className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90"
              asChild
            >
              <a href="mailto:hello@hectorlabra.dev">Escríbeme</a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-white/30 text-white/80 hover:bg-white/10"
            >
              Ver casos de estudio
            </Button>
          </div>
          <div className="mt-6">
            <SocialProof />
          </div>
        </div>
      </main>
    </div>
  );
}
