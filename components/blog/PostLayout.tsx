import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogPost, TableOfContentsItem } from "@/lib/types/blog";
import { TableOfContents } from "./TableOfContents";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { ShareButtons } from "./ShareButtons";
import { AuthorCard } from "./AuthorCard";
import { NewsletterInPost } from "./NewsletterInPost";
import { RelatedPosts } from "./RelatedPosts";
import { PostNavigation } from "./PostNavigation";
import { TableOfContentsMobile } from "./TableOfContentsMobile";

interface PostLayoutProps {
  post: BlogPost;
  tableOfContents: TableOfContentsItem[];
  children: ReactNode;
}

export function PostLayout({
  post,
  tableOfContents,
  children,
}: PostLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Table of Contents Mobile */}
      <TableOfContentsMobile items={tableOfContents} />

      {/* Header con navegación */}
      <header className="border-b border-white/10 bg-[#0a0612]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 hover:bg-white/10 hover:text-accent-green transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Breadcrumbs */}
        <Breadcrumbs post={post} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 xl:gap-12">
          {/* Contenido principal */}
          <article className="min-w-0 max-w-[720px]">
            {/* Metadatos del post */}
            <header className="mb-12 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-accent-yellow text-[#0a0612] hover:bg-accent-yellow/90 font-semibold px-4 py-1.5 text-sm">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="bg-accent-green text-[#0a0612] hover:bg-accent-green/90 font-semibold px-4 py-1.5 text-sm shadow-[0_0_15px_rgba(100,227,101,0.4)]">
                    ⭐ Destacado
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono tracking-tight mb-6 text-accent-green leading-tight">
                {post.title}
              </h1>

              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min de lectura</span>
                </div>
              </div>

              {/* Share Buttons */}
              <ShareButtons
                url={`${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://hectorlabra.dev"
                }/blog/${post.slug}`}
                title={post.title}
                description={post.description}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="inline-block"
                    >
                      <Badge
                        variant="outline"
                        className="border-accent-green/40 text-white/90 hover:bg-accent-green/10 hover:border-accent-green transition-all duration-200"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Contenido del post */}
            <div
              className="prose prose-invert prose-lg max-w-none
              prose-headings:font-mono prose-headings:font-bold
              prose-h1:text-accent-green prose-h1:text-4xl
              prose-h2:text-accent-green prose-h2:text-3xl
              prose-h3:text-accent-green prose-h3:text-2xl
              prose-p:text-white/90 prose-p:leading-relaxed
              prose-a:text-accent-green prose-a:no-underline prose-a:font-medium hover:prose-a:text-accent-yellow prose-a:transition-colors
              prose-strong:text-accent-yellow prose-strong:font-semibold
              prose-code:text-accent-yellow prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-[#0a0612] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
              prose-blockquote:border-l-4 prose-blockquote:border-accent-green prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:pl-4
              prose-ul:text-white/90 prose-ol:text-white/90
              prose-li:text-white/90 prose-li:marker:text-accent-green
              prose-table:border prose-table:border-white/10
              prose-th:bg-white/5 prose-th:text-accent-green prose-th:font-semibold
              prose-td:border-t prose-td:border-white/10 prose-td:text-white/90
              prose-img:rounded-lg prose-img:shadow-lg"
            >
              {children}
            </div>

            {/* Newsletter Section */}
            <div className="mt-16">
              <NewsletterInPost variant="prominent" />
            </div>
          </article>

          {/* Sidebar con tabla de contenidos */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={tableOfContents} />

              <AuthorCard
                name={post.author}
                bio="Desarrollador Full Stack apasionado por crear experiencias web excepcionales. Especializado en Next.js, React y TypeScript."
                avatar="/avatar.jpg"
                social={{
                  github: "https://github.com/hectorlabra",
                  linkedin: "https://www.linkedin.com/in/hectorlabra",
                  twitter: "https://twitter.com/hectorlabra",
                  website: "https://hectorlabra.dev",
                }}
              />
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <RelatedPosts currentSlug={post.slug} />

        {/* Post Navigation */}
        <PostNavigation currentSlug={post.slug} />
      </div>
    </div>
  );
}
