import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { TypewriterText } from "@/components/shared/typewriter-text-client";
import { Heading } from "@/components/shared/Heading";
import { NewsletterInPost } from "@/components/blog/NewsletterInPost";
import { SocialProof } from "@/components/sections/home/social-proof";
import { extractTableOfContents, markdownToHtml } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Hoja de Ruta | Héctor Labra",
  description:
    "Hoja de ruta práctica para construir un micro-SaaS rentable desde tu empleo estable usando IA, SEO y producto ágil.",
  openGraph: {
    title: "Hoja de Ruta | Héctor Labra",
    description:
      "Descubre el sistema completo para construir tu primer micro-SaaS rentable en 4-8 semanas con IA y SEO.",
    url: "https://hectorlabra.dev/hoja-de-ruta",
  },
};

type TocHeading = {
  id: string;
  text: string;
  level: number;
};

const indentationClasses = ["pl-0", "pl-3", "pl-5", "pl-7", "pl-9"];

function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (!headings.length) return null;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/70">
      <Heading level={3} className="text-base text-white">
        Contenido
      </Heading>
      <ul className="mt-4 space-y-2">
        {headings.map((heading) => {
          const indent =
            indentationClasses[
              Math.min(
                Math.max(heading.level - 1, 0),
                indentationClasses.length - 1
              )
            ];
          return (
            <li key={heading.id} className={`${indent}`}>
              <a
                href={`#${heading.id}`}
                className="transition-colors hover:text-white"
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function HojaDeRutaPage() {
  const markdownPath = path.join(
    process.cwd(),
    "content",
    "pages",
    "hoja-de-ruta.md"
  );
  const markdown = await fs.readFile(markdownPath, "utf8");
  const html = await markdownToHtml(markdown, {
    title: "Cómo Construir Tu Primer SaaS Rentable en 4-8 Semanas",
    slug: "hoja-de-ruta",
  });
  const toc = extractTableOfContents(markdown);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-16 pt-10">
      <main className="flex flex-col gap-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0c0816] to-[#080510]/80 p-8 sm:p-10 shadow-[0_25px_80px_rgba(2,1,6,0.8)]">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">
                Hoja de ruta
              </p>
              <Heading
                level={1}
                className="text-[2.3rem] sm:text-[2.75rem] lg:text-[3.3rem]"
              >
                Construye tu micro-SaaS rentable en 4-8 semanas
              </Heading>
              <p className="text-lg text-white/70">
                <TypewriterText
                  text={
                    "Combina IA, SEO y producto para dejar de depender solo de tu salario"
                  }
                />
              </p>
            </div>

            <p className="text-base text-white/70 max-w-3xl">
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
        </section>

        <LazyGeometricPattern priority opacity={0.25} />

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <TableOfContents headings={toc} />
          <div className="space-y-6">
            <article
              className="prose prose-invert max-w-none space-y-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <NewsletterInPost variant="prominent" />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
              <Heading level={2} className="text-2xl text-white">
                ¿Listo para convertir tu tracción en ingresos recurrentes?
              </Heading>
              <p className="mt-3 text-sm text-white/70">
                Apalanca este roadmap y trabaja con alguien que ha monetizado
                con tráfico orgánico, micro-SaaS y automatizaciones sin depender
                de una sola fuente de ingresos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="bg-[#64E365] text-[#0a0612]"
                  asChild
                >
                  <a href="mailto:hello@hectorlabra.dev">Escríbeme</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-white/30 text-white/80"
                >
                  Ver casos de estudio
                </Button>
              </div>
              <div className="mt-6">
                <SocialProof />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
