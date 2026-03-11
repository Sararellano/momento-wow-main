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
