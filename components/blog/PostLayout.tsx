import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { BlogPost, TableOfContentsItem } from "@/lib/types/blog";
import type { InlineNewsletterSplit } from "@/lib/blog-utils";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { NewsletterInPost } from "./NewsletterInPost";
import { RelatedPosts } from "./RelatedPosts";
import { PostNavigation } from "./PostNavigation";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";
import { PostSidebarsClient } from "./PostSidebarsClient";
import { MobileTOCButton } from "./MobileTOCButton";
import Image from "next/image";
import { Heading } from "@/components/shared/Heading";

interface PostLayoutProps {
  post: BlogPost;
  tableOfContents: TableOfContentsItem[];
  inlineSegments: InlineNewsletterSplit;
}

export function PostLayout(props: PostLayoutProps) {
  const { post, tableOfContents, inlineSegments } = props;
  const { beforeHtml, afterHtml, mode } = inlineSegments;
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      {/* Sidebars (appear after hero via IO + dynamic top) */}
      <PostSidebarsClient tableOfContents={tableOfContents} />
      {/* Mobile TOC Access (hidden on xl and up) */}
      <MobileTOCButton items={tableOfContents} />

      {/* Aquí va el wrapper sagrado (NO TOCAR): */}
      <div className="mx-auto w-full max-w-[700px]">
        <main className="flex-1">
          {/* Hero Section with Geometric Pattern */}
          <section id="post-hero" className="relative pt-20 pb-6">
            {/* Geometric Pattern Background - Full width */}
            {/* Geometric Pattern Background - Full width (opacity now handled inside component) */}
            <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <LazyGeometricPattern priority={true} />
            </div>

            <div className="container flex-1 flex flex-col px-4 md:px-6 relative z-10">
              {/* Breadcrumbs at top */}
              <div className="max-w-[700px] mx-auto mb-8 w-full">
                <Breadcrumbs post={post} />
              </div>

              {/* Hero Content - Centered */}
              <div className="max-w-[700px] mx-auto w-full space-y-6">
                {/* Category Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-accent-yellow text-[#0a0612] hover:bg-accent-yellow/90 font-semibold px-3 py-1 text-xs">
                    {post.category}
                  </Badge>
                </div>

                {/* Title */}
                <Heading
                  level={1}
                  className={
                    "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-white font-mono"
                  }
                >
                  {post.title}
                </Heading>

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

                {post.coverImage && (
                  <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.coverImage}
                        alt={post.coverAlt || post.title}
                        fill
                        sizes="(min-width: 1024px) 700px, (min-width: 768px) 80vw, 100vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sentinel to control sidebar appearance (below hero) */}
          {/* keep a 1px sentinel for IO work but remove visible gap */}
          <div id="post-hero-sentinel" className="h-px w-full" />

          {/* Contenido principal */}
          <section className="w-full pt-4 pb-12">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="max-w-[700px] mx-auto w-full space-y-6">
                <article id="post-article" className="min-w-0 w-full">
                  <div className="blog-richtext">
                    <RichTextChunk html={beforeHtml} />
                    <div
                      className="block xl:hidden my-10"
                      data-inline-newsletter-mode={mode}
                    >
                      <NewsletterInPost variant="compact" />
                    </div>
                    <RichTextChunk html={afterHtml} />
                  </div>

                  <div id="post-cta-newsletter" className="mt-12">
                    <NewsletterInPost variant="prominent" />
                  </div>
                </article>

                {/* Sentinel to hide sidebars when article ends */}
                <div id="post-end-sentinel" className="h-px w-full" />

                <div className="my-16">
                  <LazyGeometricPattern priority={false} />
                </div>

                <RelatedPosts currentSlug={post.slug} />

                <PostNavigation currentSlug={post.slug} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function RichTextChunk({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div
      className="contents"
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
