import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { classifyFeedback } from '@/lib/sentiment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FeedbackSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  name: z.string().trim().max(100).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  consentToDisplay: z.coerce.boolean().optional(),
  locationSlug: z.string().trim().max(100).optional(),
  locationName: z.string().trim().max(200).optional(),
  stripePaymentIntentId: z.string().trim().max(255).optional(),
})

// Accepts a diner comment, classifies its sentiment with AI, and stores it.
// A comment is auto-published (shown publicly on restaurant pages and via the
// portal feed) only when the AI judges it positive AND the diner consented to
// public display. Everything else lands in "pending" for staff to review.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = FeedbackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please write a short comment first.' }, { status: 400 })
  }
  const input = parsed.data

  const { sentiment, reason } = await classifyFeedback(input.message, input.rating)

  const published = sentiment === 'positive' && input.consentToDisplay === true
  const status: 'published' | 'pending' = published ? 'published' : 'pending'

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'feedback',
      data: {
        message: input.message,
        name: input.name || undefined,
        rating: input.rating,
        consentToDisplay: input.consentToDisplay === true,
        sentiment,
        sentimentReason: reason,
        status,
        locationSlug: input.locationSlug || undefined,
        locationName: input.locationName || undefined,
        stripePaymentIntentId: input.stripePaymentIntentId || undefined,
        source: 'pay-flow',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Could not save your note. Please try again.' }, { status: 502 })
  }

  // `published` tells the client whether the note will appear publicly, so it
  // can thank the diner appropriately. We never reveal the sentiment itself.
  return NextResponse.json({ ok: true, published })
}
