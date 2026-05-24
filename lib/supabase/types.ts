export interface RsvpRow {
  id: string
  event_id: string
  created_at: string
  data: Record<string, unknown>
}

export interface EventOwnerRow {
  id: string
  user_id: string
  event_id: string
  event_name: string
  created_at: string
}

export interface UserRoleRow {
  user_id: string
  role: 'admin' | 'client'
  display_name: string | null
  created_at: string
}

export type UserRole = 'admin' | 'client'

export interface PageAnalyticsRow {
  id: string
  event_id: string
  session_id: string
  device_type: 'mobile' | 'tablet' | 'desktop'
  time_spent_seconds: number
  map_clicks: number
  sections_viewed: string[]
  created_at: string
}
