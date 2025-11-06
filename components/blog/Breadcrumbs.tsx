import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogPost } from "@/lib/types/blog";

interface BreadcrumbsProps {
  post: BlogPost;
}

export function Breadcrumbs({ post }: BreadcrumbsProps) {
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}`, current: true },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-white/30"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-white/50 text-xs line-clamp-1 max-w-[150px] sm:max-w-[250px] md:max-w-none"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-white/60 hover:text-accent-green transition-colors text-xs font-medium"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: crumb.label,
              item: `${
                process.env.NEXT_PUBLIC_SITE_URL || "https://hectorlabra.dev"
              }${crumb.href}`,
            })),
          }),
        }}
      />
    </>
  );
}
