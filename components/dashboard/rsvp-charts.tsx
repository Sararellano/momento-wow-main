'use client'

import { useMemo } from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import type { RsvpRow } from '@/lib/supabase/types'

interface RsvpChartsProps {
  rsvps: RsvpRow[]
}

const barConfig: ChartConfig = {
  count: { label: 'RSVPs', color: 'oklch(0.65 0.2 300)' },
}

const pieConfig: ChartConfig = {
  confirmed: { label: 'Asistirán', color: '#22c55e' },
  declined: { label: 'No asistirán', color: '#ef4444' },
  unknown: { label: 'Sin respuesta', color: '#94a3b8' },
}

const PIE_COLORS = ['#22c55e', '#ef4444', '#94a3b8']

export function RsvpCharts({ rsvps }: RsvpChartsProps) {
  // Bar chart: RSVPs per event
  const barData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of rsvps) {
      const name = r.event_id.replace(/^demo-/, '').replaceAll('-', ' ')
      counts[name] = (counts[name] ?? 0) + 1
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [rsvps])

  // Donut chart: attendance breakdown
  const pieData = useMemo(() => {
    let confirmed = 0
    let declined = 0
    let unknown = 0
    for (const r of rsvps) {
      if (r.data.attendance === 'yes') confirmed++
      else if (r.data.attendance === 'no') declined++
      else unknown++
    }
    return [
      { name: 'Asistirán', value: confirmed },
      { name: 'No asistirán', value: declined },
      { name: 'Sin respuesta', value: unknown },
    ].filter(d => d.value > 0)
  }, [rsvps])

  if (rsvps.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar chart */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">RSVPs por evento</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig} className="h-64 w-full">
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="oklch(0.65 0.2 300)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Donut chart */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieConfig} className="h-64 w-full">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
