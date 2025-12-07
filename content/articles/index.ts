// Article content barrel file
// Export all TSX article content and metadata

export {
  default as HojaDeRutaContent,
  metadata as hojaDeRutaMetadata,
} from "./hoja-de-ruta";
export {
  default as GuiaNextJsBlogContent,
  metadata as guiaNextJsBlogMetadata,
} from "./guia-next-js-blog";
export {
  default as MiPrimerPostContent,
  metadata as miPrimerPostMetadata,
} from "./mi-primer-post";

// Type for article metadata
export interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  published?: boolean;
  slug: string;
}

// Registry of all articles for dynamic loading
import {
  hojaDeRutaMetadata,
  guiaNextJsBlogMetadata,
  miPrimerPostMetadata,
} from "./";

export const articlesRegistry: Record<string, ArticleMetadata> = {
  "hoja-de-ruta": hojaDeRutaMetadata as ArticleMetadata,
  "guia-next-js-blog": guiaNextJsBlogMetadata as ArticleMetadata,
  "mi-primer-post": miPrimerPostMetadata as ArticleMetadata,
};

// Helper to get all published articles
export function getAllArticleMetadata(): ArticleMetadata[] {
  return Object.values(articlesRegistry)
    .filter((article) => article.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper to get article by slug
export function getArticleMetadataBySlug(slug: string): ArticleMetadata | null {
  return articlesRegistry[slug] || null;
}
