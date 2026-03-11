'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RsvpRow } from '@/lib/supabase/types'
import { useAuth } from '@/components/dashboard/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Users, UserCheck, UserX } from 'lucide-react'

export default function DashboardEventosPage() {
  const { allowedEvents } = useAuth()
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })
      setRsvps((data as RsvpRow[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  // Group RSVPs by event
  const eventStats = useMemo(() => {
    const grouped: Record<string, { total: number; confirmed: number; declined: number }> = {}

    for (const r of rsvps) {
      if (!grouped[r.event_id]) {
        grouped[r.event_id] = { total: 0, confirmed: 0, declined: 0 }
      }
      grouped[r.event_id].total++
      if (r.data.attendance === 'yes') grouped[r.event_id].confirmed++
      if (r.data.attendance === 'no') grouped[r.event_id].declined++
    }

    // Map to array with friendly names
    return Object.entries(grouped).map(([eventId, stats]) => {
      const evt = allowedEvents.find(e => e.event_id === eventId)
      return {
        eventId,
        name: evt?.event_name ?? eventId.replace(/^demo-/, '').replaceAll('-', ' '),
        ...stats,
      }
    }).sort((a, b) => b.total - a.total)
  }, [rsvps, allowedEvents])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eventos</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : eventStats.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay eventos con confirmaciones todavía</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventStats.map((evt) => (
            <Card key={evt.eventId} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg capitalize">{evt.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{evt.eventId}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{evt.total} RSVPs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {evt.confirmed} sí
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-500" />
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      {evt.declined} no
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
