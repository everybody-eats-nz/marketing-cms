import type { Block } from 'payload'

export const Process: Block = {
  slug: 'process',
  labels: { singular: 'Process steps', plural: 'Process steps' },
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
      labels: { singular: 'Step', plural: 'Steps' },
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', admin: { description: 'e.g. "01"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'copy', type: 'textarea' },
      ],
    },
  ],
}
