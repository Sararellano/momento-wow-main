'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 flex-col border-r p-4 gap-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2 mt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
