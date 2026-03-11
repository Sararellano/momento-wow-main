'use client'

import { cn } from '@/lib/utils'
import type { RSVPFieldConfig, RSVPTheme } from '@/lib/rsvp/types'

interface AttendanceToggleProps {
  field: RSVPFieldConfig
  value: string
  onChange: (value: string) => void
  theme: RSVPTheme
}

// Reusable yes/no toggle buttons matching the pattern used across all demo pages
export function AttendanceToggle({ field, value, onChange, theme }: AttendanceToggleProps) {
  if (!field.options || field.options.length === 0) return null

  return (
    <div className="flex gap-4">
      {field.options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 py-3 px-6 rounded-xl border-2 transition-all font-medium',
            value === option.value
              ? theme.radioActiveClass ?? 'border-primary bg-primary text-primary-foreground'
              : theme.radioInactiveClass ?? 'border-border bg-background text-foreground hover:border-primary/50'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
