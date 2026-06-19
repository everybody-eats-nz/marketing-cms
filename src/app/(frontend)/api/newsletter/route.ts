import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isCampaignMonitorConfigured, subscribeToList } from '@/lib/campaign-monitor'
import { getNewsletterListId } from '@/lib/newsletter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(100).optional(),
})

// Subscribes a reader to the website newsletter via Campaign Monitor (a single
// public list — no region split). Returns a friendly error (not a fake success)
// when the API key isn't configured, so we never tell someone they're
// subscribed when they're not.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = NewsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }
  const { email, name } = parsed.data

  if (!isCampaignMonitorConfigured()) {
    return NextResponse.json(
      { error: 'Newsletter sign-up isn’t available right now. Please try again later.' },
      { status: 503 },
    )
  }

  const listId = getNewsletterListId()
  if (!listId) {
    return NextResponse.json(
      { error: 'Newsletter sign-up isn’t available right now. Please try again later.' },
      { status: 503 },
    )
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
