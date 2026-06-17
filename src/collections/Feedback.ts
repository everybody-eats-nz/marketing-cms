import type { CollectionConfig } from 'payload'

// Diner feedback left after paying (an optional step on the /thanks page) or
// from a standalone form. Each submission is run through an AI sentiment
// classifier on create (see src/lib/sentiment.ts) and auto-published only when
// the sentiment is positive AND the diner consented to public display. Staff
// can override `status` in the admin at any time — those edits go straight
// through, because AI classification runs only in the /api/feedback route, not
// on admin saves. Published feedback surfaces in two places:
//   - public website: the restaurant page at /dine-with-us/[slug]
//   - volunteer portal: pulled via GET /api/public/feedback (portal → CMS)
//
// Writes happen server-side through getPayloadClient() (overrideAccess defaults
// to true), so no public create/read access is granted; the route handler at
// /api/feedback is the only public entry point and it validates input itself.
export const Feedback: CollectionConfig = {
  slug: 'feedback',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'sentiment', 'status', 'rating', 'locationName', 'createdAt'],
    group: 'Giving',
    description: 'Diner comments. AI sets sentiment; positive + consented feedback auto-publishes.',
  },
  fields: [
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { description: 'The diner’s comment.' },
    },
    {
      name: 'name',
      type: 'text',
      admin: { description: 'First name to show with the quote (optional).' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Optional 1–5 star rating.' },
    },
    {
      name: 'consentToDisplay',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Diner ticked “OK to share publicly with my first name”.' },
    },
    {
      name: 'sentiment',
      type: 'select',
      defaultValue: 'unknown',
      options: [
        { label: 'Positive', value: 'positive' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Negative', value: 'negative' },
        { label: 'Unknown (not yet classified)', value: 'unknown' },
      ],
      admin: { description: 'Set automatically by the AI classifier on submit.' },
    },
    {
      name: 'sentimentReason',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'AI’s one-line rationale for the sentiment (internal only).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Published (public)', value: 'published' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Pending review', value: 'pending' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Auto-set on submit; edit here to override what the AI decided.',
      },
    },
    {
      name: 'locationSlug',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', description: 'Locations slug, or "special-events".' },
    },
    { name: 'locationName', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', description: 'Linked donation, if left after paying.' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'pay-flow',
      options: [
        { label: 'Pay flow', value: 'pay-flow' },
        { label: 'Standalone', value: 'standalone' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
