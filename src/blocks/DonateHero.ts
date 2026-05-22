import type { Block } from 'payload'

export const DonateHero: Block = {
  slug: 'donateHero',
  labels: { singular: 'Donate hero', plural: 'Donate heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    { name: 'subheading', type: 'textarea' },
    { name: 'panelLabel', type: 'text', defaultValue: 'A one-off gift' },
    {
      name: 'amounts',
      type: 'array',
      labels: { singular: 'Amount', plural: 'Amounts' },
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'amount', type: 'number', required: true, admin: { description: 'e.g. 20 (whole dollars)' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "1 meal"' } },
      ],
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Donate now →' },
    {
      name: 'ctaHref',
      type: 'text',
      admin: { description: 'Optional. Falls back to Site Settings → donateUrl.' },
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
