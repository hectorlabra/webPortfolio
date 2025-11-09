import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog-utils";
import { buildTableOfContents } from "@/lib/blog-utils";
import { PostLayout } from "@/components/blog/PostLayout";
import { generateArticleStructuredData } from "@/lib/structured-data";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

type SlugParams = { slug: string };

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post no encontrado",
    };
  }

  return {
    title: `${post.title} | Blog de Héctor Labra`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `https://hectorlabra.dev/blog/${post.slug}`,
      siteName: "Héctor Labra - Desarrollador Full Stack",
      locale: "es_ES",
      images: [
        {
          url: "https://hectorlabra.dev/og-image-blog.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["https://hectorlabra.dev/og-image-blog.jpg"],
      creator: "@hectorlabra",
      site: "@hectorlabra",
    },
    alternates: {
      canonical: `https://hectorlabra.dev/blog/${post.slug}`,
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
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Obtener el contenido markdown original para la tabla de contenidos
  const fullPath = path.join(process.cwd(), "content/posts", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(fileContents);
  const tableOfContents = buildTableOfContents(content, post.title);

  // Generar structured data
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

      <PostLayout post={post} tableOfContents={tableOfContents}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </PostLayout>
    </>
  );
}
