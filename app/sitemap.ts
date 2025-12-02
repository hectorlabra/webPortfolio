import { getAllPosts } from "@/lib/blog-utils";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // URLs estáticas del sitio
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: "https://hectorlabra.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://hectorlabra.dev/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://hectorlabra.dev/hoja-de-ruta",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // URLs dinámicas de posts
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const d = new Date(post.date);
    const lastModified = isNaN(d.getTime()) ? new Date() : d;
    return {
      url: `https://hectorlabra.dev/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.9 : 0.6,
    };
  });

  // URLs de categorías (si hay posts en esas categorías)
  const categories = [
    ...new Set(
      posts
        .map((post) => post.category)
        .filter((c): c is string => typeof c === "string" && c.length > 0)
    ),
  ];
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `https://hectorlabra.dev/blog/category/${encodeURIComponent(
      category.toLowerCase()
    )}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // URLs de tags (solo los más populares)
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2) // Solo tags con 2+ posts
    .map(([tag]) => tag);

  const tagUrls: MetadataRoute.Sitemap = popularTags.map((tag) => ({
    url: `https://hectorlabra.dev/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticUrls, ...postUrls, ...categoryUrls, ...tagUrls];
}
