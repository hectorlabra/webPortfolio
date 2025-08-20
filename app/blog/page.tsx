import { getAllPosts, getBlogMetadata } from '@/lib/blog-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getAllPosts();
  const metadata = await getBlogMetadata();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground">
            <span>{metadata.totalPosts} artículos</span>
            <span>•</span>
            <span>{metadata.categories.length} categorías</span>
            <span>•</span>
            <span>{metadata.tags.length} tags</span>
          </div>
        </header>

        {/* Posts destacados */}
        {metadata.featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Artículos destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metadata.featuredPosts.map((post) => (
                <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                        Destacado
                      </Badge>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                            <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                              #{tag}
                            </Badge>
                          </Link>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Todos los posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {metadata.featuredPosts.length > 0 ? 'Todos los artículos' : 'Artículos recientes'}
          </h2>
          
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.featured && (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                              Destacado
                            </Badge>
                          )}
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-2xl font-bold hover:text-primary transition-colors mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-muted-foreground mb-4">
                          {post.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime} min de lectura</span>
                          </div>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag) => (
                              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                  #{tag}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No hay artículos publicados aún.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Mantente atento para nuevos contenidos!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
