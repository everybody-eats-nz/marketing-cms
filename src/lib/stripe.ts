import Stripe from 'stripe'

let client: Stripe | null = null

/**
 * Lazily-constructed Stripe client. Returns null when STRIPE_SECRET_KEY is
 * not configured so the pay-at-table pages can render (and fail politely on
 * submit) in environments without Stripe credentials.
 */
export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!client) {
    client = new Stripe(key)
  }
  return client
}
