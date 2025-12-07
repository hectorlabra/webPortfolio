import {
  Paragraph,
  Heading,
  List,
  Blockquote,
  CodeBlock,
} from "@/components/content";

export const metadata = {
  title: "Mi Primer Post del Blog",
  description:
    "Este es un post de ejemplo que demuestra todas las características del sistema de blog con remark, incluyendo sintaxis highlighting, tabla de contenidos y metadatos.",
  date: "2025-01-15",
  author: "Héctor Labra",
  tags: ["desarrollo", "blog", "remark", "markdown"],
  category: "Desarrollo",
  featured: true,
  published: true,
  slug: "mi-primer-post",
};

// Componente de tabla simple
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse border border-white/10 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-white/5">
            {headers.map((header, i) => (
              <th
                key={i}
                className="text-left px-4 py-3 text-white font-semibold border-b border-white/10"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/10 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#e2e2e2]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MiPrimerPostContent() {
  return (
    <>
      <Paragraph>
        ¡Bienvenidos al nuevo blog! Este es un post de ejemplo que demuestra
        todas las funcionalidades implementadas en nuestro sistema de blog.
      </Paragraph>

      <Heading level={2} id="que-incluye-este-sistema">
        ¿Qué incluye este sistema?
      </Heading>

      <Paragraph>
        Nuestro blog incluye las siguientes características:
      </Paragraph>

      <Heading level={3} id="procesamiento-markdown">
        Procesamiento de Markdown
      </Heading>

      <List
        items={[
          <>
            <strong className="text-white">Remark</strong> para procesamiento de
            markdown
          </>,
          <>
            <strong className="text-white">Rehype</strong> para transformaciones
            HTML
          </>,
          <>
            <strong className="text-white">Gray-matter</strong> para frontmatter
          </>,
          <>
            <strong className="text-white">Syntax highlighting</strong> con
            Prism
          </>,
        ]}
      />

      <Heading level={3} id="caracteristicas-frontend">
        Características del Frontend
      </Heading>

      <List
        ordered
        items={[
          <>
            <strong className="text-white">Diseño responsivo</strong> con
            Tailwind CSS
          </>,
          <>
            <strong className="text-white">Tabla de contenidos</strong>{" "}
            automática
          </>,
          <>
            <strong className="text-white">Navegación inteligente</strong> entre
            secciones
          </>,
          <>
            <strong className="text-white">Metadatos SEO</strong> optimizados
          </>,
        ]}
      />

      <Heading level={2} id="ejemplo-de-codigo">
        Ejemplo de Código
      </Heading>

      <Paragraph>
        Aquí tienes algunos ejemplos de código con syntax highlighting:
      </Paragraph>

      <Heading level={3} id="javascript">
        JavaScript
      </Heading>

      <CodeBlock
        language="javascript"
        code={`// Función para procesar markdown
async function processMarkdown(content) {
  const result = await markdownProcessor.process(content);
  return result.toString();
}

// Uso con async/await
const htmlContent = await processMarkdown(markdownContent);
console.log("Contenido procesado:", htmlContent);`}
      />

      <Heading level={3} id="typescript">
        TypeScript
      </Heading>

      <CodeBlock
        language="typescript"
        code={`interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  content: string;
  excerpt: string;
}

// Función tipada para obtener posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));

  return posts
    .filter((post): post is BlogPost => post !== null && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}`}
      />

      <Heading level={3} id="css">
        CSS
      </Heading>

      <CodeBlock
        language="css"
        code={`/* Estilos para el blog */
.prose {
  @apply text-foreground;
}

.prose h1,
.prose h2,
.prose h3 {
  @apply text-accent-green;
}

.prose code {
  @apply bg-muted px-2 py-1 rounded text-accent-yellow;
}`}
      />

      <Heading level={2} id="lista-caracteristicas">
        Lista de Características
      </Heading>

      <Paragraph>El sistema incluye:</Paragraph>

      <List
        items={[
          "✅ Procesamiento completo de markdown",
          "✅ Tabla de contenidos automática",
          "✅ Syntax highlighting",
          "✅ SEO optimizado",
          "✅ Diseño responsive",
          "✅ Navegación inteligente",
          "✅ Posts destacados",
          "✅ Sistema de tags y categorías",
        ]}
      />

      <Heading level={2} id="citas-blockquotes">
        Citas y Blockquotes
      </Heading>

      <Blockquote>
        "El mejor momento para plantar un árbol fue hace 20 años. El segundo
        mejor momento es ahora."
        <br />
        <br />— Proverbio chino
      </Blockquote>

      <Blockquote>
        <strong className="text-white">Nota importante:</strong> Este blog
        utiliza generación estática con Next.js para optimizar el rendimiento y
        SEO.
      </Blockquote>

      <Heading level={2} id="tablas">
        Tablas
      </Heading>

      <Table
        headers={["Característica", "Estado", "Prioridad"]}
        rows={[
          ["Markdown processing", "✅ Completado", "Alta"],
          ["Syntax highlighting", "✅ Completado", "Alta"],
          ["SEO optimization", "✅ Completado", "Media"],
          ["Comments system", "⏳ Pendiente", "Baja"],
        ]}
      />

      <Heading level={2} id="conclusion">
        Conclusión
      </Heading>

      <Paragraph>Este sistema de blog está diseñado para ser:</Paragraph>

      <List
        ordered
        items={[
          <>
            <strong className="text-white">Rápido</strong> - Generación estática
          </>,
          <>
            <strong className="text-white">Flexible</strong> - Fácil de extender
          </>,
          <>
            <strong className="text-white">Mantenible</strong> - Código limpio y
            tipado
          </>,
          <>
            <strong className="text-white">Escalable</strong> - Preparado para
            crecer
          </>,
        ]}
      />

      <Paragraph>¡Espero que disfrutes explorando el contenido! 🚀</Paragraph>

      <hr className="border-white/10 my-12" />

      <Paragraph>
        <strong className="text-white">¿Te gusta este post?</strong> Compártelo
        en tus redes sociales y ayuda a otros desarrolladores a descubrir
        contenido útil.
      </Paragraph>
    </>
  );
}
