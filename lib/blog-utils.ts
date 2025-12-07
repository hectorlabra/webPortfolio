/**
 * Blog utilities - TSX-based version
 * Refactored to work with TSX article content instead of markdown
 */

import {
  getAllArticleMetadata,
  getArticleMetadataBySlug,
  type ArticleMetadata,
} from "@/content/articles";
import { BlogPost, BlogMetadata, TableOfContentsItem } from "./types/blog";

// Re-export types for compatibility
export type InlineNewsletterSplit = {
  beforeHtml: string;
  afterHtml: string;
  mode: "second-h2" | "first-h2" | "start";
};

// This function is kept for backward compatibility but returns empty split
// since TSX rendering doesn't use HTML splitting
export function splitHtmlAfterSecondH2(html: string): InlineNewsletterSplit {
  return {
    beforeHtml: "",
    afterHtml: html,
    mode: "start",
  };
}

// Convert ArticleMetadata to BlogPost format
function articleToBlogPost(article: ArticleMetadata): BlogPost {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    author: article.author || "Héctor Labra",
    tags: article.tags || [],
    category: article.category || "General",
    featured: article.featured || false,
    published: article.published !== false,
    content: "", // TSX content is rendered via components
    excerpt: article.description.slice(0, 150) + "...",
    readingTime: 5, // Default estimate
  };
}

// Get all blog post slugs (excluding pages like hoja-de-ruta)
export function getAllPostSlugs(): string[] {
  return getAllArticleMetadata()
    .filter((article) => article.slug !== "hoja-de-ruta")
    .map((article) => article.slug);
}

// Get a post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const article = getArticleMetadataBySlug(slug);
  if (!article || article.slug === "hoja-de-ruta") {
    return null;
  }
  return articleToBlogPost(article);
}

// Get all published posts
export async function getAllPosts(): Promise<BlogPost[]> {
  return getAllArticleMetadata()
    .filter((article) => article.slug !== "hoja-de-ruta")
    .filter((article) => article.published !== false)
    .map(articleToBlogPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get posts by category
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

// Get blog metadata
export async function getBlogMetadata(): Promise<BlogMetadata> {
  const allPosts = await getAllPosts();

  const categories = [...new Set(allPosts.map((post) => post.category))];
  const tags = [...new Set(allPosts.flatMap((post) => post.tags))];
  const recentPosts = allPosts.slice(0, 5);
  const featuredPosts = allPosts.filter((post) => post.featured);

  return {
    totalPosts: allPosts.length,
    categories,
    tags,
    recentPosts,
    featuredPosts,
  };
}

// Table of contents generation is now handled per-article in TSX files
// This function is kept for backward compatibility
export function buildTableOfContents(
  _markdown: string,
  _titleToPrune?: string
): TableOfContentsItem[] {
  // Return empty - TOC is now defined per-article in the page component
  return [];
}

// Get related posts
export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = await getAllPosts();
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

  const postsWithScore = otherPosts.map((post) => {
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    const sameCategory = post.category === currentPost.category ? 1 : 0;
    const score = sharedTags.length * 2 + sameCategory;
    return { post, score };
  });

  return postsWithScore
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map((item) => item.post)
    .slice(0, limit);
}

// Get previous post
export async function getPreviousPost(
  currentSlug: string
): Promise<BlogPost | null> {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1 || currentIndex === allPosts.length - 1) {
    return null;
  }

  return allPosts[currentIndex + 1];
}

// Get next post
export async function getNextPost(
  currentSlug: string
): Promise<BlogPost | null> {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }

  return allPosts[currentIndex - 1];
}
