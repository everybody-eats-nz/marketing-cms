import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripeClient } from '@/lib/stripe'
import { isRecordedSource, recordDonation } from '@/lib/donations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Stripe webhook — the authoritative writer for the donations ledger. Stripe
// POSTs payment_intent.succeeded here even if the diner closed the tab before
// the /thanks page loaded, so the record is never lost. Configure the endpoint
// (https://<site>/api/donate/webhook) in the Stripe dashboard and put its
// signing secret in STRIPE_WEBHOOK_SECRET.
export async function POST(request: Request) {
  const stripe = getStripeClient()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  // Verify against the raw body — any re-serialization breaks the signature.
  const rawBody = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed'
  ) {
    const intent = event.data.object as Stripe.PaymentIntent
    // Only record our own on-site gifts, not unrelated PaymentIntents.
    if (isRecordedSource(intent.metadata?.source)) {
      try {
        // Re-fetch with the charge expanded so we capture the receipt URL/email.
        const full = await stripe.paymentIntents.retrieve(intent.id, {
          expand: ['latest_charge'],
        })
        await recordDonation(full)
      } catch {
        // Don't 500 back to Stripe on a transient DB error — it will retry,
        // and a missed write is recoverable from the Stripe dashboard.
        return NextResponse.json({ received: true, recorded: false })
      }
    }
  }

  return NextResponse.json({ received: true })
}
