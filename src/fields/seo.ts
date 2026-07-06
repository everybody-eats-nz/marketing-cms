import type { GroupField } from 'payload'

export const seoField: GroupField = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Defaults to page title' } },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'Aim for ~155 characters' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Social-share image — 1200×630px (or larger at the same 1.91:1 ratio)' },
    },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
  ],
}
