"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/shared/geometric-pattern";
import { NewsletterForm } from "@/components/sections/home/newsletter-form";
import { BlogCard } from "@/components/blog/BlogCard";
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
                  <h1 className="font-mono text-[1.7rem] sm:text-3xl md:text-4xl font-bold tracking-tighter">
                    Aprende desarrollo moderno.
                  </h1>
                  <p className="text-base sm:text-lg text-white/70 max-w-xl">
                    Tutoriales prácticos de Next.js, React, TypeScript y IA que
                    puedes aplicar hoy mismo. Sin teoría innecesaria.
                  </p>
                </div>

                {/* Grid de categorías principales */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
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

        {/* Últimos Artículos */}
        <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
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
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Geometric Pattern */}
        <GeometricPattern />

        {/* CTA de Conversión Final */}
        <section className="w-full py-16 sm:py-24 md:py-36">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="rounded-lg border-2 border-white/20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur p-8 sm:p-12 text-center max-w-3xl mx-auto">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white mb-4">
                ¿Te gustó lo que leíste?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Recibe nuevos artículos cada semana directamente en tu inbox.
                Sin spam, solo contenido de valor. 📬
              </p>

              {/* Newsletter Form */}
              <div className="max-w-md mx-auto mb-6">
                <NewsletterForm />
              </div>

              {/* Secondary CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 border-t border-white/10">
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
                    <Link href="/quien-soy">
                      Sobre mí <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
