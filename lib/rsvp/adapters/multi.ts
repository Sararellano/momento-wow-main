// Fan-out adapter: sends RSVP data to all configured destinations
import type { RSVPSubmissionAdapter } from '../types'
import { submitToGoogleSheets } from './google-sheets'
import { submitToSupabase } from './supabase'

export async function submitRSVP(
  adapter: RSVPSubmissionAdapter,
  eventId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const promises: Promise<{ success: boolean; error?: string }>[] = []

  if (
    (adapter.type === 'google-sheets' || adapter.type === 'both') &&
    adapter.googleScriptUrl
  ) {
    promises.push(submitToGoogleSheets(adapter.googleScriptUrl, eventId, data))
  }

  if (
    (adapter.type === 'supabase' || adapter.type === 'both') &&
    adapter.supabaseUrl &&
    adapter.supabaseAnonKey &&
    adapter.supabaseTable
  ) {
    promises.push(
      submitToSupabase(adapter.supabaseUrl, adapter.supabaseAnonKey, adapter.supabaseTable, eventId, data)
    )
  }

  // If no adapter configured, just succeed (demo mode)
  if (promises.length === 0) {
    return { success: true }
  }

  const results = await Promise.allSettled(promises)
  const anySuccess = results.some(
    r => r.status === 'fulfilled' && r.value.success
  )

  return anySuccess
    ? { success: true }
    : { success: false, error: 'Error al enviar. Inténtalo de nuevo.' }
}
