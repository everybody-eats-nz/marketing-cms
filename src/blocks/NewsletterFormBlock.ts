import type { Block } from 'payload'

export const NewsletterFormBlock: Block = {
  slug: 'newsletterForm',
  labels: { singular: 'Newsletter form', plural: 'Newsletter forms' },
  fields: [
    { name: 'footnote', type: 'textarea' },
  ],
}
