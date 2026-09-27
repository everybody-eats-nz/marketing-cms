import type { Block } from 'payload'

/** Practical details for visiting Toast: address, hours, neighbours, map link. */
export const ToastVisit: Block = {
  slug: 'toastVisit',
  labels: { singular: 'Toast visit details', plural: 'Toast visit details' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Find us' },
    { name: 'address', type: 'textarea' },
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
