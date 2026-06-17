import type { Block } from 'payload'

export const LocationsGrid: Block = {
  slug: 'locationsGrid',
  labels: { singular: 'Locations grid', plural: 'Locations grids' },
  imageURL: '/block-previews/locationsGrid.jpg',
  imageAltText: 'Grid of restaurant locations',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* to italicise it.' },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      admin: { description: 'Optional CTA next to the heading, e.g. "All locations →"' },
    },
    { name: 'viewAllHref', type: 'text' },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { description: 'Maximum number of locations to show' },
    },
  ],
}
