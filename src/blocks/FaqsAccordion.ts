import type { Block } from 'payload'

export const FaqsAccordion: Block = {
  slug: 'faqsAccordion',
  labels: { singular: 'FAQs accordion', plural: 'FAQs accordions' },
  imageURL: '/block-previews/faqsAccordion.jpg',
  imageAltText: 'Frequently asked questions accordion',
  admin: { group: 'Lists' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional heading shown above the FAQs.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Paying at the restaurant', value: 'pay-as-you-feel' },
        { label: 'About Everybody Eats', value: 'about-us' },
        { label: 'Dining experience', value: 'dining' },
        { label: 'Volunteering', value: 'volunteering' },
        { label: 'Partnering & donations', value: 'donating' },
        { label: 'About our meals', value: 'our-meals' },
        { label: 'Events', value: 'events' },
        { label: 'Volunteering on a shift', value: 'volunteer-shifts' },
      ],
      admin: {
        description:
          'Optional. Show only FAQs in this category, as a single flat list. Leave empty to show all general FAQ categories grouped by heading.',
      },
    },
  ],
}
