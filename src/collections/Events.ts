import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'location', 'updatedAt'],
    listSearchableFields: ['name', 'shortDescription'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMM yyyy h:mm a' },
      },
    },
    {
      name: 'displayTime',
      type: 'text',
      admin: { description: 'Human-readable time, e.g. "6:00pm — 9:00pm"' },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Landscape, at least 2000px wide. Cropped to 5:4 on the event page and 5:6 portrait on cards, so keep the subject centred. Also used as the social-share image.',
      },
    },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText' },
    {
      name: 'tickets',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        { name: 'priceLabel', type: 'text', admin: { description: 'e.g. "$95 per person"' } },
        { name: 'ticketUrl', type: 'text' },
        { name: 'caption', type: 'text', admin: { description: 'Small print below the CTA' } },
      ],
    },
    seoField,
  ],
}
