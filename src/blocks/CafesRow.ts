import type { Block } from 'payload'

// Renders the Cafés collection as a card row under its own header — used on the
// /dine-with-us page beneath the restaurants, so cafés sit apart from the
// pay-as-you-feel restaurants but on the same "where to find us" page. Cards
// link straight through to each café's existing page (see Cafes.ts).
export const CafesRow: Block = {
  slug: 'cafesRow',
  labels: { singular: 'Cafés row', plural: 'Cafés rows' },
  admin: { group: 'Lists' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the heading, e.g. "Also from us".' } },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Section heading. Wrap a word in *asterisks* to italicise it.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Optional supporting line shown beneath the heading.' },
    },
  ],
}
