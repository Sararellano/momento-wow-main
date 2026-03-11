// Supabase submission adapter (Phase 2 - premium tier)
export async function submitToSupabase(
  supabaseUrl: string,
  anonKey: string,
  table: string,
  eventId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        event_id: eventId,
        created_at: new Date().toISOString(),
        data,
      }),
    })
    if (!response.ok) throw new Error('Supabase error')
    return { success: true }
  } catch {
    return { success: false, error: 'Error al enviar. Inténtalo de nuevo.' }
  }
}
