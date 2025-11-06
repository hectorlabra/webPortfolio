import { getPreviousPost, getNextPost } from "@/lib/blog-utils";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PostNavigationProps {
  currentSlug: string;
}

export async function PostNavigation({ currentSlug }: PostNavigationProps) {
  const [previousPost, nextPost] = await Promise.all([
    getPreviousPost(currentSlug),
    getNextPost(currentSlug),
  ]);

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav
      className="mt-20"
      aria-label="Post navigation"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/[0.07] hover:border-accent-green transition-all duration-200"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white/70 group-hover:text-accent-green group-hover:-translate-x-1 transition-all" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                Artículo Anterior
              </p>
              <p className="text-white font-medium line-clamp-2 group-hover:text-accent-green transition-colors">
                {previousPost.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/[0.07] hover:border-accent-green transition-all duration-200 md:ml-auto"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                Siguiente Artículo
              </p>
              <p className="text-white font-medium line-clamp-2 group-hover:text-accent-green transition-colors">
                {nextPost.title}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
                <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-accent-green group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
