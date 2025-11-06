import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BlogPost } from "@/lib/types/blog";

interface BreadcrumbsProps {
  post: BlogPost;
}

export function Breadcrumbs({ post }: BreadcrumbsProps) {
  const breadcrumbs = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Blog", href: "/blog" },
    {
      label: post.category,
      href: `/blog?category=${encodeURIComponent(post.category)}`,
    },
    { label: post.title, href: `/blog/${post.slug}`, current: true },
  ];

  // Truncar título si es muy largo
  const truncateTitle = (title: string, maxLength: number = 50) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const Icon = crumb.icon;
            const displayLabel = isLast
              ? truncateTitle(crumb.label)
              : crumb.label;

            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight
                    className="h-3 w-3 text-white/40"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-white/90 font-medium line-clamp-1 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                    aria-current="page"
                  >
                    {Icon && (
                      <Icon
                        className="inline h-3 w-3 mr-1"
                        aria-hidden="true"
                      />
                    )}
                    {displayLabel}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-accent-green transition-colors flex items-center"
                  >
                    {Icon && (
                      <Icon className="h-3 w-3 mr-1" aria-hidden="true" />
                    )}
                    {displayLabel}
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
