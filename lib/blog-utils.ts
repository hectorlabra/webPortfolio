import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  BlogPost,
  BlogFrontmatter,
  BlogMetadata,
  TableOfContentsItem,
} from "./types/blog";
import { markdownToHtml, extractTableOfContents } from "./markdown";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");

// Función para leer todos los archivos de posts
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

// Función para obtener datos de un post específico
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const frontmatter = data as BlogFrontmatter;
    const htmlContent = await markdownToHtml(content);

    // Calcular tiempo de lectura (aproximadamente 200 palabras por minuto)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Generar excerpt (primeros 150 caracteres del contenido)
    const excerpt = content.slice(0, 150).trim() + "...";

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author,
      tags: frontmatter.tags || [],
      category: frontmatter.category,
      featured: frontmatter.featured || false,
      published: frontmatter.published !== false, // Por defecto true
      content: htmlContent,
      excerpt,
      readingTime,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

// Función para obtener todos los posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));

  return posts
    .filter((post): post is BlogPost => post !== null && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Función para obtener posts por categoría
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

// Función para obtener posts por tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

// Función para obtener metadatos del blog
export async function getBlogMetadata(): Promise<BlogMetadata> {
  const allPosts = await getAllPosts();

  // Extraer categorías únicas
  const categories = [...new Set(allPosts.map((post) => post.category))];

  // Extraer tags únicos
  const tags = [...new Set(allPosts.flatMap((post) => post.tags))];

  // Posts recientes (últimos 5)
  const recentPosts = allPosts.slice(0, 5);

  // Posts destacados
  const featuredPosts = allPosts.filter((post) => post.featured);

  return {
    totalPosts: allPosts.length,
    categories,
    tags,
    recentPosts,
    featuredPosts,
  };
}

// Función para generar tabla de contenido jerarquizada
export function buildTableOfContents(markdown: string): TableOfContentsItem[] {
  const flatHeadings = extractTableOfContents(markdown);
  const toc: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];

  flatHeadings.forEach((heading) => {
    const item: TableOfContentsItem = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
      children: [],
    };

    // Encontrar el lugar correcto en la jerarquía
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      if (!stack[stack.length - 1].children) {
        stack[stack.length - 1].children = [];
      }
      stack[stack.length - 1].children!.push(item);
    }

    stack.push(item);
  });

  return toc;
}

// Función para obtener posts relacionados por tags
export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = await getAllPosts();

  // Filtrar el post actual
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

  // Calcular relevancia basada en tags compartidos
  const postsWithScore = otherPosts.map((post) => {
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    const sameCategory = post.category === currentPost.category ? 1 : 0;
    const score = sharedTags.length * 2 + sameCategory;

    return { post, score };
  });

  // Ordenar por relevancia y luego por fecha
  const sortedPosts = postsWithScore
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map((item) => item.post);

  return sortedPosts.slice(0, limit);
}

// Función para obtener el post anterior
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

// Función para obtener el siguiente post
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
