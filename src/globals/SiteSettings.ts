import type { GlobalConfig } from 'payload'
import { statItemFields } from '../fields/stat-item'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'Everybody Eats' },
            { name: 'tagline', type: 'text', defaultValue: 'Making a difference one plate at a time' },
            { name: 'description', type: 'textarea' },
            { name: 'logoLight', type: 'upload', relationTo: 'media', admin: { description: 'Logo for dark backgrounds (white version)' } },
            { name: 'logoDark', type: 'upload', relationTo: 'media', admin: { description: 'Logo for light backgrounds (dark version)' } },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Default social-share image' } },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactEmail', type: 'email' },
            { name: 'pressEmail', type: 'email' },
            { name: 'volunteerEmail', type: 'email' },
            {
              name: 'corporateEmail',
              type: 'email',
              admin: { description: 'Where corporate events / catering enquiries are sent' },
            },
            { name: 'phone', type: 'text' },
            { name: 'charityNumber', type: 'text', defaultValue: 'CC56055' },
            {
              name: 'mailingAddress',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Links',
          fields: [
            { name: 'bookingUrl', type: 'text', admin: { description: 'Default booking link if a location doesn\'t have its own' } },
            { name: 'donateUrl', type: 'text' },
            { name: 'volunteerUrl', type: 'text', admin: { description: 'External volunteer portal' } },
            { name: 'shopUrl', type: 'text' },
            {
              name: 'social',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Impact',
          fields: [
            {
              name: 'stats',
              type: 'array',
              labels: { singular: 'Impact stat', plural: 'Impact stats' },
              admin: { description: 'Headline impact numbers used in the hero + footer' },
              fields: statItemFields,
            },
          ],
        },
        {
          label: 'Gala banner',
          fields: [
            {
              name: 'galaBanner',
              type: 'group',
              label: 'Header Gala banner',
              admin: {
                description:
                  'The slim countdown strip at the top of the site header. It links to /gala and hides automatically on the Gala page itself and once the event date has passed.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show the Gala banner',
                  admin: {
                    description: 'Untick to hide the countdown strip across the whole site.',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  defaultValue: 'The Everybody Eats Gala',
                  admin: { description: 'Headline text shown in the strip.' },
                },
                {
                  name: 'eventDate',
                  type: 'date',
                  defaultValue: '2026-10-30T05:30:00.000Z',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime' },
                    description:
                      'The date and time the countdown targets (also shown as the strip date). Stored in UTC — 6:30pm NZ daylight time is 5:30am UTC.',
                  },
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Book',
                  admin: { description: 'Call-to-action label at the end of the strip.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
