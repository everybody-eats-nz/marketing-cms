import type { Block } from 'payload'

export const LocationsMagazine: Block = {
  slug: 'locationsMagazine',
  labels: { singular: 'Locations (magazine)', plural: 'Locations (magazine)' },
  imageURL: '/block-previews/locationsMagazine.jpg',
  imageAltText: 'Locations in a magazine-style layout',
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
