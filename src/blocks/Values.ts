import type { Block } from 'payload'

export const Values: Block = {
  slug: 'values',
  labels: { singular: 'Mission & values', plural: 'Mission & values' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'missionLabel',
      type: 'text',
      defaultValue: 'Our mission',
    },
    {
      name: 'mission',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'visionLabel',
      type: 'text',
      defaultValue: 'Our vision',
    },
    {
      name: 'vision',
      type: 'textarea',
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    {
      name: 'valuesLabel',
      type: 'text',
      defaultValue: 'Ngā Uara — our values',
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Value', plural: 'Values' },
      maxRows: 4,
      fields: [
        { name: 'term', type: 'text', required: true, admin: { description: 'Te reo Māori term, e.g. "Manaakitanga"' } },
        { name: 'translation', type: 'text', admin: { description: 'Short English gloss, e.g. "Care & hospitality"' } },
        { name: 'copy', type: 'textarea' },
      ],
    },
  ],
}
