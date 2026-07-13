import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'attribution',
    defaultColumns: ['attribution', 'location', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    slugField({ from: 'attribution', description: 'Stable identifier — e.g. "wellington-diner-2024"' }),
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'attribution',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Diner, Wellington" or a person\'s name' },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      admin: { description: 'Optional — used to surface this quote on that location\'s page' },
    },
  ],
}
