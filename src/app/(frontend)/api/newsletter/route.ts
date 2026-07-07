import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isCampaignMonitorConfigured, subscribeToList } from '@/lib/campaign-monitor'
import { getNewsletterListId, NEWSLETTER_LIST_KEYS } from '@/lib/newsletter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(100).optional(),
  // Which audiences to join. Omitted → general supporters, so older callers
  // (e.g. the pay thank-you page) keep working unchanged.
  lists: z.array(z.enum(NEWSLETTER_LIST_KEYS)).min(1).optional(),
})

// Subscribes a reader to one or more website newsletters via Campaign Monitor
// (Auckland Community / Wellington Community / General Supporters). Returns a
// friendly error (not a fake success) when the API key isn't configured, so we
// never tell someone they're subscribed when they're not.
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
  const listKeys = [...new Set(parsed.data.lists ?? ['general' as const])]

  if (!isCampaignMonitorConfigured()) {
    return NextResponse.json(
      { error: 'Newsletter sign-up isn’t available right now. Please try again later.' },
      { status: 503 },
    )
  }

  const listIds = listKeys.map((key) => getNewsletterListId(key)).filter((id): id is string => !!id)
  if (listIds.length !== listKeys.length) {
    return NextResponse.json(
      { error: 'Newsletter sign-up isn’t available right now. Please try again later.' },
      { status: 503 },
    )
  }

  const results = await Promise.all(
    listIds.map((listId) => subscribeToList({ listId, email, name })),
  )
  if (results.some((result) => !result.success)) {
    return NextResponse.json(
      { error: 'We couldn’t sign you up just now. Please try again later.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
