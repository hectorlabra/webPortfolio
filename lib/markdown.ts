import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';

// Configuración del pipeline de remark para procesar Markdown
export const markdownProcessor = remark()
  .use(remarkParse)
  .use(remarkHtml, { sanitize: false })
  .use(rehypeSlug) // Añade IDs a los headings
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: {
      className: ['anchor-link'],
    },
  }) // Crea enlaces automáticos en headings
  .use(rehypePrismPlus, {
    showLineNumbers: true,
    ignoreMissing: true,
  }); // Syntax highlighting

// Función para convertir Markdown a HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await markdownProcessor.process(markdown);
  return result.toString();
}

// Función para extraer headings y generar TOC
export function extractTableOfContents(markdown: string) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[0].indexOf(' ') - 1; // Número de # menos 1
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}
