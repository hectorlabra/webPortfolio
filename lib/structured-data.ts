import { BlogPost } from './types/blog';

export function generateArticleStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `https://hectorlabra.dev/og-image-blog.jpg`, // Imagen por defecto
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://hectorlabra.dev/quien-soy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Héctor Labra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hectorlabra.dev/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hectorlabra.dev/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags,
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'es-ES',
  };
}

export function generateBlogStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog de Héctor Labra',
    description: 'Artículos sobre desarrollo, tecnología y experiencias en el mundo del software.',
    url: 'https://hectorlabra.dev/blog',
    author: {
      '@type': 'Person',
      name: 'Héctor Labra',
      url: 'https://hectorlabra.dev/quien-soy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Héctor Labra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hectorlabra.dev/logo.png',
      },
    },
    inLanguage: 'es-ES',
  };
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Héctor Labra',
    url: 'https://hectorlabra.dev',
    sameAs: [
      'https://github.com/hectorlabra',
      'https://linkedin.com/in/hectorlabra',
      'https://twitter.com/hectorlabra',
    ],
    jobTitle: 'Desarrollador Full Stack',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    description: 'Desarrollador Full Stack especializado en React, Next.js, TypeScript y tecnologías web modernas.',
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Full Stack Development',
      'Web Development',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'Universidad',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Chile',
    },
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Héctor Labra - Desarrollador Full Stack',
    description: 'Portfolio y blog personal de Héctor Labra, desarrollador Full Stack especializado en React y Next.js.',
    url: 'https://hectorlabra.dev',
    author: {
      '@type': 'Person',
      name: 'Héctor Labra',
    },
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://hectorlabra.dev/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
