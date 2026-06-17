import type { Block } from 'payload'

export const PartnersGrid: Block = {
  slug: 'partnersGrid',
  labels: { singular: 'Partners grid', plural: 'Partners grids' },
  imageURL: '/block-previews/partnersGrid.jpg',
  imageAltText: 'Grid of partner logos',
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
