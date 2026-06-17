import type { Block } from 'payload'

export const EventsList: Block = {
  slug: 'eventsList',
  labels: { singular: 'Events list', plural: 'Events lists' },
  imageURL: '/block-previews/eventsList.jpg',
  imageAltText: 'List of upcoming events',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* to italicise it.' },
    },
    { name: 'viewAllLabel', type: 'text' },
    { name: 'viewAllHref', type: 'text' },
    { name: 'limit', type: 'number', defaultValue: 4 },
  ],
}
