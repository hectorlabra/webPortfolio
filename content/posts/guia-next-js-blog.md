---
title: "Guía Completa: Crear un Blog con Next.js y Remark"
description: "Aprende paso a paso cómo construir un blog moderno usando Next.js 15, remark para markdown, y Tailwind CSS para el diseño."
date: "2025-01-20"
author: "Héctor Labra"
tags: ["nextjs", "remark", "tutorial", "blog", "markdown"]
category: "Tutoriales"
featured: true
published: true
---

En esta guía te enseñaré cómo construir un blog completo usando las tecnologías más modernas del ecosistema React.

## ¿Por qué estas tecnologías?

### Next.js 15

- **App Router** para mejor organización
- **Server Components** por defecto
- **Generación estática** para máximo rendimiento
- **SEO optimizado** out-of-the-box

### Remark Ecosystem

- **Remark** para procesamiento de markdown
- **Rehype** para transformaciones HTML
- **Plugins** extensibles para cualquier funcionalidad

## Configuración Inicial

### 1. Instalación de Dependencias

```bash
# Dependencias principales
pnpm add gray-matter remark remark-html remark-parse

# Plugins de rehype
pnpm add rehype-slug rehype-autolink-headings rehype-prism-plus

# Estilos para contenido
pnpm add @tailwindcss/typography
```

### 2. Configuración de TypeScript

```typescript
// lib/types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  content: string;
  excerpt: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  featured?: boolean;
  published?: boolean;
}
```

## Pipeline de Procesamiento

### Configuración de Remark

```typescript
// lib/markdown.ts
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";

export const markdownProcessor = remark()
  .use(remarkParse)
  .use(remarkHtml, { sanitize: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: {
      className: ["anchor-link"],
    },
  })
  .use(rehypePrismPlus, {
    showLineNumbers: true,
    ignoreMissing: true,
  });
```

## Utilidades del Blog

### Funciones de Lectura

```typescript
// lib/blog-utils.ts
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as BlogFrontmatter;
    const htmlContent = await markdownToHtml(content);

    // Calcular tiempo de lectura
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author,
      tags: frontmatter.tags || [],
      category: frontmatter.category,
      featured: frontmatter.featured || false,
      published: frontmatter.published !== false,
      content: htmlContent,
      excerpt: content.slice(0, 150).trim() + '...',
      readingTime,
      readingTime,
ent.s {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
```

## Componentes del Blog

### PostLayout Universal

```tsx
// components/blog/PostLayout.tsx
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Navegación */}
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            {/* Metadatos y contenido */}
            <div className="prose prose-gray dark:prose-invert prose-lg max-w-none">
              {children}
            </div>
          </article>

          <aside className="lg:col-span-1">
            <TableOfContents items={tableOfContents} />
          </aside>
        </div>
      </div>
    </div>
  );
}
```

### Tabla de Contenidos Inteligente

```tsx
// components/blog/TableOfContents.tsx
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  // Renderizado recursivo para jerarquía
}
```

## Páginas Dinámicas

### Listado Principal

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getAllPosts();
  const metadata = await getBlogMetadata();

  return (
    <div className="min-h-screen bg-background">
      {/* Posts destacados */}
      {metadata.featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artículos destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Grid de posts destacados */}
          </div>
        </section>
      )}

      {/* Todos los posts */}
      <section>
        <div className="space-y-6">{/* Lista de posts */}</div>
      </section>
    </div>
  );
}
```

### Posts Individuales

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  return (
    <PostLayout post={post} tableOfContents={tableOfContents}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </PostLayout>
  );
}
```

## Optimizaciones

### SEO

- **Metadatos** automáticos por post
- **Open Graph** para redes sociales
- **Structured data** para motores de búsqueda
- **Sitemap** automático

### Performance

- **Generación estática** en build time
- **Image optimization** con Next.js
- **Code splitting** automático
- **Lazy loading** de componentes

### UX

- **Navegación fluida** entre posts
- **Tabla de contenidos** interactiva
- **Tiempo de lectura** calculado
- **Tags y categorías** navegables

## Próximos Pasos

1. **Sistema de comentarios** con Giscus
2. **Search** con Algolia o Fuse.js
3. **Newsletter** integration
4. **RSS feed** automático
5. **Analytics** con Google Analytics

## Conclusión

Este stack te proporciona:

- ✅ **Flexibilidad** total en el contenido
- ✅ **Performance** excepcional
- ✅ **SEO** optimizado
- ✅ **Developer Experience** superior
- ✅ **Escalabilidad** para el futuro

¡Feliz blogging! 🎉

---

**Recursos útiles:**

- [Next.js Documentation](https://nextjs.org/docs)
- [Remark Ecosystem](https://remark.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
