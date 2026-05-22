import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'richText',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'tight',
      options: [
        { label: 'Tight (prose column)', value: 'tight' },
        { label: 'Wide (full content area)', value: 'wide' },
      ],
    },
  ],
}
