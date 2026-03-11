'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import type { RsvpRow } from '@/lib/supabase/types'
import { useAuth } from '@/components/dashboard/auth-provider'
import { EventSelector } from '@/components/dashboard/event-selector'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RsvpCharts } from '@/components/dashboard/rsvp-charts'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardOverviewPage() {
  const { isAdmin, allowedEventIds } = useAuth()
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(isAdmin ? 'all' : (allowedEventIds[0] ?? 'all'))

  const fetchRsvps = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('rsvps').select('*').order('created_at', { ascending: false })
    if (selectedEvent !== 'all') {
      query = query.eq('event_id', selectedEvent)
    }
    const { data } = await query
    setRsvps((data as RsvpRow[]) ?? [])
    setLoading(false)
  }, [selectedEvent])

  useEffect(() => {
    fetchRsvps()
  }, [fetchRsvps])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('rsvps-overview')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, (payload) => {
        const newRsvp = payload.new as RsvpRow
        // Only add if it matches the current filter
        if (selectedEvent === 'all' || newRsvp.event_id === selectedEvent) {
          setRsvps((prev) => [newRsvp, ...prev])
          const name = (newRsvp.data.name as string) || 'Alguien'
          toast.success(`Nueva confirmación de ${name}`)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedEvent])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Panel General</h1>
        <EventSelector value={selectedEvent} onChange={setSelectedEvent} />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          <StatsCards rsvps={rsvps} />
          <RsvpCharts rsvps={rsvps} />
        </>
      )}
    </div>
  )
}
