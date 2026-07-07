import type { Block } from 'payload'

/** The Hopper counter list — item names set huge in the bubble face, no images. */
export const HopperMenu: Block = {
  slug: 'hopperMenu',
  labels: { singular: 'Hopper menu', plural: 'Hopper menus' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'On the counter' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'note', type: 'text', admin: { description: 'Optional aside, e.g. "changes daily".' } },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
