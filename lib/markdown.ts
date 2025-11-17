import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import type { Root, Heading, PhrasingContent, Text } from "mdast";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { rehypeOptimizeImages } from "./rehype-optimize-images";

// Utilidad para comparar textos de forma robusta
function normalizeText(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Plugin remark que elimina el primer H1 si coincide con el título canónico
type PruneOptions = { title?: string };

const headingToText = (node: Heading): string => toString(node).trim();

const remarkPruneFirstH1IfMatches: Plugin<[PruneOptions?], Root> =
  (options?: PruneOptions) => (tree: Root) => {
    const title = options?.title;
    if (!title) return;
    const { children } = tree;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type === "heading" && node.depth === 1) {
        const text = headingToText(node as Heading);
        if (normalizeText(text) === normalizeText(title)) {
          children.splice(i, 1);
        }
        break; // Solo el primer heading
      }
    }
  };

type MarkdownProcessorOptions = {
  title?: string;
  slug?: string;
};

// Crea un processor por invocación para poder inyectar opciones dinámicas
function createMarkdownProcessor(options?: MarkdownProcessorOptions) {
  const title = options?.title;
  const slug = options?.slug;
  return (
    remark()
      .use(remarkParse)
      .use(remarkPruneFirstH1IfMatches, { title })
      // Pasamos de MDAST (remark) a HAST (rehype)
      .use(remarkRehype)
      // Plugins rehype sobre el árbol HTML (HAST)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: { className: ["anchor-link"] },
      })
      .use(rehypeOptimizeImages, { slug })
      .use(rehypePrismPlus, { showLineNumbers: true, ignoreMissing: true })
      // Serializamos a HTML
      .use(rehypeStringify)
  );
}

// Función para convertir Markdown a HTML (con título opcional para poda de H1)
export async function markdownToHtml(
  markdown: string,
  options?: MarkdownProcessorOptions
): Promise<string> {
  const processor = createMarkdownProcessor(options);
  const result = await processor.process(markdown);
  return result.toString();
}

// Función para extraer headings y generar TOC
export function extractTableOfContents(markdown: string) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[0].indexOf(" ") - 1; // Número de # menos 1
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}
