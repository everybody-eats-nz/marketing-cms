import type { Block } from 'payload'
import { statItemFields } from '../fields/stat-item'

export const Stats: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats' },
  imageURL: '/block-previews/stats.jpg',
  imageAltText: 'Impact statistics — large figures shown in a row',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'light',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Light tiles (home)', value: 'light' },
        { label: 'Dark panel (our story)', value: 'darkPanel' },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'global',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Use global Site Settings stats', value: 'global' },
        { label: 'Define custom stats for this page', value: 'custom' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: { condition: (_, sibs) => sibs.source === 'custom' },
      fields: statItemFields,
    },
  ],
}
