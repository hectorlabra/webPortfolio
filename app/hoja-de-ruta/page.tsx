import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { TypewriterText } from "@/components/shared/typewriter-text-client";
import { Heading } from "@/components/shared/Heading";
import { User, Calendar, Clock } from "lucide-react";
import { NewsletterInPost } from "@/components/blog/NewsletterInPost";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { PostSidebarsClient } from "@/components/blog/PostSidebarsClient";
import { MobileTOCButton } from "@/components/blog/MobileTOCButton";

// Importar el contenido TSX directamente
import HojaDeRutaContent, {
  metadata as articleMetadata,
} from "../../content/articles/hoja-de-ruta";

// Table of Contents (IDs deben coincidir con los <Heading id="..."> del artículo)
const tableOfContents = [
  { id: "mi-realidad", text: "Mi realidad", level: 1 },
  {
    id: "la-verdad-incomoda",
    text: "Verdad incómoda",
    level: 1,
  },
  { id: "stack-minimalista", text: "Stack (2 cosas)", level: 1 },
  { id: "filtro-de-turistas", text: "Filtro turistas", level: 1 },
  { id: "enemigo-moderno", text: "Trampa AI", level: 1 },
  { id: "mi-historia", text: "Mi historia", level: 1 },
  { id: "proceso-real", text: "Proceso (6 meses)", level: 1 },
  { id: "la-encrucijada", text: "Encrucijada", level: 1 },
  { id: "unete-al-circulo", text: "Círculo", level: 1 },
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

      {/* Wrapper consistente con PostLayout */}
      <div className="mx-auto w-full max-w-[700px]">
        <main className="flex-1">
          {/* Hero Section */}
          <section id="post-hero" className="relative pt-20 pb-6">
            {/* Geometric Pattern Background - Full width como en PostLayout */}
            <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <LazyGeometricPattern priority opacity={0.25} />
            </div>

            <div className="container flex-1 flex flex-col px-4 md:px-6 relative z-10">
              <div className="max-w-[700px] mx-auto w-full space-y-6">
                {/* Roadmap label */}
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">
                  Roadmap Anti-Hype
                </p>

                {/* Title */}
                <Heading
                  level={1}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-white font-mono"
                >
                  {articleMetadata.title}
                </Heading>

                {/* Typewriter description */}
                <p className="text-sm sm:text-lg text-white/70 leading-relaxed">
                  <TypewriterText text="Deja de estudiar tutoriales. Empieza a shippear activos." />
                </p>

                {/* Extended description */}
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  Esta no es otra guía de &quot;Hello World&quot;. Es el mapa
                  sucio y real para pasar de escribir código para otros a
                  construir tu propia libertad. Sin atajos mágicos, solo
                  ingeniería y pragmatismo.
                </p>

                {/* Meta info - igual que blog */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Héctor Labra</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={new Date().toISOString().split("T")[0]}>
                      {new Date().toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {articleMetadata.readingTimeMinutes
                        ? `${articleMetadata.readingTimeMinutes} min de lectura`
                        : "15 min de lectura"}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90"
                    asChild
                  >
                    <a href="#mi-realidad">Empezar a leer</a>
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
          </section>

          {/* Sentinel para control de sidebars - FUERA del hero, igual que PostLayout */}
          <div id="post-hero-sentinel" className="h-px w-full" />

          {/* Contenido principal - más espacio arriba para separar del hero */}
          <section className="w-full pt-16 pb-12">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="max-w-[700px] mx-auto w-full space-y-6">
                <article
                  id="post-article"
                  className="min-w-0 w-full font-reading"
                >
                  <div className="blog-richtext">
                    {/* Contenido TSX directo */}
                    <HojaDeRutaContent />

                    {/* Inline Newsletter solo mobile/tablet */}
                    <div className="block xl:hidden my-10">
                      <NewsletterInPost variant="compact" />
                    </div>
                  </div>

                  {/* CTA Newsletter prominente */}
                  <div id="post-cta-newsletter" className="mt-12 font-sans">
                    <NewsletterInPost variant="prominent" />
                  </div>
                </article>

                {/* End sentinel */}
                <div id="post-end-sentinel" className="h-px w-full" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
