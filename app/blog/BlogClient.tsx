"use client";

import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/shared/geometric-pattern";
import { NewsletterForm } from "@/components/sections/home/newsletter-form";
import type { BlogPost, BlogMetadata } from "@/lib/types/blog";

interface BlogClientProps {
  posts: BlogPost[];
  metadata: BlogMetadata;
}

export function BlogClient({ posts, metadata }: BlogClientProps) {
  return (
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
                  {metadata.totalPosts}
                </span>
                artículos
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#64E365] font-mono font-bold">
                  {metadata.categories.length}
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
                  <h1 className="font-mono text-[2rem] sm:text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
                    Aprende desarrollo moderno.
                  </h1>
                  <p className="text-base sm:text-lg text-white/70 max-w-xl">
                    Tutoriales prácticos de Next.js, React, TypeScript y IA que
                    puedes aplicar hoy mismo. Sin teoría innecesaria.
                  </p>
                </div>

                {/* Grid de categorías principales */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                  {metadata.categories.slice(0, 4).map((category) => {
                    const categoryPosts = posts.filter(
                      (p) => p.category === category
                    );
                    const categoryIcons: { [key: string]: string } = {
                      Tutoriales: "📘",
                      "IA & Automatización": "⚡",
                      React: "⚛️",
                      "Next.js": "▲",
                      TypeScript: "🎯",
                      General: "💻",
                    };
                    const icon = categoryIcons[category] || "📚";

                    return (
                      <div
                        key={category}
                        className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-[#64E365]/30 transition-all duration-300 p-3 sm:p-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg sm:text-xl">{icon}</span>
                          <h3 className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-[#64E365] transition-colors">
                            {category}
                          </h3>
                        </div>
                        <p className="text-[0.7rem] sm:text-xs text-white/50">
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

              {/* Newsletter Signup */}
              <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0 mb-6 sm:mb-0">
                <div className="rounded-lg border-2 border-white/20 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur w-full animate-circular-glow shadow-sm shadow-white/5">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="font-mono text-xl sm:text-2xl lg:text-[1.4rem] font-bold text-center">
                      ¡Únete con un click!
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
                    Las historias más relevantes para tu desarrollo profesional.
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
                              {new Date(post.date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-accent-green hover:text-accent-green/80 font-medium self-start"
                        >
                          Leer artículo <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
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

        {/* Todos los artículos */}
        <section className="w-full py-16 sm:py-24 md:py-36">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="flex flex-col items-start space-y-5 mb-12">
              <div className="space-y-3">
                <h2 className="font-mono text-3xl font-bold tracking-tighter text-accent-green">
                  Todos los artículos
                </h2>
                <p className="text-lg text-white/70">
                  Explora todo el contenido disponible.
                </p>
              </div>

              {/* Filter Tags */}
              {metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-white/5 text-white/70 border-white/20 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group relative h-full rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:translate-y-[-4px] overflow-hidden shadow-sm hover:shadow-[0_0_10px_rgba(100,227,101,0.2)] cursor-pointer">
                    <div className="p-5 sm:p-6 h-full flex flex-col">
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <Badge
                          variant="outline"
                          className="text-xs bg-accent-green/20 text-accent-green border-accent-green/50 hover:bg-accent-green/30"
                        >
                          {post.category}
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
                            {new Date(post.date).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-white/5 text-white/60 border-white/10"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-accent-green hover:text-accent-green/80 font-medium self-start"
                      >
                        Leer artículo <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
