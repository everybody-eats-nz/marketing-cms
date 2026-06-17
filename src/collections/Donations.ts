import type { CollectionConfig } from 'payload'

// A ledger of donations taken through the on-site embedded Stripe flow
// (/dine-with-us/pay). Rows are written server-side by the Stripe webhook and,
// as a safety net, by the /thanks page — both go through getPayloadClient()
// (overrideAccess defaults to true), so no public create/update access is
// granted here. The Stripe dashboard remains the source of truth for money;
// this table exists for on-site receipts, reporting, and linking feedback to a
// gift. Records are keyed by the Stripe PaymentIntent id (unique) so the two
// writers upsert the same row instead of duplicating it.
export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'stripePaymentIntentId',
    defaultColumns: ['amount', 'status', 'locationName', 'email', 'createdAt'],
    group: 'Giving',
    description: 'Donations taken through the on-site pay-what-you-feel flow.',
  },
  // No access overrides → admin-only. Server writes use the local API, which
  // bypasses access control; the public never reads or writes this collection.
  fields: [
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stripe PaymentIntent id (pi_…) — the dedupe key.' },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: { description: 'Amount given, in dollars (NZD).' },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'nzd',
      admin: { description: 'ISO currency code. Always nzd for now.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'succeeded',
      options: [
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'locationSlug',
      type: 'text',
      index: true,
      admin: { description: 'Locations collection slug, or "special-events".' },
    },
    { name: 'locationName', type: 'text' },
    {
      name: 'email',
      type: 'text',
      admin: { description: 'Receipt email captured by Stripe, if any.' },
    },
    {
      name: 'receiptUrl',
      type: 'text',
      admin: { description: 'Stripe-hosted receipt URL, if available.' },
    },
  ],
  timestamps: true,
}
