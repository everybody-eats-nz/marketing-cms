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
        { label: 'Dining', value: 'dining' },
        { label: 'Pay as you feel', value: 'pay-as-you-feel' },
        { label: 'Volunteering', value: 'volunteering' },
        { label: 'Donating', value: 'donating' },
        { label: 'Events', value: 'events' },
        { label: 'About us', value: 'about-us' },
      ],
    },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
