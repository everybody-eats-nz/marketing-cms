import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  imageURL: '/block-previews/timeline.jpg',
  imageAltText: 'Vertical timeline of milestones',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Milestone', plural: 'Milestones' },
      minRows: 1,
      fields: [
        { name: 'year', type: 'text', required: true, admin: { description: 'e.g. "2017" or "Today"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
