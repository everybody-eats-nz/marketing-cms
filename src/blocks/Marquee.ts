import type { Block } from 'payload'

export const Marquee: Block = {
  slug: 'marquee',
  labels: { singular: 'Marquee ticker', plural: 'Marquee tickers' },
  imageURL: '/block-previews/marquee.jpg',
  imageAltText: 'Scrolling marquee ticker strip',
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
