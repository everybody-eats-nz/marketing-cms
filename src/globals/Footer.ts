import type { GlobalConfig } from 'payload'
import { linkGroup } from '../fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: { read: () => true },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Make a difference one plate at a time',
    },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      admin: { description: 'Up to 4 link columns' },
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [linkGroup()],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      labels: { singular: 'Legal link', plural: 'Legal links' },
      fields: [linkGroup()],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© Everybody Eats',
      admin: { description: 'Year is appended automatically' },
    },
  ],
}
