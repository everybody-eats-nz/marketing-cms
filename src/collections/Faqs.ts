import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'displayOrder', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
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
      ],
    },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
