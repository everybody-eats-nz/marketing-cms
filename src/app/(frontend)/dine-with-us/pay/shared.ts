// Shared structural config for the pay-at-table flow.
//
// Diners tap an NFC tag (or scan a QR code as backup) at the table after
// dinner, pick the restaurant they ate at, then choose an amount and pay
// without leaving the site — the card form is Stripe's embedded Payment
// Element, settled via a PaymentIntent created in /api/donate/create-intent.
// "Other" lets the diner type their own koha.
//
// The editable copy and preset amounts live in the `pay-settings` global —
// see src/lib/pay-copy.ts (resolved via getPayCopy). Only the structural bits
// that aren't content (and must stay in sync with URLs / the server) live here.

// Diners at pop-ups and one-off dinners don't belong to a restaurant in the
// Locations collection — this pseudo-location keeps the old "Special Events"
// option from the Webflow flow working. The slug is structural (it appears in
// URLs and is matched server-side), so it stays in code rather than the CMS.
export const SPECIAL_EVENTS = {
  slug: 'special-events',
  name: 'A special event',
} as const
