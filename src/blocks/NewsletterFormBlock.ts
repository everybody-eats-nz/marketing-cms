import type { Block } from 'payload'

export const NewsletterFormBlock: Block = {
  slug: 'newsletterForm',
  labels: { singular: 'Newsletter form', plural: 'Newsletter forms' },
  imageURL: '/block-previews/newsletterForm.jpg',
  imageAltText: 'Newsletter signup form',
  fields: [
    { name: 'footnote', type: 'textarea' },
  ],
}
