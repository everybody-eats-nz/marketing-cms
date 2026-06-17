import type { Block } from 'payload'

export const JournalList: Block = {
  slug: 'journalList',
  labels: { singular: 'Journal list', plural: 'Journal lists' },
  imageURL: '/block-previews/journalList.jpg',
  imageAltText: 'Grid of journal posts',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* to italicise it.' },
    },
    { name: 'viewAllLabel', type: 'text' },
    { name: 'viewAllHref', type: 'text' },
    { name: 'limit', type: 'number', defaultValue: 3 },
  ],
}
