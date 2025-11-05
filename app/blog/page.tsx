import { getAllPosts, getBlogMetadata } from "@/lib/blog-utils";
import { generateBlogStructuredData } from "@/lib/structured-data";
import { BlogClient } from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Héctor Labra - Desarrollador Full Stack",
  description:
    "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software. Tutoriales de React, Next.js, TypeScript y más.",
  keywords: [
    "blog",
    "desarrollo",
    "programación",
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "web development",
  ],
  openGraph: {
    title: "Blog de Héctor Labra",
    description:
      "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.",
    type: "website",
    url: "https://hectorlabra.dev/blog",
    siteName: "Héctor Labra - Desarrollador Full Stack",
    locale: "es_ES",
    images: [
      {
        url: "https://hectorlabra.dev/og-image-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog de Héctor Labra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Héctor Labra",
    description:
      "Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.",
    images: ["https://hectorlabra.dev/og-image-blog.jpg"],
    creator: "@hectorlabra",
    site: "@hectorlabra",
  },
  alternates: {
    canonical: "https://hectorlabra.dev/blog",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Blog RSS Feed" }],
    },
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

export default async function BlogPage() {
  const posts = await getAllPosts();
  const blogMetadata = await getBlogMetadata();
  const structuredData = generateBlogStructuredData();

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <BlogClient posts={posts} metadata={blogMetadata} />
    </>
  );
}
