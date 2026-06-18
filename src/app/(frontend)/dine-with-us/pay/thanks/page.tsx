import type { Metadata } from 'next'
import Link from 'next/link'
import { getStripeClient } from '@/lib/stripe'
import { isRecordedSource, recordDonation } from '@/lib/donations'
import { getPayCopy } from '@/lib/pay-copy.server'
import { fillTemplate, formatDollars } from '@/lib/pay-copy'
import { renderRichText } from '@/components/blocks/render-text'
import { PaySection } from '../pay-section'
import { FeedbackForm } from '../feedback-form'

export async function generateMetadata(): Promise<Metadata> {
  const { thanks } = await getPayCopy()
  return { title: thanks.metaTitle, robots: { index: false } }
}

type SearchParams = {
  searchParams: Promise<{ session_id?: string; payment_intent?: string }>
}

type PaymentSummary = {
  amount: number
  locationName?: string
  locationSlug?: string
  paymentIntentId?: string
  email?: string
  // 'pay-at-table' (koha) or 'donation' — drives the koha / GST note.
  source?: string
}

// Confirm the payment server-side so the page never claims success for a
// payment that didn't actually go through. Any failure falls back to a generic
// (amount-less) thank you rather than an error — the diner has done their bit.
//
// Two entry shapes are supported:
//   - payment_intent — the embedded Payment Element flow (current).
//   - session_id     — legacy Stripe Payment Links, whose success URL used
//                      ?session_id={CHECKOUT_SESSION_ID}. Kept so old QR/NFC
//                      links keep working.
async function fetchPaymentSummary(params: {
  session_id?: string
  payment_intent?: string
}): Promise<PaymentSummary | null> {
  const stripe = getStripeClient()
  if (!stripe) return null

  if (params.payment_intent) {
    try {
      const intent = await stripe.paymentIntents.retrieve(params.payment_intent, {
        expand: ['latest_charge'],
      })
      if (intent.status !== 'succeeded') return null
      // Safety net: the webhook is the authoritative writer, but record here too
      // so a donation is logged even where no webhook is configured. Idempotent.
      if (isRecordedSource(intent.metadata?.source)) {
        try {
          await recordDonation(intent)
        } catch {
          // Logging is best-effort — never block the thank-you on it.
        }
      }
      return {
        amount: (intent.amount_received || intent.amount) / 100,
        locationName: intent.metadata?.locationName || undefined,
        locationSlug: intent.metadata?.locationSlug || undefined,
        paymentIntentId: intent.id,
        email: intent.receipt_email || undefined,
        source: intent.metadata?.source || undefined,
      }
    } catch {
      return null
    }
  }

  if (params.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(params.session_id)
      if (session.payment_status !== 'paid' || !session.amount_total) return null
      return {
        amount: session.amount_total / 100,
        locationName: session.metadata?.locationName || undefined,
        // Legacy Stripe Payment Links were the table (koha) flow.
        source: 'pay-at-table',
      }
    } catch {
      return null
    }
  }

  return null
}

export default async function PayThanksPage({ searchParams }: SearchParams) {
  const params = await searchParams
  const [summary, copy] = await Promise.all([fetchPaymentSummary(params), getPayCopy()])
  const { thanks, feedback } = copy

  // Pick the right message template, then fill in amount / location.
  const message = (() => {
    if (!summary) return thanks.messageFallback
    const amount = formatDollars(summary.amount)
    const hasLocation = summary.locationName && summary.locationName !== 'Special event'
    return hasLocation
      ? fillTemplate(thanks.messageWithLocation, { amount, location: summary.locationName! })
      : fillTemplate(thanks.messageNoLocation, { amount })
  })()

  return (
    <PaySection glow="sun">
      <div className="container-tight relative pt-24 sm:pt-32 pb-24 text-cream-50 text-center">
        <p className="eyebrow text-sun-200/90 mb-6">{thanks.eyebrow}</p>
        <h1 className="display text-6xl sm:text-8xl font-light leading-[0.92]">
          {renderRichText(thanks.heading, undefined, 'text-sun-200')}
        </h1>

        <p className="mt-8 max-w-md mx-auto text-lg text-cream-50/85 leading-relaxed">
          {renderRichText(message, undefined, 'display text-sun-200 not-italic')}
        </p>

        {summary?.email && (
          <p className="mt-4 text-sm text-cream-50/60">
            {fillTemplate(thanks.receiptNote, { email: summary.email })}
          </p>
        )}

        {/* Koha / GST clarification — pay-at-table only, never for /donate. */}
        {summary?.source === 'pay-at-table' && thanks.kohaNote && (
          <p className="mt-3 text-xs text-cream-50/45 max-w-md mx-auto leading-relaxed">
            {thanks.kohaNote}
          </p>
        )}

        {/* Optional comment — only offered once a payment is confirmed. */}
        {summary && (
          <div className="mt-12 max-w-md mx-auto">
            <FeedbackForm
              stripePaymentIntentId={summary.paymentIntentId}
              locationSlug={summary.locationSlug}
              locationName={summary.locationName}
              copy={feedback}
            />
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link href="/dine-with-us" className="btn-accent">
            {thanks.bookLabel}
          </Link>
          <Link
            href="/get-involved"
            className="btn border border-cream-50/40 text-cream-50 hover:bg-surface hover:text-content"
          >
            {thanks.otherWaysLabel}
          </Link>
        </div>

        <p className="display mt-16 text-xl text-cream-50/50 font-light">
          <em>{thanks.closing}</em>
        </p>
      </div>
    </PaySection>
  )
}
