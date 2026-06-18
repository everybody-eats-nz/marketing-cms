import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isCampaignMonitorConfigured, subscribeToList } from '@/lib/campaign-monitor'
import { getNewsletterListId, NEWSLETTER_REGIONS } from '@/lib/newsletter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(100).optional(),
  region: z.enum(NEWSLETTER_REGIONS),
})

// Subscribes a diner to the Auckland or Wellington newsletter via Campaign
// Monitor. Mirrors the volunteer portal's subscribe flow so both apps feed the
// same lists. Returns a friendly error (not a fake success) when the API key
// isn't configured, so we never tell someone they're subscribed when they're not.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = NewsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please enter a valid email and choose a region.' },
      { status: 400 },
    )
  }
  const { email, name, region } = parsed.data

  if (!isCampaignMonitorConfigured()) {
    return NextResponse.json(
      { error: 'Newsletter sign-up isn’t available right now. Please try again later.' },
      { status: 503 },
    )
  }

  const listId = getNewsletterListId(region)
  if (!listId) {
    return NextResponse.json({ error: 'Unknown newsletter region.' }, { status: 400 })
  }

  const result = await subscribeToList({ listId, email, name })
  if (!result.success) {
    return NextResponse.json(
      { error: 'We couldn’t sign you up just now. Please try again later.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
