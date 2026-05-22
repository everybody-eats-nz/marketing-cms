import type { Block } from 'payload'

export const FaqsAccordion: Block = {
  slug: 'faqsAccordion',
  labels: { singular: 'FAQs accordion', plural: 'FAQs accordions' },
  admin: { group: 'Lists' },
  fields: [
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Optional caption. The block renders all FAQs from the collection, grouped by category.',
      },
    },
  ],
}
