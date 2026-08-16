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
          label: 'Closure banner',
          description:
            'The yellow scrolling strip shown at the top of every page while a restaurant has a temporary closure entered. It writes itself from the closures on each location and retires once the last closed night has passed - there is nothing to switch on here.',
          fields: [
            {
              name: 'closureBanner',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'speed',
                  type: 'number',
                  label: 'Scroll speed',
                  defaultValue: 125,
                  min: 10,
                  max: 400,
                  admin: {
                    step: 5,
                    description:
                      'How far the strip travels each second, in pixels. 125 is the pace the banner has always run at. Drop to around 80-90 to make the messages easier to read, or raise it for more urgency. Leave blank for 125.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Gala banner',
          description:
            'The slim promo strip with the live countdown, shown at the top of every page. It hides itself automatically on the page it links to, and once the countdown target has passed.',
          fields: [
            {
              name: 'galaBanner',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show the gala banner',
                },
                {
                  name: 'targetDate',
                  type: 'date',
                  defaultValue: '2026-10-30T05:30:00.000Z',
                  label: 'Countdown target',
                  admin: {
                    description:
                      'When the gala starts. The banner counts down to this moment and retires itself afterwards.',
                    date: { pickerAppearance: 'dayAndTime' },
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'eventName',
                  type: 'text',
                  defaultValue: 'The Everybody Eats Gala',
                  admin: {
                    description: 'Shown on larger screens.',
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'eventNameShort',
                  type: 'text',
                  defaultValue: 'EE Gala',
                  admin: {
                    description: 'Shorter name used on mobile where space is tight.',
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'dateLabel',
                  type: 'text',
                  defaultValue: 'Fri 30 Oct 2026',
                  admin: {
                    description: 'Human-friendly date shown next to the name (larger screens only).',
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                linkGroup({
                  name: 'link',
                  label: 'Call to action',
                  admin: {
                    hideGutter: true,
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                  defaultValue: { type: 'internal', internalHref: '/gala', label: 'Book' },
                }),
              ],
            },
          ],
        },
        {
          label: 'Cafe banner',
          description:
            'The slim strip of buttons pinned to the top of the Toast and Hopper cafe pages. Those pages carry their own brand and have no site header, so this bar is the only way to book or donate without scrolling. Donate always shows. Toast books through the Onehunga restaurant it runs out of, so its Book button works already; Hopper has no bookings yet, so it shows Donate alone until a link is added below.',
          fields: [
            {
              name: 'cafeBanner',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'bookLabel',
                  type: 'text',
                  defaultValue: 'Book a table',
                  admin: {
                    description:
                      'Shown on the Book button for both cafes. Keep it short - the bar is narrow on a phone.',
                  },
                },
                {
                  name: 'toastBookingUrl',
                  type: 'text',
                  label: 'Toast booking link',
                  admin: {
                    description:
                      'Leave blank. Toast runs out of the Onehunga kitchen, so the Book button already uses that restaurant\'s booking link and follows it if it ever changes. Only fill this in if Toast gets a booking system of its own.',
                  },
                },
                {
                  name: 'hopperBookingUrl',
                  type: 'text',
                  label: 'Hopper booking link',
                  admin: {
                    description:
                      'Where the Book button on /hopper goes. Hopper bookings are not live yet - leave this blank until they are, and the Book button stays hidden.',
                  },
                },
                {
                  name: 'donateLabel',
                  type: 'text',
                  defaultValue: 'Donate',
                },
                {
                  name: 'donateUrl',
                  type: 'text',
                  admin: {
                    description:
                      'Optional. Leave blank to send cafe visitors to the same place as the main site (Links → Donate URL).',
                  },
                },
              ],
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
