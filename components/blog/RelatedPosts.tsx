import { getRelatedPosts } from '@/lib/blog-utils';
import { BlogCard } from './BlogCard';
import { BookOpen } from 'lucide-react';

interface RelatedPostsProps {
  currentSlug: string;
}

export async function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentSlug, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 pt-16 border-t border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-6 w-6 text-accent-green" />
        <h2 className="text-2xl md:text-3xl font-bold font-mono text-white">
          Artículos Relacionados
        </h2>
      </div>

      <p className="text-white/70 mb-8">
        Continúa explorando contenido similar que podría interesarte
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
