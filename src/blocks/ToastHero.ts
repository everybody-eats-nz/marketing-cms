import type { Block } from 'payload'

/**
 * Toast blocks (toastHero, toastStatement, toastMenu, toastVisit) carry their
 * own standalone brand — yellow paper, brown ink, a drawn script wordmark —
 * completely separate from the Everybody Eats palette. They render via the
 * shared blocks pipeline but are intended for the /toast page, which has its
 * own chrome-free layout under src/app/(toast)/.
 */
export const ToastHero: Block = {
  slug: 'toastHero',
  labels: { singular: 'Toast hero', plural: 'Toast heroes' },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'an everybody eats cafe',
      admin: {
        description:
          'Accessible label for the Everybody Eats logo shown above the wordmark (links back to the main site).',
      },
    },
    { name: 'kickerHref', type: 'text', defaultValue: '/' },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'pop-up community cafe',
      admin: {
        description:
          'Sits under the Toast wordmark. The wordmark itself is the drawn logo, so there is nothing to type for it.',
      },
    },
    { name: 'addressLine', type: 'text' },
    { name: 'hoursLine', type: 'text', defaultValue: 'Fri 7.30–2.30 · Sat + Sun 8.30–2.30' },
  ],
}
