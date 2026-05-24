'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { PageAnalyticsRow } from '@/lib/supabase/types'
import { useAuth } from '@/components/dashboard/auth-provider'
import { EventSelector } from '@/components/dashboard/event-selector'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsPage() {
  const { isAdmin, allowedEventIds } = useAuth()
  const [analytics, setAnalytics] = useState<PageAnalyticsRow[]>([])
  const [rsvpsCount, setRsvpsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(isAdmin ? 'all' : (allowedEventIds[0] ?? 'all'))

  const fetchData = useCallback(async () => {
    setLoading(true)

    let analyticsQuery = supabase
      .from('page_analytics')
      .select('*')
      .order('created_at', { ascending: false })
    if (selectedEvent !== 'all') {
      analyticsQuery = analyticsQuery.eq('event_id', selectedEvent)
    }
    const { data: analyticsData } = await analyticsQuery
    setAnalytics((analyticsData as PageAnalyticsRow[]) ?? [])

    // Fetch RSVP count for conversion rate calculation
    let rsvpsQuery = supabase.from('rsvps').select('*', { count: 'exact', head: true })
    if (selectedEvent !== 'all') {
      rsvpsQuery = rsvpsQuery.eq('event_id', selectedEvent)
    }
    const { count } = await rsvpsQuery
    setRsvpsCount(count ?? 0)

    setLoading(false)
  }, [selectedEvent])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comportamiento real de los invitados en la invitación
          </p>
        </div>
        <EventSelector value={selectedEvent} onChange={setSelectedEvent} />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : (
        <AnalyticsCharts analytics={analytics} rsvpsCount={rsvpsCount} />
      )}
    </div>
  )
}
