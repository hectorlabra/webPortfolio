import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BlogPost, TableOfContentsItem } from '@/lib/types/blog';
import { TableOfContents } from './TableOfContents';

interface PostLayoutProps {
  post: BlogPost;
  tableOfContents: TableOfContentsItem[];
  children: ReactNode;
}

export function PostLayout({ post, tableOfContents, children }: PostLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header con navegación */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <article className="lg:col-span-3">
            {/* Metadatos del post */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.featured && (
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                    Destacado
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
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
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="inline-block"
                    >
                      <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Contenido del post */}
            <div className="prose prose-gray dark:prose-invert prose-lg max-w-none">
              {children}
            </div>
          </article>

          {/* Sidebar con tabla de contenidos */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
