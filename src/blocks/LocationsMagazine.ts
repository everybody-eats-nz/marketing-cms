import type { Block } from 'payload'

export const LocationsMagazine: Block = {
  slug: 'locationsMagazine',
  labels: { singular: 'Locations (magazine)', plural: 'Locations (magazine)' },
  admin: { group: 'Lists' },
  fields: [
    {
      name: 'note',
      type: 'text',
      admin: {
        description:
          'Renders all locations as an alternating magazine-style list. Use the simpler "Locations grid" block for the home-page card layout.',
      },
    },
  ],
}
