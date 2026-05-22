import type { GlobalConfig } from 'payload'
import { linkGroup } from '../fields/link'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Header / Navigation',
  access: { read: () => true },
  fields: [
    {
      name: 'primary',
      type: 'array',
      labels: { singular: 'Primary link', plural: 'Primary links' },
      admin: { description: 'Main nav (3–4 items max)' },
      fields: [linkGroup()],
    },
    {
      name: 'secondary',
      type: 'array',
      labels: { singular: 'Secondary link', plural: 'Secondary links' },
      admin: { description: 'Secondary nav inside the drawer / footer' },
      fields: [linkGroup()],
    },
    {
      name: 'ctas',
      type: 'group',
      label: 'Header CTAs',
      admin: { hideGutter: true },
      fields: [
        {
          name: 'bookLabel',
          type: 'text',
          defaultValue: 'Book',
        },
        {
          name: 'donateLabel',
          type: 'text',
          defaultValue: 'Donate',
        },
        {
          name: 'shopLabel',
          type: 'text',
          defaultValue: 'Shop',
        },
        { name: 'showShop', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
