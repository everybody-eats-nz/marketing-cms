import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  imageURL: '/block-previews/testimonials.jpg',
  imageAltText: 'Testimonial quotes',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Optional. Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Quote', plural: 'Quotes' },
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        {
          name: 'attribution',
          type: 'text',
          admin: { description: 'e.g. "Diner, Wellington"' },
        },
      ],
    },
  ],
}
