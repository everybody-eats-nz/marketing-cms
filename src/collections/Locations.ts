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
      name: 'menuLocationName',
      label: 'Menu source name',
      type: 'text',
      admin: {
        description:
          'Exact, case-sensitive location name in the volunteers portal used to pull "tonight\'s menu" (e.g. "Wellington", "Onehunga", "Glen Innes"). Leave blank to use this location\'s name. Set this so renaming the display name above never breaks the menu.',
      },
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
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'tagline', type: 'text', admin: { description: 'One-line description shown on cards' } },
            { name: 'intro', type: 'textarea' },
            { name: 'body', type: 'richText' },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Landscape, at least 2000px wide. Displayed full-width behind the location page header.',
              },
            },
            {
              name: 'illustration',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Hand-drawn building sketch (ink on transparent) shown beside the location on listing pages.',
              },
            },
            {
              name: 'illustrationWhite',
              label: 'Illustration (white)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'White line version of the sketch — used over the dark hero on the location page and in dark mode.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description:
                      'At least 1400px wide. Cropped to a 4:5 portrait card, so keep the subject centred.',
                  },
                },
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
