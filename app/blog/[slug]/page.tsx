import { notFound } from "next/navigation";
import {
  getAllArticleMetadata,
  getArticleMetadataBySlug,
  type ArticleMetadata,
} from "@/content/articles";
import { PostLayout } from "@/components/blog/PostLayout";
import { generateArticleStructuredData } from "@/lib/structured-data";

// Dynamic imports for article content
import dynamic from "next/dynamic";

// Article content components map
const articleComponents: Record<string, React.ComponentType> = {
  "guia-next-js-blog": dynamic(
    () =>
      import("@/content/articles/guia-next-js-blog").then((mod) => mod.default),
    { ssr: true }
  ),
  "mi-primer-post": dynamic(
    () =>
      import("@/content/articles/mi-primer-post").then((mod) => mod.default),
    { ssr: true }
  ),
};

// Table of contents for each article (extracted from headings)
const articleTableOfContents: Record<
  string,
  { id: string; text: string; level: number }[]
> = {
  "guia-next-js-blog": [
    {
      id: "por-que-estas-tecnologias",
      text: "¿Por qué estas tecnologías?",
      level: 1,
    },
    { id: "configuracion-inicial", text: "Configuración Inicial", level: 1 },
    {
      id: "pipeline-procesamiento",
      text: "Pipeline de Procesamiento",
      level: 1,
    },
    { id: "utilidades-blog", text: "Utilidades del Blog", level: 1 },
    { id: "componentes-blog", text: "Componentes del Blog", level: 1 },
    { id: "paginas-dinamicas", text: "Páginas Dinámicas", level: 1 },
    { id: "optimizaciones", text: "Optimizaciones", level: 1 },
    { id: "proximos-pasos", text: "Próximos Pasos", level: 1 },
    { id: "conclusion", text: "Conclusión", level: 1 },
  ],
  "mi-primer-post": [
    {
      id: "que-incluye-este-sistema",
      text: "¿Qué incluye este sistema?",
      level: 1,
    },
    { id: "ejemplo-de-codigo", text: "Ejemplo de Código", level: 1 },
    { id: "lista-caracteristicas", text: "Lista de Características", level: 1 },
    { id: "citas-blockquotes", text: "Citas y Blockquotes", level: 1 },
    { id: "tablas", text: "Tablas", level: 1 },
    { id: "conclusion", text: "Conclusión", level: 1 },
  ],
};

type SlugParams = { slug: string };

export async function generateStaticParams() {
  const articles = getAllArticleMetadata();
  // Filter only blog posts (exclude hoja-de-ruta which is a page)
  return articles
    .filter((a) => a.slug !== "hoja-de-ruta")
    .map((article) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const { slug } = await params;
  const article = getArticleMetadataBySlug(slug);

  if (!article) {
    return {
      title: "Post no encontrado",
    };
  }

  return {
    title: `${article.title} | Blog de Héctor Labra`,
    description: article.description,
    authors: article.author ? [{ name: article.author }] : [],
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: article.author ? [article.author] : [],
      tags: article.tags,
      url: `https://hectorlabra.dev/blog/${article.slug}`,
      siteName: "Héctor Labra - Desarrollador Full Stack",
      locale: "es_ES",
      images: [
        {
          url: "https://hectorlabra.dev/og-image-blog.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: ["https://hectorlabra.dev/og-image-blog.jpg"],
      creator: "@hectorlabra",
      site: "@hectorlabra",
    },
    alternates: {
      canonical: `https://hectorlabra.dev/blog/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const { slug } = await params;
  const article = getArticleMetadataBySlug(slug);
  const ArticleContent = articleComponents[slug];

  if (!article || !ArticleContent) {
    notFound();
  }

  const tableOfContents = articleTableOfContents[slug] || [];

  // Build post object for PostLayout compatibility
  const post = {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    author: article.author || "Héctor Labra",
    tags: article.tags || [],
    category: article.category || "General",
    featured: article.featured || false,
    published: article.published !== false,
    content: "", // Not used in TSX mode
    excerpt: article.description.slice(0, 150) + "...",
    readingTime: 5, // Estimate
  };

  // Generate structured data
  const structuredData = generateArticleStructuredData(post);

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <PostLayout
        post={post}
        tableOfContents={tableOfContents}
        inlineSegments={{ beforeHtml: "", afterHtml: "", mode: "start" }}
      >
        {/* Render TSX content directly - no dangerouslySetInnerHTML */}
        <ArticleContent />
      </PostLayout>
    </>
  );
}
