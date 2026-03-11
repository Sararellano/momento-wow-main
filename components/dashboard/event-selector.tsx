'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from './auth-provider'

interface EventSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function EventSelector({ value, onChange }: EventSelectorProps) {
  const { allowedEvents, isAdmin } = useAuth()

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-64 rounded-xl">
        <SelectValue placeholder="Seleccionar evento" />
      </SelectTrigger>
      <SelectContent>
        {isAdmin && <SelectItem value="all">Todos los eventos</SelectItem>}
        {allowedEvents.map((evt) => (
          <SelectItem key={evt.event_id} value={evt.event_id}>
            {evt.event_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
