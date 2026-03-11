'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEFAULT_LABELS, type RSVPConfig } from '@/lib/rsvp/types'

interface RSVPSuccessProps {
  config: RSVPConfig
  data: Record<string, unknown>
}

// Animated success state shown after RSVP submission
export function RSVPSuccess({ config, data }: RSVPSuccessProps) {
  const labels = { ...DEFAULT_LABELS, ...config.labels }
  const isAttending = data.attendance === 'yes' || data.attending === true

  return (
    <div className="text-center py-12 space-y-6 p-8 rounded-3xl bg-card border-2 border-border">
      <div className={cn(
        'w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-bounce',
        config.theme.successIconClass ?? 'bg-mint'
      )}>
        {config.theme.successIcon ?? (
          <Heart className="w-10 h-10 text-white fill-white" />
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">
          {isAttending ? labels.successTitle : labels.declineTitle}
        </h3>
        <p className="text-muted-foreground">
          {isAttending ? labels.successMessage : labels.declineMessage}
        </p>
      </div>
    </div>
  )
}
