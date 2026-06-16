import type { Block } from 'payload'

// A grid of downloadable documents (PDFs) — catering decks, team-experience
// proposals, info packs. Each item points at a doc in the `documents`
// collection; the per-item title/description override the document's own so the
// same file can be presented differently on different pages.
export const Downloads: Block = {
  slug: 'downloads',
  labels: { singular: 'Downloads', plural: 'Downloads' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Download' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Section heading. Wrap a word in *asterisks* for the brand italic.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Optional short paragraph under the heading. *asterisks* allowed.' },
    },
    {
      name: 'columns',
      type: 'radio',
      defaultValue: '2',
      admin: { layout: 'horizontal' },
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'File', plural: 'Files' },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'documents',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: "Overrides the document's title. Leave blank to use it." },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: "Overrides the document's description. Leave blank to use it." },
        },
      ],
    },
  ],
}
