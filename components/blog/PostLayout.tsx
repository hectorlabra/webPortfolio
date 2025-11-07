import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { BlogPost, TableOfContentsItem } from "@/lib/types/blog";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { NewsletterInPost } from "./NewsletterInPost";
import { RelatedPosts } from "./RelatedPosts";
import { PostNavigation } from "./PostNavigation";
import { LazyGeometricPattern } from "@/components/shared/LazyGeometricPattern";

interface PostLayoutProps {
  post: BlogPost;
  tableOfContents: TableOfContentsItem[];
  children: ReactNode;
}

export function PostLayout(props: PostLayoutProps) {
  const { post, children } = props;
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      <div className="mx-auto w-full max-w-[700px]">
        <main className="flex-1">
          {/* Hero Section with Geometric Pattern */}
          <section className="relative py-20 border-b border-white/10">
            {/* Geometric Pattern Background - Full width */}
            <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 opacity-30 overflow-hidden">
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
              </div>
            </div>
          </section>

          {/* Separador decorativo al igual que en "quien-soy" */}
          <LazyGeometricPattern />

          {/* Contenido principal */}
          <section className="w-full py-16 sm:py-24">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="max-w-[700px] mx-auto w-full space-y-8">
                <article className="min-w-0 w-full">
                  <div className="blog-richtext space-y-6">{children}</div>

                  <div className="mt-16">
                    <NewsletterInPost variant="prominent" />
                  </div>
                </article>

                <div className="my-24">
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
