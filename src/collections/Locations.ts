import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'openStatus', 'updatedAt'],
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
      admin: { description: 'e.g. "wellington", "onehunga", "glen-innes"' },
    },
    {
      name: 'openStatus',
      label: 'Status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Coming soon', value: 'coming-soon' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'tagline', type: 'text', admin: { description: 'One-line description shown on cards' } },
            { name: 'intro', type: 'textarea' },
            { name: 'body', type: 'richText' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Visit',
          fields: [
            { name: 'city', type: 'text' },
            { name: 'address', type: 'textarea' },
            {
              name: 'coordinates',
              type: 'group',
              admin: { description: 'Map pin (decimal degrees)', hideGutter: true },
              fields: [
                { name: 'lat', type: 'number', admin: { description: 'Latitude' } },
                { name: 'lng', type: 'number', admin: { description: 'Longitude' } },
              ],
            },
            {
              name: 'hours',
              type: 'array',
              labels: { singular: 'Opening hour', plural: 'Opening hours' },
              fields: [
                { name: 'label', type: 'text', admin: { description: 'e.g. "Wed – Sat"' } },
                { name: 'times', type: 'text', admin: { description: 'e.g. "5pm – 9pm"' } },
                { name: 'note', type: 'text', admin: { description: 'e.g. "Last seating 8.30pm"' } },
              ],
            },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
            {
              name: 'bookingUrl',
              type: 'text',
              admin: { description: 'Direct booking link for this location' },
            },
            {
              name: 'payAtTableUrl',
              type: 'text',
              admin: { description: 'Stripe / payment link' },
            },
          ],
        },
        {
          label: 'Story',
          fields: [
            {
              name: 'quotes',
              type: 'relationship',
              relationTo: 'quotes',
              hasMany: true,
            },
            {
              name: 'highlights',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "12,000 meals served"' } },
              ],
            },
          ],
        },
      ],
    },
    seoField,
  ],
}
