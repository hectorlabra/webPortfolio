import { getAllPosts, getBlogMetadata } from "@/lib/blog-utils";
import { generateBlogStructuredData } from "@/lib/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/shared/geometric-pattern";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

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
  const metadata = await getBlogMetadata();
  const structuredData = generateBlogStructuredData();

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
          {/* Hero Section */}
          <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
            <div className="container flex-1 flex flex-col px-4 md:px-6 relative z-10">
              {/* Header */}
              <div className="space-y-6 mb-12">
                <div className="space-y-3">
                  <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-accent-green">
                    Blog
                  </h1>
                  <p className="text-base sm:text-lg text-white/70 max-w-2xl">
                    Artículos sobre desarrollo, tecnología y experiencias en el
                    mundo del software. Tutoriales, guías prácticas y
                    reflexiones sobre programación. 📚
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-white/60 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent-green"></div>
                    <span>{metadata.totalPosts} artículos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent-yellow"></div>
                    <span>{metadata.categories.length} categorías</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent-green"></div>
                    <span>{metadata.tags.length} tags</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern */}
          <GeometricPattern />

          {/* Posts destacados */}
          {metadata.featuredPosts.length > 0 && (
            <section className="w-full py-16 sm:py-24 md:py-36">
              <div className="container flex-1 flex flex-col px-4 md:px-6">
                <div className="flex flex-col items-start space-y-5 mb-12">
                  <div className="space-y-3">
                    <h2 className="font-mono text-3xl font-bold tracking-tighter text-accent-green">
                      Artículos destacados
                    </h2>
                    <p className="text-lg text-white/70">
                      Las historias más relevantes para tu desarrollo
                      profesional.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metadata.featuredPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <div className="group relative h-full rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:translate-y-[-4px] overflow-hidden shadow-sm hover:shadow-[0_0_10px_rgba(100,227,101,0.2)] cursor-pointer">
                        {/* Content */}
                        <div className="p-5 sm:p-6 h-full flex flex-col">
                          {/* Badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <Badge
                              variant="outline"
                              className="text-xs bg-accent-green/20 text-accent-green border-accent-green/50 hover:bg-accent-green/30"
                            >
                              {post.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50 font-semibold"
                            >
                              Destacado
                            </Badge>
                          </div>

                          {/* Title */}
                          <h3 className="font-mono text-lg sm:text-xl font-bold text-white group-hover:text-accent-green transition-colors line-clamp-2 mb-3">
                            {post.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-white/70 line-clamp-3 mb-4 flex-grow">
                            {post.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 mb-4 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readingTime} min</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white/90"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/5 text-white/70 border-white/10"
                                >
                                  +{post.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Geometric Pattern */}
          <GeometricPattern />

          {/* Todos los posts */}
          <section className="w-full py-16 sm:py-24 md:py-36">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5 mb-12">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter text-accent-green">
                    {metadata.featuredPosts.length > 0
                      ? "Todos los artículos"
                      : "Artículos recientes"}
                  </h2>
                  <p className="text-lg text-white/70">
                    Explora todos los artículos del blog.
                  </p>
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <div className="group relative rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] overflow-hidden shadow-sm hover:shadow-[0_0_10px_rgba(100,227,101,0.2)] cursor-pointer">
                        {/* Content */}
                        <div className="p-5 sm:p-6">
                          {/* Badges y metadata header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-accent-green/20 text-accent-green border-accent-green/50 hover:bg-accent-green/30"
                              >
                                {post.category}
                              </Badge>
                              {post.featured && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50 font-semibold"
                                >
                                  Destacado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readingTime} min de lectura</span>
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-mono text-lg sm:text-2xl font-bold text-white group-hover:text-accent-green transition-colors mb-3">
                            {post.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm sm:text-base text-white/70 mb-4">
                            {post.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60 mb-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white/90"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="mt-4 flex items-center gap-2 text-accent-green font-medium text-sm group-hover:gap-3 transition-all">
                            <span>Leer artículo</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-lg text-white/70 font-medium">
                    No hay artículos publicados aún.
                  </p>
                  <p className="text-sm text-white/50 mt-2">
                    ¡Mantente atento para nuevos contenidos! 👀
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Geometric Pattern */}
          <GeometricPattern />

          {/* CTA Section */}
          <section className="w-full py-16 sm:py-24 md:py-36">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="rounded-lg border border-white/15 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur p-8 sm:p-12 text-center">
                <h2 className="font-mono text-2xl sm:text-3xl font-bold text-accent-green mb-4">
                  ¿Quieres aprender más?
                </h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">
                  Únete a la comunidad y recibe las últimas novedades sobre
                  desarrollo, tecnología y IA.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    className="w-full sm:w-auto bg-accent-green text-dark hover:bg-accent-green/90 font-bold shadow-[0_0_10px_rgba(100,227,101,0.5),0_0_15px_rgba(100,227,101,0.3)]"
                    asChild
                  >
                    <Link href="/">Explorar más</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-bold"
                    asChild
                  >
                    <Link href="/quien-soy">Conocerme</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
