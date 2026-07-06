import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'displayOrder', 'updatedAt'],
    group: 'Supporters',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        { label: 'Platinum partner', value: 'platinum' },
        { label: 'Gold partner', value: 'gold' },
        { label: 'Funding partner', value: 'funding' },
        { label: 'Supporting partner', value: 'supporting' },
        { label: 'Hospitality partner', value: 'hospitality' },
        { label: 'Food partner', value: 'food' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Logo on a transparent background, at least 800px wide. Shown uncropped on a cream card, so a dark or coloured version works best.',
      },
    },
    { name: 'url', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
