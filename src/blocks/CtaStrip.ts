import type { Block } from 'payload'

export const CtaStrip: Block = {
  slug: 'ctaStrip',
  labels: { singular: 'CTA strip', plural: 'CTA strips' },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Wrap a word in *asterisks* for italic.' },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'sun',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Sun yellow', value: 'sun' },
        { label: 'Forest green', value: 'forest' },
      ],
    },
    {
      name: 'align',
      type: 'radio',
      defaultValue: 'left',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Centered', value: 'center' },
      ],
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
      admin: { hideGutter: true },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
