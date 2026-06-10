import type { Metadata } from 'next'
import Link from 'next/link'
import { getStripeClient } from '@/lib/stripe'
import { PaySection } from '../pay-section'

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false },
}

type SearchParams = { searchParams: Promise<{ session_id?: string }> }

type PaymentSummary = { amount: number; locationName?: string }

// Confirm the payment server-side so the page never claims success for a
// session that wasn't actually paid. Any failure falls back to a generic
// (amount-less) thank you rather than an error — the diner has done their bit.
async function fetchPaymentSummary(sessionId?: string): Promise<PaymentSummary | null> {
  const stripe = getStripeClient()
  if (!stripe || !sessionId) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' || !session.amount_total) return null
    return {
      amount: session.amount_total / 100,
      locationName: session.metadata?.locationName || undefined,
    }
  } catch {
    return null
  }
}

export default async function PayThanksPage({ searchParams }: SearchParams) {
  const { session_id } = await searchParams
  const summary = await fetchPaymentSummary(session_id)

  return (
    <PaySection glow="sun">
      <div className="container-tight relative pt-24 sm:pt-32 pb-24 text-cream-50 text-center">
        <p className="eyebrow text-sun-200/90 mb-6">Pay what you feel</p>
        <h1 className="display text-6xl sm:text-8xl font-light leading-[0.92]">
          Thank <em className="text-sun-200">you</em>
        </h1>

        <p className="mt-8 max-w-md mx-auto text-lg text-cream-50/85 leading-relaxed">
          {summary ? (
            <>
              Your <span className="display text-sun-200">${summary.amount.toLocaleString('en-NZ')}</span>
              {summary.locationName && summary.locationName !== 'Special event' ? (
                <> goes straight back into the kitchen at {summary.locationName}</>
              ) : (
                <> goes straight back into the kitchen</>
              )}
              {' '}— rescuing food, training chefs, and keeping seats at the table for everyone.
            </>
          ) : (
            <>
              Your contribution goes straight back into the kitchen — rescuing food, training
              chefs, and keeping seats at the table for everyone.
            </>
          )}
        </p>

        {summary && (
          <p className="mt-4 text-sm text-cream-50/60">
            A receipt is on its way to your email from Stripe.
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link href="/dine-with-us" className="btn-accent">
            Book your next dinner
          </Link>
          <Link
            href="/get-involved"
            className="btn border border-cream-50/40 text-cream-50 hover:bg-surface hover:text-content"
          >
            Other ways to help
          </Link>
        </div>

        <p className="display mt-16 text-xl text-cream-50/50 font-light">
          <em>See you at the table again soon.</em>
        </p>
      </div>
    </PaySection>
  )
}
