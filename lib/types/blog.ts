// Tipos TypeScript para el sistema de blog

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage?: string;
  tags: string[];
  category: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  content: string;
  excerpt: string;
  coverImage?: string;
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
  cover?: string;
  coverAlt?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface BlogMetadata {
  totalPosts: number;
  categories: string[];
  tags: string[];
  recentPosts: BlogPost[];
  featuredPosts: BlogPost[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPosts: number;
}

export interface BlogPostWithNavigation extends BlogPost {
  previousPost?: Pick<BlogPost, "slug" | "title">;
  nextPost?: Pick<BlogPost, "slug" | "title">;
  tableOfContents: TableOfContentsItem[];
}
