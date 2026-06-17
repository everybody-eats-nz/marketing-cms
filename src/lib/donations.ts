import type Stripe from 'stripe'
import { getPayloadClient } from '@/lib/payload'

// Upsert a donation row keyed by the Stripe PaymentIntent id. Called from two
// places — the Stripe webhook (authoritative) and the /thanks page (safety net
// for environments without a webhook configured) — so it must be idempotent.
// Both run server-side; the local API bypasses access control by default.
export async function recordDonation(intent: Stripe.PaymentIntent): Promise<void> {
  const payload = await getPayloadClient()

  const status: 'succeeded' | 'pending' | 'failed' =
    intent.status === 'succeeded'
      ? 'succeeded'
      : intent.status === 'canceled'
        ? 'failed'
        : 'pending'

  const latestCharge =
    typeof intent.latest_charge === 'object' && intent.latest_charge
      ? intent.latest_charge
      : null

  const data = {
    stripePaymentIntentId: intent.id,
    // Stripe amounts are in the smallest currency unit (cents).
    amount: (intent.amount_received || intent.amount) / 100,
    currency: intent.currency || 'nzd',
    status,
    locationSlug: intent.metadata?.locationSlug || undefined,
    locationName: intent.metadata?.locationName || undefined,
    email:
      intent.receipt_email ||
      latestCharge?.billing_details?.email ||
      undefined,
    receiptUrl: latestCharge?.receipt_url || undefined,
  }

  const existing = await payload.find({
    collection: 'donations',
    where: { stripePaymentIntentId: { equals: intent.id } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'donations',
      id: (existing.docs[0] as { id: string | number }).id,
      data,
    })
  } else {
    await payload.create({ collection: 'donations', data })
  }
}
