// Minimal Campaign Monitor (createsend) client — just the newsletter-subscribe
// call used by the thank-you page. Ported from the volunteer portal's
// CampaignMonitorService (web/src/lib/services/campaign-monitor.ts), trimmed to
// the one operation this app needs.
//
// Auth is HTTP Basic with the API key as the username and any non-empty
// password ("x"), per the createsend API. Set CAMPAIGN_MONITOR_API_KEY to
// enable; without it, isConfigured() is false and the API route reports the
// feature as unavailable rather than silently pretending to subscribe.

const BASE_URL = 'https://api.createsend.com/api/v3.3'

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:x`).toString('base64')}`
}

export function isCampaignMonitorConfigured(): boolean {
  return !!process.env.CAMPAIGN_MONITOR_API_KEY
}

// Subscribe (or resubscribe) an email to a Campaign Monitor list. Returns a
// simple success flag; the caller decides how to surface failures.
export async function subscribeToList(params: {
  listId: string
  email: string
  name?: string
}): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.CAMPAIGN_MONITOR_API_KEY
  if (!apiKey) {
    return { success: false, message: 'Campaign Monitor is not configured.' }
  }

  try {
    const response = await fetch(`${BASE_URL}/subscribers/${params.listId}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader(apiKey),
      },
      body: JSON.stringify({
        EmailAddress: params.email,
        Name: params.name?.trim() || params.email,
        Resubscribe: true,
        RestartSubscriptionBasedAutoresponders: false,
        ConsentToTrack: 'Yes',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Campaign Monitor API error: ${response.status} - ${errorText}`)
    }

    await response.text()
    return { success: true, message: `Subscribed ${params.email}` }
  } catch (error) {
    console.error('Campaign Monitor subscribe error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
