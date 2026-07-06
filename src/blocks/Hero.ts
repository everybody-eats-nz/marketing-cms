import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  imageURL: '/block-previews/hero.jpg',
  imageAltText: 'Hero — large editorial heading with image and call-to-action buttons',
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Main H1. Newlines render as line breaks. Wrap a word in *asterisks* to italicise it.',
      },
    },
    {
      name: 'highlightWord',
      type: 'text',
      admin: {
        description:
          'Optional. A single word from the heading that gets the sun-yellow underline (case-sensitive, first match).',
      },
    },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional. When set, this image replaces the built-in rotating photo carousel. Portrait 4:5, at least 1400px wide. Leave empty to keep the carousel.',
      },
    },
    {
      name: 'primaryCta',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      admin: { hideGutter: true, description: 'Optional ghost-style link beside the primary CTA' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'sticker',
      type: 'group',
      admin: {
        hideGutter: true,
        description: 'Optional floating yellow circle sticker overlapping the hero image',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description:
              'Each line renders separately. Wrap a word in *asterisks* to italicise it. Leave blank for no sticker.',
          },
        },
      ],
    },
  ],
}
