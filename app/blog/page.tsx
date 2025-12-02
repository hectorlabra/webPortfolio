import { getAllPosts, getBlogMetadata } from "@/lib/blog-utils";
import { generateBlogStructuredData } from "@/lib/structured-data";
import { NewsletterSection } from "./BlogClient";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyGeometricPattern } from "@/components/shared/geometric-pattern-client";
import { BlogCard } from "@/components/blog/BlogCard";
import { Heading } from "@/components/shared/Heading";

export const metadata: Metadata = {
  title: "Blog | Héctor Labra - Desarrollador Full Stack",
  description:
    "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software. Tutoriales de React, Next.js, TypeScript y más.",
  keywords: [
    "blog",
    "desarrollo",
    "programación",
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "web development",
  ],
  openGraph: {
    title: "Blog de Héctor Labra",
    description:
      "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.",
    type: "website",
    url: "https://hectorlabra.dev/blog",
    siteName: "Héctor Labra - Desarrollador Full Stack",
    locale: "es_ES",
    images: [
      {
        url: "https://hectorlabra.dev/og-image-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog de Héctor Labra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Héctor Labra",
    description:
      "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.",
    images: ["https://hectorlabra.dev/og-image-blog.jpg"],
    creator: "@hectorlabra",
    site: "@hectorlabra",
  },
  alternates: {
    canonical: "https://hectorlabra.dev/blog",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Blog RSS Feed" }],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const blogMetadata = await getBlogMetadata();
  const structuredData = generateBlogStructuredData();

  // Category icons mapping
  const categoryIcons: { [key: string]: string } = {
    Tutoriales: "📘",
    "IA & Automatización": "⚡",
    React: "⚛️",
    "Next.js": "▲",
    TypeScript: "🎯",
    General: "💻",
  };

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="w-full max-w-[1000px] mx-auto">
        <main className="flex-1">
          {/* Hero Section - Blog */}
          <section className="w-full min-h-[55vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center py-4 sm:py-6 md:py-4 lg:pt-0 lg:pb-0 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#0a0612] to-[#0a0612]/90 pointer-events-none"></div>
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6 pt-3 pb-6 sm:pt-0 sm:pb-0 relative z-10">
              {/* Stats compactos arriba */}
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-white/60 mb-6 lg:mb-8">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#64E365] font-mono font-bold">
                    {blogMetadata.totalPosts}
                  </span>
                  artículos
                </span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#64E365] font-mono font-bold">
                    {blogMetadata.categories.length}
                  </span>
                  categorías
                </span>
                <span className="text-white/30">•</span>
                <span>Actualizado semanalmente</span>
              </div>

              <div className="grid gap-6 sm:gap-8 lg:grid-cols-[60fr_40fr] lg:gap-16">
                {/* Hero Content */}
                <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <Heading
                      level={1}
                      className="text-[1.7rem] sm:text-3xl md:text-4xl tracking-tighter"
                    >
                      Aprende desarrollo moderno.
                    </Heading>
                    <p className="text-base sm:text-lg text-white/70 max-w-xl">
                      Tutoriales prácticos de Next.js, React, TypeScript y IA
                      que puedes aplicar hoy mismo. Sin teoría innecesaria.
                    </p>
                  </div>

                  {/* Grid de categorías principales */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                    {blogMetadata.categories.slice(0, 4).map((category) => {
                      const categoryPosts = posts.filter(
                        (p) => p.category === category
                      );
                      const icon = categoryIcons[category] || "📚";

                      return (
                        <div
                          key={category}
                          className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-[#64E365]/30 transition-all duration-300 p-2.5 sm:p-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base sm:text-lg">{icon}</span>
                            <h3 className="font-mono text-[0.7rem] sm:text-xs font-bold text-white group-hover:text-[#64E365] transition-colors">
                              {category}
                            </h3>
                          </div>
                          <p className="text-[0.65rem] sm:text-[0.7rem] text-white/50">
                            {categoryPosts.length}{" "}
                            {categoryPosts.length === 1
                              ? "artículo"
                              : "artículos"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter Signup - Client Island */}
                <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0 mb-6 sm:mb-0">
                  <NewsletterSection title="¡Únete con un click!" />
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern - Lazy loaded separator */}
          <LazyGeometricPattern />

          {/* Últimos Artículos */}
          <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <Heading level={2} className="text-3xl tracking-tighter">
                    Últimos artículos
                  </Heading>
                  <p className="text-lg text-white/70">
                    Construyendo tu carrera tech paso a paso con guías prácticas
                    y bloques de aprendizaje. 💻
                  </p>
                </div>
              </div>
              <div className="py-12">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern removed - Using only 1 instance in home for better performance */}

          {/* CTA de Conversión Final */}
          <section className="w-full py-16 sm:py-24 md:py-36">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="rounded-lg border-2 border-white/20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur p-8 sm:p-12 text-center max-w-3xl mx-auto">
                <Heading level={2} className="text-2xl sm:text-3xl mb-4">
                  ¿Te gustó lo que leíste?
                </Heading>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">
                  Recibe nuevos artículos cada semana directamente en tu inbox.
                  Sin spam, solo contenido de valor. 📬
                </p>

                {/* Newsletter Form - Client Island */}
                <NewsletterSection title="" compact />

                {/* Secondary CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 border-t border-white/10 mt-6">
                  <span className="text-sm text-white/50">O explora más:</span>
                  <div className="flex gap-3">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-[#64E365] hover:text-[#64E365]/80 font-medium"
                      asChild
                    >
                      <Link href="/">
                        Inicio <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                    <span className="text-white/30">•</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-[#64E365] hover:text-[#64E365]/80 font-medium"
                      asChild
                    >
                      <Link href="/hoja-de-ruta">
                        Hoja de Ruta <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
