import type { Block } from 'payload'

export const PartnersGrid: Block = {
  slug: 'partnersGrid',
  labels: { singular: 'Partners grid', plural: 'Partners grids' },
  admin: { group: 'Lists' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    { name: 'viewAllLabel', type: 'text' },
    { name: 'viewAllHref', type: 'text' },
  ],
}
