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
    { name: 'image', type: 'upload', relationTo: 'media' },
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
