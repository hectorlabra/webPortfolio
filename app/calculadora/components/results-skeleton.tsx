"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-6 w-48 bg-white/10" />
        <Skeleton className="mx-auto h-4 w-64 bg-white/10" />
      </div>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-24 bg-white/10" />
            <Skeleton className="h-24 bg-white/10" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-72 bg-white/10" />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 bg-white/10" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
