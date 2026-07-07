import type { Block } from 'payload'

/** Practical details for visiting Hopper: address, hours, neighbours, map link. */
export const HopperVisit: Block = {
  slug: 'hopperVisit',
  labels: { singular: 'Hopper visit details', plural: 'Hopper visit details' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Find us' },
    { name: 'address', type: 'textarea', defaultValue: '11 Hopper St\nTe Aro, Wellington' },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'e.g. neighbours / how to spot the door.' },
    },
    {
      name: 'hours',
      type: 'array',
      labels: { singular: 'Hours row', plural: 'Hours rows' },
      fields: [
        { name: 'days', type: 'text', required: true },
        { name: 'times', type: 'text', required: true },
      ],
    },
    { name: 'mapLabel', type: 'text', defaultValue: 'Open in maps ↗' },
    { name: 'mapHref', type: 'text' },
  ],
}
