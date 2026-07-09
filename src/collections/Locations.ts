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
      name: 'showInMainGrids',
      label: 'Show in restaurant grids',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When on, this venue appears in the main "restaurants" grids (e.g. /dine-with-us). Turn on for our permanent restaurants; leave off for pop-ups or one-off sites.',
      },
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
            {
              name: 'howItWorks',
              label: 'How it works',
              type: 'group',
              admin: {
                description:
                  'The "How it works" column shown in the info strip near the top of the location page. Leave both blank to use the default wording.',
                hideGutter: true,
              },
              fields: [
                {
                  name: 'lead',
                  type: 'text',
                  admin: { description: 'Emphasised first line, e.g. "One three-course menu nightly."' },
                },
                {
                  name: 'detail',
                  type: 'text',
                  admin: { description: 'Muted supporting line, e.g. "Pay what feels right when you leave."' },
                },
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
            {
              name: 'listButtons',
              label: 'Restaurant list buttons',
              type: 'group',
              admin: {
                hideGutter: true,
                description:
                  'The two buttons shown for this restaurant on the /dine-with-us list. Leave any field blank to use the default. The "Book a table" button only appears when a Booking link is set above.',
              },
              fields: [
                {
                  name: 'visitLabel',
                  type: 'text',
                  admin: {
                    description:
                      'Primary button text. Use {name} for the restaurant name. Default: "Visit {name}".',
                  },
                },
                {
                  name: 'visitHref',
                  type: 'text',
                  admin: {
                    description:
                      'Where the primary button links. Default: this restaurant\'s page (/dine-with-us/<slug>).',
                  },
                },
                {
                  name: 'bookLabel',
                  type: 'text',
                  admin: {
                    description: 'Secondary (booking) button text. Default: "Book a table →".',
                  },
                },
              ],
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
