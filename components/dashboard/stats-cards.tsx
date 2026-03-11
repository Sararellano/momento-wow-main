'use client'

import { Users, UserCheck, UserX, UsersRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RsvpRow } from '@/lib/supabase/types'

interface StatsCardsProps {
  rsvps: RsvpRow[]
}

export function StatsCards({ rsvps }: StatsCardsProps) {
  const total = rsvps.length
  const confirmed = rsvps.filter(r => r.data.attendance === 'yes').length
  const declined = rsvps.filter(r => r.data.attendance === 'no').length
  const totalGuests = rsvps.reduce((sum, r) => {
    const guests = Number(r.data.guests) || 1
    return sum + guests
  }, 0)

  const stats = [
    {
      title: 'Total RSVPs',
      value: total,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Asistirán',
      value: confirmed,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'No asistirán',
      value: declined,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total invitados',
      value: totalGuests,
      icon: UsersRound,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
