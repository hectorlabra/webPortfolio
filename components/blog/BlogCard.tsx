import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden bg-white/5 border-white/15 transition-all hover:bg-white/8 hover:border-white/20 hover:translate-y-[-4px] shadow-lg shadow-purple-500/5 h-full cursor-pointer">
        {/* Image */}
        <div className="aspect-[5/4] w-full overflow-hidden bg-white/5 relative">
          <Image
            src={
              post.coverImage ||
              `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
                post.title
              )}`
            }
            alt={post.title}
            width={400}
            height={300}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover w-full h-full transition-all hover:scale-105"
          />
          <div className="absolute top-3 left-3 inline-block rounded-md bg-[#FFD100] px-3 py-1 text-xs font-medium text-[#0a0612]">
            {post.category}
          </div>
          {featured && (
            <div className="absolute top-3 right-3 inline-block rounded-md bg-[#64E365] px-3 py-1 text-xs font-medium text-[#0a0612]">
              Destacado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Date */}
          <div className="flex justify-end items-center">
            <p className="text-xs text-white/80">
              {new Date(post.date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>

          {/* Title */}
          <h3 className="mt-1 font-mono text-lg font-bold line-clamp-2 text-white group-hover:text-[#64E365] transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">
            {post.description}
          </p>

          {/* Author */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/15 ring-1 ring-white/20 overflow-hidden">
              <Image
                src={post.authorImage || "/placeholder.svg?height=28&width=28"}
                alt={post.author}
                width={28}
                height={28}
                className="rounded-full"
              />
            </div>
            <p className="text-xs font-medium text-white/90">{post.author}</p>
          </div>

          {/* CTA */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-[#64E365] hover:text-[#64E365]/80 font-medium"
            >
              Leer artículo <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
