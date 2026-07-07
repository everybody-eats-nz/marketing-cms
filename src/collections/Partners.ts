import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'friendCategory', 'displayOrder', 'updatedAt'],
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
      admin: {
        description:
          'Major = large logo with a hover blurb. Supporting = medium logo. Friend = name-only link, grouped by the category below.',
      },
      options: [
        { label: 'Major partner', value: 'major' },
        { label: 'Supporting partner', value: 'supporting' },
        { label: 'Friend of Everybody Eats', value: 'friend' },
      ],
    },
    {
      name: 'friendCategory',
      type: 'select',
      admin: {
        description: 'Which Friends heading this sits under. Only used when the tier is Friend.',
        condition: (data) => data?.tier === 'friend',
      },
      options: [
        { label: 'Food & Hospitality', value: 'food-hospitality' },
        { label: 'Community', value: 'community' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Logo on a transparent background, at least 800px wide. Shown uncropped on a white card. Used for Major and Supporting partners; Friends are name-only.',
        condition: (data) => data?.tier !== 'friend',
      },
    },
    { name: 'url', type: 'text', admin: { description: 'Link through to the partner’s website.' } },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Short blurb about the partnership. Shown in the hover/focus info box on Major partners.',
        condition: (data) => data?.tier === 'major',
      },
    },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
