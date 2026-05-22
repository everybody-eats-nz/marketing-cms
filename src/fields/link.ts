import type { Field, GroupField } from 'payload'

export const linkGroup = (overrides?: Partial<GroupField>): GroupField => ({
  name: 'link',
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    { name: 'label', type: 'text' },
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'internal',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'External', value: 'external' },
      ],
    },
    {
      name: 'internalHref',
      type: 'text',
      admin: {
        description: 'Path on this site, e.g. /our-story',
        condition: (_, sibs) => sibs.type === 'internal',
      },
    },
    {
      name: 'externalHref',
      type: 'text',
      admin: {
        description: 'Full URL incl. https://',
        condition: (_, sibs) => sibs.type === 'external',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
      admin: { condition: (_, sibs) => sibs.type === 'external' },
    },
  ],
  ...overrides,
})

export const optionalLink: Field[] = [
  linkGroup({ name: 'link', admin: { description: 'Leave blank for no link' } }),
]
