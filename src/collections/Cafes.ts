import type { CollectionConfig } from 'payload'
import { linkGroup } from '../fields/link'
import { slugField } from '../fields/slug'

// Cafés are a lightweight sibling to Locations. Unlike restaurants they don't
// get a generated detail page under /dine-with-us/[slug] — each café just links
// through to an existing bespoke page (e.g. the Hopper one-pager at /hopper).
// So this collection only carries what a listing card needs plus that link.
export const Cafes: CollectionConfig = {
  slug: 'cafes',
  labels: { singular: 'Café', plural: 'Cafés' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'openStatus', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ from: 'name', description: 'Stable identifier used for seeding, e.g. "hopper". Not a public URL.' }),
    { name: 'city', type: 'text', admin: { description: 'e.g. "Wellington"' } },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'One-line description shown on the café card.' },
    },
    {
      name: 'openStatus',
      label: 'Status',
      type: 'select',
      admin: { description: 'Leave blank to show no status badge.' },
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Coming soon', value: 'coming-soon' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Portrait-friendly image, at least 1400px wide. Fills the café card.',
      },
    },
    linkGroup({
      name: 'link',
      admin: {
        hideGutter: true,
        description: 'Where the café card links to, e.g. the internal /hopper page.',
      },
    }),
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
}
