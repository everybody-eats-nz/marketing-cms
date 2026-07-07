import type { GlobalConfig } from 'payload'
import { statItemFields } from '../fields/stat-item'
import { linkGroup } from '../fields/link'

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
            { name: 'favicon', type: 'upload', relationTo: 'media', admin: { description: 'Square, at least 512×512px' } },
            { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Default social-share image — 1200×630px (or larger at the same 1.91:1 ratio)' } },
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
          label: 'Announcement',
          description:
            'A full-screen takeover shown once per visitor on the home page, in the Hopper brand (lilac paper, bubbly "hopper" logotype). The logotype is fixed — this promotes Hopper specifically; the copy and link below are editable.',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Show the homepage takeover',
                },
                {
                  name: 'campaignId',
                  type: 'text',
                  defaultValue: 'hopper-launch',
                  admin: {
                    description:
                      'Visitors who dismiss the takeover won\'t see it again. Change this ID to reset that and show it to everyone once more.',
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'an everybody eats cafe',
                  admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Now open in Te Aro.',
                  admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue:
                    'Rescued food, accessible prices, and a genuine sense of belonging - a new cafe from the Everybody Eats team.',
                  admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
                },
                linkGroup({
                  name: 'link',
                  label: 'Call to action',
                  admin: {
                    hideGutter: true,
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                  defaultValue: { type: 'internal', internalHref: '/hopper', label: 'Visit Hopper' },
                }),
                {
                  name: 'dismissLabel',
                  type: 'text',
                  defaultValue: 'Not now',
                  admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
