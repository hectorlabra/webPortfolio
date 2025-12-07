import {
  Paragraph,
  Heading,
  List,
  Blockquote,
  CodeBlock,
} from "@/components/content";

export const metadata = {
  title: "Guía Completa: Crear un Blog con Next.js y Remark",
  description:
    "Aprende paso a paso cómo construir un blog moderno usando Next.js 15, remark para markdown, y Tailwind CSS para el diseño.",
  date: "2025-01-20",
  author: "Héctor Labra",
  tags: ["nextjs", "remark", "tutorial", "blog", "markdown"],
  category: "Tutoriales",
  featured: true,
  published: true,
  slug: "guia-next-js-blog",
};

export default function GuiaNextJsBlogContent() {
  return (
    <>
      <Paragraph>
        En esta guía te enseñaré cómo construir un blog completo usando las
        tecnologías más modernas del ecosistema React.
      </Paragraph>

      <Heading level={2} id="por-que-estas-tecnologias">
        ¿Por qué estas tecnologías?
      </Heading>

      <Heading level={3} id="nextjs-15">
        Next.js 15
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">App Router</strong> para mejor
            organización
          </>,
          <>
            <strong className="text-white">Server Components</strong> por
            defecto
          </>,
          <>
            <strong className="text-white">Generación estática</strong> para
            máximo rendimiento
          </>,
          <>
            <strong className="text-white">SEO optimizado</strong>{" "}
            out-of-the-box
          </>,
        ]}
      />

      <Heading level={3} id="remark-ecosystem">
        Remark Ecosystem
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">Remark</strong> para procesamiento de
            markdown
          </>,
          <>
            <strong className="text-white">Rehype</strong> para transformaciones
            HTML
          </>,
          <>
            <strong className="text-white">Plugins</strong> extensibles para
            cualquier funcionalidad
          </>,
        ]}
      />

      <Heading level={2} id="configuracion-inicial">
        Configuración Inicial
      </Heading>

      <Heading level={3} id="instalacion-dependencias">
        1. Instalación de Dependencias
      </Heading>

      <CodeBlock
        language="bash"
        code={`# Dependencias principales
pnpm add gray-matter remark remark-html remark-parse

# Plugins de rehype
pnpm add rehype-slug rehype-autolink-headings rehype-prism-plus

# Estilos para contenido
pnpm add @tailwindcss/typography`}
      />

      <Heading level={3} id="configuracion-typescript">
        2. Configuración de TypeScript
      </Heading>

      <CodeBlock
        language="typescript"
        code={`// lib/types/blog.ts
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
}`}
      />

      <Heading level={2} id="pipeline-procesamiento">
        Pipeline de Procesamiento
      </Heading>

      <Heading level={3} id="configuracion-remark">
        Configuración de Remark
      </Heading>

      <CodeBlock
        language="typescript"
        code={`// lib/markdown.ts
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
  });`}
      />

      <Heading level={2} id="utilidades-blog">
        Utilidades del Blog
      </Heading>

      <Heading level={3} id="funciones-lectura">
        Funciones de Lectura
      </Heading>

      <CodeBlock
        language="typescript"
        code={`// lib/blog-utils.ts
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, \`\${slug}.md\`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as BlogFrontmatter;
    const htmlContent = await markdownToHtml(content);

    // Calcular tiempo de lectura
    const wordCount = content.split(/\\s+/).length;
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
    };
  } catch (error) {
    console.error(\`Error loading post \${slug}:\`, error);
    return null;
  }
}`}
      />

      <Heading level={2} id="componentes-blog">
        Componentes del Blog
      </Heading>

      <Heading level={3} id="postlayout-universal">
        PostLayout Universal
      </Heading>

      <CodeBlock
        language="tsx"
        code={`// components/blog/PostLayout.tsx
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
}`}
      />

      <Heading level={3} id="tabla-contenidos-inteligente">
        Tabla de Contenidos Inteligente
      </Heading>

      <CodeBlock
        language="tsx"
        code={`// components/blog/TableOfContents.tsx
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
}`}
      />

      <Heading level={2} id="paginas-dinamicas">
        Páginas Dinámicas
      </Heading>

      <Heading level={3} id="listado-principal">
        Listado Principal
      </Heading>

      <CodeBlock
        language="tsx"
        code={`// app/blog/page.tsx
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
}`}
      />

      <Heading level={3} id="posts-individuales">
        Posts Individuales
      </Heading>

      <CodeBlock
        language="tsx"
        code={`// app/blog/[slug]/page.tsx
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
}`}
      />

      <Heading level={2} id="optimizaciones">
        Optimizaciones
      </Heading>

      <Heading level={3} id="seo">
        SEO
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">Metadatos</strong> automáticos por
            post
          </>,
          <>
            <strong className="text-white">Open Graph</strong> para redes
            sociales
          </>,
          <>
            <strong className="text-white">Structured data</strong> para motores
            de búsqueda
          </>,
          <>
            <strong className="text-white">Sitemap</strong> automático
          </>,
        ]}
      />

      <Heading level={3} id="performance">
        Performance
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">Generación estática</strong> en build
            time
          </>,
          <>
            <strong className="text-white">Image optimization</strong> con
            Next.js
          </>,
          <>
            <strong className="text-white">Code splitting</strong> automático
          </>,
          <>
            <strong className="text-white">Lazy loading</strong> de componentes
          </>,
        ]}
      />

      <Heading level={3} id="ux">
        UX
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">Navegación fluida</strong> entre
            posts
          </>,
          <>
            <strong className="text-white">Tabla de contenidos</strong>{" "}
            interactiva
          </>,
          <>
            <strong className="text-white">Tiempo de lectura</strong> calculado
          </>,
          <>
            <strong className="text-white">Tags y categorías</strong> navegables
          </>,
        ]}
      />

      <Heading level={2} id="proximos-pasos">
        Próximos Pasos
      </Heading>

      <List
        ordered
        items={[
          <>
            <strong className="text-white">Sistema de comentarios</strong> con
            Giscus
          </>,
          <>
            <strong className="text-white">Search</strong> con Algolia o Fuse.js
          </>,
          <>
            <strong className="text-white">Newsletter</strong> integration
          </>,
          <>
            <strong className="text-white">RSS feed</strong> automático
          </>,
          <>
            <strong className="text-white">Analytics</strong> con Google
            Analytics
          </>,
        ]}
      />

      <Heading level={2} id="conclusion">
        Conclusión
      </Heading>

      <Paragraph>Este stack te proporciona:</Paragraph>

      <List
        items={[
          "✅ Flexibilidad total en el contenido",
          "✅ Performance excepcional",
          "✅ SEO optimizado",
          "✅ Developer Experience superior",
          "✅ Escalabilidad para el futuro",
        ]}
      />

      <Paragraph>¡Feliz blogging! 🎉</Paragraph>

      <hr className="border-white/10 my-12" />

      <Paragraph>
        <strong className="text-white">Recursos útiles:</strong>
      </Paragraph>

      <List
        items={[
          <a
            key="nextjs"
            href="https://nextjs.org/docs"
            className="text-[#64E365] hover:underline"
          >
            Next.js Documentation
          </a>,
          <a
            key="remark"
            href="https://remark.js.org/"
            className="text-[#64E365] hover:underline"
          >
            Remark Ecosystem
          </a>,
          <a
            key="tailwind"
            href="https://tailwindcss.com/"
            className="text-[#64E365] hover:underline"
          >
            Tailwind CSS
          </a>,
        ]}
      />
    </>
  );
}
