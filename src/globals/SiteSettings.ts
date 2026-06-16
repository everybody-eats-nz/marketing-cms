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
      ],
    },
  ],
}
