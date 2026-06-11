import type { Block } from 'payload'

export const Pillars: Block = {
  slug: 'pillars',
  labels: { singular: 'Pillars section', plural: 'Pillars sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* to italicise it.' },
    },
    {
      name: 'theme',
      type: 'radio',
      defaultValue: 'forest',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Forest (dark)', value: 'forest' },
        { label: 'Cream (light)', value: 'cream' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Pillar', plural: 'Pillars' },
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'illustration',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Small hand-drawn illustration shown above the title. White line art is made for the forest theme (it is inverted to ink on the cream theme).',
          },
        },
        { name: 'number', type: 'text', admin: { description: 'e.g. "01"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'copy', type: 'textarea' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn more' },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
