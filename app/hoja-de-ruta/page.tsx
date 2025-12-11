import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { TypewriterText } from "@/components/shared/typewriter-text-client";
import { Heading } from "@/components/shared/Heading";
import { NewsletterInPost } from "@/components/blog/NewsletterInPost";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { PostSidebarsClient } from "@/components/blog/PostSidebarsClient";
import { MobileTOCButton } from "@/components/blog/MobileTOCButton";

// Importar el contenido TSX directamente
import HojaDeRutaContent, {
  metadata as articleMetadata,
} from "../../content/articles/hoja-de-ruta";

// Table of Contents actualizado con los nuevos IDs del artículo
const tableOfContents = [
  { id: "la-verdad-incomoda", text: "La Verdad Incómoda", level: 1 },
  { id: "la-realidad", text: "Parte 1: La Realidad", level: 1 },
  { id: "el-enemigo-moderno", text: "Parte 2: La Trampa AI", level: 1 },
  { id: "mi-historia", text: "Parte 3: Mi Historia", level: 1 },
  { id: "el-stack", text: "Parte 4: El Stack del Builder", level: 1 },
  {
    id: "conclusion-encrucijada",
    text: "Conclusión: Tu Encrucijada",
    level: 1,
  },
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
    <div
      className="min-h-screen bg-[#0a0612] text-white"
      style={{ scrollBehavior: "smooth" }}
    >
      <style>{`
        html {
          scroll-behavior: smooth !important;
          scroll-padding-top: 80px;
        }
      `}</style>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Sidebars - TOC only, no newsletter */}
      <PostSidebarsClient tableOfContents={tableOfContents} showNewsletter />

      {/* Mobile TOC Access */}
      <MobileTOCButton items={tableOfContents} />

      {/* Hero Section */}
      <section
        id="post-hero"
        className="relative w-full overflow-hidden pt-20 pb-6"
      >
        <LazyGeometricPattern priority opacity={0.25} />
        <div className="relative z-10 mx-auto max-w-[700px] px-4 sm:px-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">
                Roadmap Anti-Hype
              </p>
              <Heading
                level={1}
                className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1] tracking-[-0.025em]"
              >
                {articleMetadata.title}
              </Heading>
              <p className="text-lg text-white/70">
                <TypewriterText text="Deja de estudiar tutoriales. Empieza a shippear activos." />
              </p>
            </div>

            <p className="text-base text-white/70">
              Esta no es otra guía de "Hello World". Es el mapa sucio y real
              para pasar de escribir código para otros a construir tu propia
              libertad. Sin atajos mágicos, solo ingeniería y pragmatismo.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90"
                asChild
              >
                <a href="#la-verdad-incomoda">Empezar a leer</a>
              </Button>
              <Button
                size="sm"
                className="bg-accent-yellow text-[#0a0612] hover:bg-accent-yellow/90"
                asChild
              >
                <a href="#post-cta-newsletter">Suscribirse al Círculo</a>
              </Button>
            </div>
          </div>
        </div>
        {/* Sentinel for sidebar visibility */}
        <div id="post-hero-sentinel" className="absolute bottom-0 h-1 w-full" />
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-[700px] px-4 sm:px-6 pb-16 pt-0 lg:pt-32">
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
      </main>
    </div>
  );
}
