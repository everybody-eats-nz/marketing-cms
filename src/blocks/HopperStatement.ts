import type { Block } from 'payload'

/** A quiet Hopper-branded section: eyebrow, big statement, supporting copy, optional link. */
export const HopperStatement: Block = {
  slug: 'hopperStatement',
  labels: { singular: 'Hopper statement', plural: 'Hopper statements' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'textarea', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
