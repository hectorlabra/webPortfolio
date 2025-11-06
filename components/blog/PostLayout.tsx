import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { BlogPost, TableOfContentsItem } from "@/lib/types/blog";
import { TableOfContents } from "./TableOfContents";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { NewsletterInPost } from "./NewsletterInPost";
import { RelatedPosts } from "./RelatedPosts";
import { PostNavigation } from "./PostNavigation";
import { TableOfContentsMobile } from "./TableOfContentsMobile";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";

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

      {/* Hero Section with Geometric Pattern */}
      <section className="relative py-20 overflow-hidden border-b border-white/10">
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <LazyGeometricPattern priority={true} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumbs at top */}
          <div className="max-w-[1200px] mx-auto mb-8">
            <Breadcrumbs post={post} />
          </div>

          {/* Hero Content - Centered */}
          <div className="max-w-[700px] mx-auto">
            <header className="space-y-6">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-accent-yellow text-[#0a0612] hover:bg-accent-yellow/90 font-semibold px-3 py-1 text-xs">
                  {post.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg text-white/70 leading-relaxed">
                {post.description}
              </p>

              {/* Meta info */}
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

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-20">
        {/* 3-Column Layout: Left TOC | Article Centered | Right Newsletter */}
        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_250px] gap-12 max-w-[1400px] mx-auto">
          {/* Left Sidebar - TOC */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>

          {/* Contenido principal - Centered */}
          <article className="min-w-0 w-full">
            {/* Contenido del post */}
            <div
              className="prose prose-invert max-w-[700px] mx-auto
              prose-headings:font-bold prose-headings:text-white
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-base prose-p:sm:text-lg prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white prose-a:transition-colors
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-white/90 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-[#0a0612] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
              prose-blockquote:border-l-4 prose-blockquote:border-white/30 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:pl-4 prose-blockquote:text-white/70
              prose-ul:text-base prose-ul:sm:text-lg prose-ul:text-white/80 
              prose-ol:text-base prose-ol:sm:text-lg prose-ol:text-white/80
              prose-li:text-white/80 prose-li:marker:text-white/50
              prose-table:border prose-table:border-white/10
              prose-th:bg-white/5 prose-th:text-white prose-th:font-semibold
              prose-td:border-t prose-td:border-white/10 prose-td:text-white/80
              prose-img:rounded-lg prose-img:shadow-lg"
            >
              {children}
            </div>

            {/* Newsletter Section - Will move to sidebar */}
            <div className="mt-16 xl:hidden">
              <NewsletterInPost variant="prominent" />
            </div>
          </article>

          {/* Right Sidebar - Newsletter */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              {/* Newsletter sticky on desktop */}
              <NewsletterInPost variant="compact" />
            </div>
          </aside>
        </div>

        {/* Separator - already has geometric pattern built-in */}
        <div className="my-24">
          <LazyGeometricPattern priority={false} />
        </div>

        {/* Related Posts */}
        <RelatedPosts currentSlug={post.slug} />

        {/* Post Navigation */}
        <PostNavigation currentSlug={post.slug} />
      </div>
    </div>
  );
}
