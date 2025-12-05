import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import matter from "gray-matter";

import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { TypewriterText } from "@/components/shared/typewriter-text-client";
import { Heading } from "@/components/shared/Heading";
import { NewsletterInPost } from "@/components/blog/NewsletterInPost";
import { SocialProof } from "@/components/sections/home/social-proof";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { PostSidebarsClient } from "@/components/blog/PostSidebarsClient";
import { MobileTOCButton } from "@/components/blog/MobileTOCButton";
import { markdownToHtml } from "@/lib/markdown";
import { buildTableOfContents, splitHtmlAfterSecondH2 } from "@/lib/blog-utils";

const PAGE_PATH = path.join(process.cwd(), "content/pages/hoja-de-ruta.md");

export async function generateMetadata(): Promise<Metadata> {
  // Read the markdown and derive the canonical title if present
  const fileContents = fs.readFileSync(PAGE_PATH, "utf8");
  const { data, content } = matter(fileContents);
  const tocHeadings = buildTableOfContents(content);
  const firstHeading =
    tocHeadings && tocHeadings.length > 0 ? tocHeadings[0] : null;
  const canonicalTitle = firstHeading
    ? firstHeading.level === 0 || firstHeading.level === 1
      ? firstHeading.text
      : data.title
    : data.title || "Hoja de ruta";

  return {
    title: `${canonicalTitle} | Héctor Labra`,
    description:
      data.description ||
      "Hoja de ruta práctica para construir un micro-SaaS rentable desde tu empleo estable usando IA, SEO y producto ágil.",
    openGraph: {
      title: `${canonicalTitle} | Héctor Labra`,
      description:
        data.description ||
        "Descubre el sistema completo para construir tu primer micro-SaaS rentable en 4-8 semanas con IA y SEO.",
      url: "https://hectorlabra.dev/hoja-de-ruta",
    },
  };
}

export default async function HojaDeRutaPage() {
  if (!fs.existsSync(PAGE_PATH)) {
    return <div className="text-white p-10">Contenido no encontrado</div>;
  }

  const fileContents = fs.readFileSync(PAGE_PATH, "utf8");
  const { data, content } = matter(fileContents);

  // Prefer markdown H1 as canonical title if present
  const tocHeadings = buildTableOfContents(content);
  const firstHeading =
    tocHeadings && tocHeadings.length > 0 ? tocHeadings[0] : null;
  const canonicalTitle = firstHeading
    ? firstHeading.level === 0 || firstHeading.level === 1
      ? firstHeading.text
      : data.title
    : data.title || "Hoja de ruta";

  const htmlContent = await markdownToHtml(content, {
    title: canonicalTitle,
    slug: "hoja-de-ruta",
  });

  const tableOfContents = buildTableOfContents(content, canonicalTitle);
  const { beforeHtml, afterHtml } = splitHtmlAfterSecondH2(htmlContent);

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Sidebars - TOC only, no newsletter */}
      <PostSidebarsClient
        tableOfContents={tableOfContents}
        showNewsletter={false}
      />

      {/* Mobile TOC Access */}
      <MobileTOCButton items={tableOfContents} />

      {/* Hero Section */}
      <section
        id="post-hero"
        className="relative w-full overflow-hidden py-16 sm:py-20"
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
                className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-tight"
              >
                {data.title ||
                  "Construye tu micro-SaaS rentable en 4-8 semanas"}
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
      <main className="relative z-10 mx-auto max-w-[700px] px-4 sm:px-6 pb-16">
        <article id="post-article" className="blog-richtext">
          {/* First part of content */}
          <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />

          {/* Inline Newsletter */}
          <div className="my-10">
            <NewsletterInPost variant="prominent" />
          </div>

          {/* Rest of content */}
          <div dangerouslySetInnerHTML={{ __html: afterHtml }} />
        </article>

        {/* End sentinel for sidebar hide */}
        <div id="post-end-sentinel" className="h-1 w-full" />

        {/* CTA Section */}
        <div
          id="post-cta-newsletter"
          className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-white"
        >
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
