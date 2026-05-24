'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { Card } from '@/components/ui/card'
import type { PageAnalyticsRow } from '@/lib/supabase/types'
import { Eye, Clock, Target, MapPin, TrendingUp, BarChart2, Users } from 'lucide-react'

interface AnalyticsChartsProps {
  analytics: PageAnalyticsRow[]
  rsvpsCount: number
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}m ${String(sec).padStart(2, '0')}s`
}

const SECTION_LABELS: Record<string, string> = {
  'section-hero':   'Hero / Portada',
  'section-agenda': 'Agenda del evento',
  'section-mapa':   'Mapa interactivo',
  'section-trivia': 'Trivia corporativa',
  'section-rsvp':   'Formulario RSVP',
}
const SECTION_ORDER = ['section-hero', 'section-agenda', 'section-mapa', 'section-trivia', 'section-rsvp']

const DEVICE_CONFIG = [
  { label: 'Móvil',      key: 'mobile',  color: '#7C3AED' },
  { label: 'Escritorio', key: 'desktop', color: '#2EFFA9' },
  { label: 'Tablet',     key: 'tablet',  color: '#A78BFA' },
]

export function AnalyticsCharts({ analytics, rsvpsCount }: AnalyticsChartsProps) {
  const metrics = useMemo(() => {
    if (analytics.length === 0) return null

    const totalSessions = analytics.length
    const avgTime = Math.round(analytics.reduce((s, r) => s + r.time_spent_seconds, 0) / totalSessions)
    const totalMapClicks = analytics.reduce((s, r) => s + r.map_clicks, 0)
    const conversionRate = totalSessions > 0 ? Math.round((rsvpsCount / totalSessions) * 100) : 0

    // % of sessions that scrolled past each section
    const sectionEngagement = SECTION_ORDER.map(id => ({
      label: SECTION_LABELS[id],
      pct: Math.round((analytics.filter(r => r.sections_viewed.includes(id)).length / totalSessions) * 100),
    }))

    // Device breakdown
    const deviceCounts: Record<string, number> = {}
    analytics.forEach(r => { deviceCounts[r.device_type] = (deviceCounts[r.device_type] ?? 0) + 1 })
    const devices = DEVICE_CONFIG.map(d => ({
      ...d,
      pct: Math.round(((deviceCounts[d.key] ?? 0) / totalSessions) * 100),
      count: deviceCounts[d.key] ?? 0,
    }))

    // Last 7 days activity
    const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const now = new Date()
    const timeline = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().slice(0, 10)
      return {
        day: DAY_NAMES[date.getDay()],
        visits: analytics.filter(r => r.created_at.slice(0, 10) === dateStr).length,
      }
    })

    return { totalSessions, avgTime, totalMapClicks, conversionRate, sectionEngagement, devices, timeline }
  }, [analytics, rsvpsCount])

  if (!metrics) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">Sin datos de analytics todavía</p>
        <p className="text-sm mt-2">Los datos aparecerán en cuanto alguien visite la invitación</p>
      </div>
    )
  }

  const chartConfig = { visits: { label: 'Visitas', color: '#7C3AED' } }

  const kpiCards = [
    { icon: Eye,    value: metrics.totalSessions,              label: 'Aperturas totales'    },
    { icon: Clock,  value: formatSeconds(metrics.avgTime),     label: 'Tiempo medio en app'  },
    { icon: Target, value: `${metrics.conversionRate}%`,       label: 'Tasa conversión RSVP' },
    { icon: MapPin, value: metrics.totalMapClicks,             label: 'Clics en mapa'        },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <Card key={i} className="p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold tabular-nums">{kpi.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Section Engagement + 7-day chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Engagement por sección
          </h3>
          <div className="space-y-4">
            {metrics.sectionEngagement.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 rounded-2xl">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Actividad últimos 7 días
          </h3>
          <ChartContainer config={chartConfig} className="h-40 w-full">
            <AreaChart data={metrics.timeline} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e5e7eb' }}
                formatter={(value: number) => [`${value} visitas`, '']}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#dashGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#7C3AED' }}
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Device breakdown */}
      <Card className="p-6 rounded-2xl">
        <h3 className="font-semibold mb-5 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Dispositivos ({metrics.totalSessions} sesiones)
        </h3>
        <div className="space-y-3">
          {metrics.devices.map(device => (
            <div key={device.key} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: device.color }} />
              <span className="text-sm text-muted-foreground w-24">{device.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${device.pct}%`, backgroundColor: device.color }}
                />
              </div>
              <span className="text-sm font-semibold w-8 text-right">{device.pct}%</span>
              <span className="text-xs text-muted-foreground">({device.count})</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
