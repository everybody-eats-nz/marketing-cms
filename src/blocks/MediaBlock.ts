import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'media',
  labels: { singular: 'Media (full-bleed)', plural: 'Media (full-bleed)' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'aspect',
      type: 'select',
      defaultValue: '16:8',
      options: [
        { label: '16:8 (cinematic)', value: '16:8' },
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1 (square)', value: '1:1' },
        { label: 'Auto (original)', value: 'auto' },
      ],
    },
  ],
}
