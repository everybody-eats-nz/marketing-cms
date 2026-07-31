import type { Block } from 'payload'

/**
 * The Toast menu, shown in full on the page — upload the artwork and it
 * renders at its own proportions, no click needed.
 *
 * Images are the reliable path: every browser shows them inline. A PDF is
 * accepted too, but browsers disagree about embedding one (iOS Safari in
 * particular refuses), so a PDF always ships with a download button and only
 * embeds when there are no images to show instead.
 */
export const ToastMenu: Block = {
  slug: 'toastMenu',
  labels: { singular: 'Toast menu', plural: 'Toast menus' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'The menu' },
    {
      name: 'sheets',
      type: 'array',
      label: 'Menu images',
      labels: { singular: 'Sheet', plural: 'Sheets' },
      admin: {
        description:
          'JPEG or PNG artwork, shown full width on the page in this order — one row per page of the menu. This is the recommended way to publish the menu: it displays everywhere, including on phones.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description:
              'Describes the sheet for screen readers and search. Falls back to the alt text on the upload itself.',
          },
        },
      ],
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'documents',
      label: 'PDF menu',
      admin: {
        description:
          'Optional. Adds a download button. If no menu images are uploaded above, the PDF is also embedded in the page — but some phone browsers will only offer it as a download, so upload images as well when you can.',
      },
    },
    {
      name: 'downloadLabel',
      type: 'text',
      defaultValue: 'Download the menu (PDF)',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.pdf) },
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
