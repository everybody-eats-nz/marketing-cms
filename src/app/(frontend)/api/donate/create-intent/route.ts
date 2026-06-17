import { NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { MAX_AMOUNT, MIN_AMOUNT } from '@/app/(frontend)/dine-with-us/pay/shared'

// Stripe's SDK needs the Node runtime (not edge).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Creates a Stripe PaymentIntent for the embedded Payment Element. The browser
// confirms the payment directly with Stripe using the returned client secret,
// so card data never touches our server (PCI scope stays minimal, SAQ A).
export async function POST(request: Request) {
  const stripe = getStripeClient()
  if (!stripe) {
    return NextResponse.json({ error: 'Payments are not configured.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { amount, locationSlug, locationName, email, source } = (body ?? {}) as {
    amount?: unknown
    locationSlug?: unknown
    locationName?: unknown
    email?: unknown
    source?: unknown
  }

  // Which on-site flow this one-off gift came from: 'pay-at-table' (a diner
  // paying for their meal, tied to a restaurant) or 'donation' (the /donate
  // page, no location). Both are recorded to the Donations ledger and kept
  // distinct in Stripe via metadata + description.
  const giftSource = source === 'donation' ? 'donation' : 'pay-at-table'

  // Email is optional. Validate with split() + a single-token whitespace check
  // (no multi-quantifier regex) so a user-supplied value can't trigger ReDoS.
  // Stripe emails its standard receipt in live mode (with customer receipts
  // enabled in the dashboard); test mode records but never sends.
  const trimmedEmail = typeof email === 'string' ? email.trim() : ''
  const [emailLocal, emailDomain, ...emailRest] = trimmedEmail.split('@')
  const receiptEmail =
    trimmedEmail.length > 0 &&
    trimmedEmail.length <= 254 &&
    emailRest.length === 0 &&
    Boolean(emailLocal) &&
    Boolean(emailDomain) &&
    emailDomain.includes('.') &&
    !/\s/.test(trimmedEmail)
      ? trimmedEmail
      : undefined

  const dollars = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(dollars) || dollars < MIN_AMOUNT || dollars > MAX_AMOUNT) {
    return NextResponse.json(
      { error: `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}.` },
      { status: 400 },
    )
  }

  // Round to cents to avoid floating-point surprises on custom amounts.
  const cents = Math.round(dollars * 100)

  const locName =
    typeof locationName === 'string' && locationName.trim() ? locationName.trim() : ''
  const slug = typeof locationSlug === 'string' ? locationSlug : ''

  try {
    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'nzd',
      automatic_payment_methods: { enabled: true },
      // Descriptive so the Stripe Payments list and receipt show context at a
      // glance (which restaurant, or a general donation); metadata below stays
      // the source of truth for filtering, exports, and reporting.
      description:
        giftSource === 'donation'
          ? 'Everybody Eats — Donation'
          : locName
            ? `Everybody Eats — ${locName}`
            : 'Everybody Eats — pay what you feel',
      ...(receiptEmail ? { receipt_email: receiptEmail } : {}),
      metadata: {
        source: giftSource,
        locationSlug: slug,
        locationName: locName,
      },
    })

    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch {
    return NextResponse.json(
      { error: 'Could not start the payment. Please try again.' },
      { status: 502 },
    )
  }
}
