'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import type { RsvpRow } from '@/lib/supabase/types'
import { useAuth } from '@/components/dashboard/auth-provider'
import { EventSelector } from '@/components/dashboard/event-selector'
import { RsvpTable } from '@/components/dashboard/rsvp-table'
import { CsvExportButton } from '@/components/dashboard/csv-export-button'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardRsvpsPage() {
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

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('rsvps-table')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, (payload) => {
        const newRsvp = payload.new as RsvpRow
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
        <h1 className="text-2xl font-bold">Confirmaciones</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <EventSelector value={selectedEvent} onChange={setSelectedEvent} />
          <CsvExportButton rsvps={rsvps} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : (
        <RsvpTable rsvps={rsvps} />
      )}
    </div>
  )
}
