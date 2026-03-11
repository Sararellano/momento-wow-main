'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/supabase/types'

interface AuthContextValue {
  session: Session | null
  user: User | null
  role: UserRole | null
  isAdmin: boolean
  allowedEventIds: string[]
  allowedEvents: { event_id: string; event_name: string }[]
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [allowedEventIds, setAllowedEventIds] = useState<string[]>([])
  const [allowedEvents, setAllowedEvents] = useState<{ event_id: string; event_name: string }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async (userId: string) => {
    // Fetch role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    const userRole = (roleData?.role as UserRole) ?? 'client'
    setRole(userRole)

    // Fetch allowed events for clients
    if (userRole === 'client') {
      const { data: events } = await supabase
        .from('event_owners')
        .select('event_id, event_name')
        .eq('user_id', userId)

      const evts = events ?? []
      setAllowedEvents(evts)
      setAllowedEventIds(evts.map(e => e.event_id))
    } else {
      // Admin sees all events — fetch distinct event_ids from rsvps
      const { data: rsvps } = await supabase
        .from('rsvps')
        .select('event_id')

      const uniqueEvents = [...new Set((rsvps ?? []).map(r => r.event_id))]
      setAllowedEventIds(uniqueEvents)
      setAllowedEvents(uniqueEvents.map(id => ({ event_id: id, event_name: id })))
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchUserData(s.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchUserData(s.user.id).finally(() => setLoading(false))
      } else {
        setRole(null)
        setAllowedEventIds([])
        setAllowedEvents([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUserData])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{
      session,
      user,
      role,
      isAdmin: role === 'admin',
      allowedEventIds,
      allowedEvents,
      loading,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
