import type { Block } from 'payload'

/**
 * A quiet Toast-branded section: eyebrow, big statement, supporting copy,
 * optional link, and an optional logo alongside (used for the Coffee Supreme
 * lockup on the "The idea" section).
 */
export const ToastStatement: Block = {
  slug: 'toastStatement',
  labels: { singular: 'Toast statement', plural: 'Toast statements' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'textarea', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'aside',
      type: 'group',
      label: 'Logo alongside',
      admin: {
        description:
          'Optional partner logo shown beside the copy — e.g. Coffee Supreme. Upload it as supplied, in the partner’s own colours; it sits on the yellow paper untouched.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Small line above the logo, e.g. “Coffee by”.' },
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Optional link — usually the partner’s website.' },
        },
      ],
    },
  ],
}
