import { getPayloadClient } from './payload'
import { DEFAULT_PAY_COPY, mergePayCopy, type PayCopy } from './pay-copy'

// Server-side resolver for the donation / pay-at-table copy. Reads the
// `pay-settings` global and overlays it on DEFAULT_PAY_COPY. Resilient: any
// failure (no row, DB hiccup) falls back to the defaults so the flows never
// render blank.
export async function getPayCopy(): Promise<PayCopy> {
  try {
    const payload = await getPayloadClient()
    const global = await payload.findGlobal({ slug: 'pay-settings' }).catch(() => null)
    return mergePayCopy(global)
  } catch {
    return DEFAULT_PAY_COPY
  }
}

// Just the custom-amount guard rails, for the create-intent API route to keep
// its server-side validation in sync with what the form enforces.
export async function getAmountBounds(): Promise<{ minAmount: number; maxAmount: number }> {
  const copy = await getPayCopy()
  return { minAmount: copy.amounts.minAmount, maxAmount: copy.amounts.maxAmount }
}
