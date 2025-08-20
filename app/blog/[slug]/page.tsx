import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog-utils';
import { buildTableOfContents } from '@/lib/blog-utils';
import { PostLayout } from '@/components/blog/PostLayout';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  // Obtener el contenido markdown original para la tabla de contenidos
  const fullPath = path.join(process.cwd(), 'content/posts', `${params.slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  const tableOfContents = buildTableOfContents(content);

  return (
    <PostLayout post={post} tableOfContents={tableOfContents}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </PostLayout>
  );
}
