import type { Block } from 'payload'

/**
 * Hopper Cafe blocks (hopperHero, hopperStatement, hopperMenu, hopperVisit)
 * carry their own standalone brand — lilac paper, olive ink, bubble display
 * type — completely separate from the Everybody Eats palette. They render via
 * the shared blocks pipeline but are intended for the /hopper page, which has
 * its own chrome-free layout under src/app/(hopper)/.
 */
export const HopperHero: Block = {
  slug: 'hopperHero',
  labels: { singular: 'Hopper hero', plural: 'Hopper heroes' },
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
      name: 'wordmark',
      type: 'text',
      required: true,
      defaultValue: 'hOPPer',
      admin: { description: 'Rendered huge in the Hopper logotype face, exactly as typed.' },
    },
    { name: 'label', type: 'text', defaultValue: 'cafe' },
    { name: 'addressLine', type: 'text', defaultValue: '11 Hopper St, Te Aro' },
    { name: 'hoursLine', type: 'text', defaultValue: 'Mon + Tues · 9am–2pm' },
  ],
}
