'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { DashboardSkeleton } from './dashboard-skeleton'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/dashboard/login')
    }
  }, [loading, session, router])

  if (loading) return <DashboardSkeleton />
  if (!session) return null

  return <>{children}</>
}
