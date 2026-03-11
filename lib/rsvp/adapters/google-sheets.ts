// Google Sheets submission adapter via Google Apps Script
export async function submitToGoogleSheets(
  scriptUrl: string,
  eventId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires this from browsers
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    })
    // With no-cors we can't read the response, so assume success if no network error
    return { success: true }
  } catch {
    return { success: false, error: 'Error al enviar. Inténtalo de nuevo.' }
  }
}
