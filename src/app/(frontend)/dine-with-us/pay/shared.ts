// Shared config for the pay-at-table flow.
//
// Diners tap an NFC tag (or scan a QR code as backup) at the table after
// dinner, pick the restaurant they ate at, then choose an amount and pay
// without leaving the site — the card form is Stripe's embedded Payment
// Element, settled via a PaymentIntent created in /api/donate/create-intent.
// "Other" lets the diner type their own koha.

export const PRESET_AMOUNTS: { amount: number; label: string }[] = [
  { amount: 25, label: 'Covers tonight’s meal' },
  { amount: 35, label: 'A meal, plus a little extra' },
  { amount: 50, label: 'Yours — and one paid forward' },
  { amount: 100, label: 'Feeds the whole table' },
]

// Guard rails for the custom ("Other") amount, in whole dollars. Mirrored
// server-side in /api/donate/create-intent — keep the two in sync.
export const MIN_AMOUNT = 1
export const MAX_AMOUNT = 100_000

// Diners at pop-ups and one-off dinners don't belong to a restaurant in the
// Locations collection — this pseudo-location keeps the old "Special Events"
// option from the Webflow flow working.
export const SPECIAL_EVENTS = {
  slug: 'special-events',
  name: 'A special event',
} as const
