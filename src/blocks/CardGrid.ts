import type { Block } from 'payload'

export const CardGrid: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Optional. Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      admin: { description: 'Optional CTA next to the heading (e.g. "Become a partner →")' },
    },
    { name: 'viewAllHref', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'soft',
      admin: { description: 'Visual treatment for the card backgrounds' },
      options: [
        { label: 'Soft (cream-100 background)', value: 'soft' },
        { label: 'Tile (gap-px grid on tinted bg)', value: 'tile' },
        { label: 'Per-card colours', value: 'mixed' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', admin: { description: 'e.g. "01"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'copy', type: 'textarea' },
        {
          name: 'email',
          type: 'email',
          admin: { description: 'Optional. Renders as mailto link below the copy.' },
        },
        { name: 'ctaLabel', type: 'text' },
        { name: 'href', type: 'text' },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'cream',
          admin: {
            description: 'Used only when Card style = Per-card colours',
            condition: (data, sibs, { blockData }) => blockData?.cardStyle === 'mixed',
          },
          options: [
            { label: 'Cream', value: 'cream' },
            { label: 'Sun (yellow)', value: 'sun' },
            { label: 'Clay (terracotta)', value: 'clay' },
            { label: 'Forest 100 (soft green)', value: 'forest100' },
            { label: 'Forest 700 (dark)', value: 'forest700' },
          ],
        },
      ],
    },
  ],
}
