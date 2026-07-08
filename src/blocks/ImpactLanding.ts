import type { Block } from 'payload'

// Editable copy for the `/impact` data-story page. The figures and charts stay
// LIVE — they're computed from the volunteer portal's impact story
// (`fetchImpactStory`) and can't be edited here. This block only owns the prose
// around them. A few sentences splice in a live number: write those with a
// {token} placeholder and the renderer substitutes it.
//
//   {meals}     — all-time meals served, e.g. "279,655"
//   {firstYear} — first year of service, e.g. "2020"
//   {nights}    — all-time service nights, e.g. "2,739"
//   {range}     — service date range, e.g. "Jun 2020 — Jun 2026"
//   {perMeal}   — kg of food rescued per meal, e.g. "0.5"
//
// IMPACT_DEFAULTS is shared with the seed script so the two never drift.

export const IMPACT_DEFAULTS = {
  eyebrowPrefix: 'Everybody Eats',
  heading: 'Everybody got *a seat.*',
  intro:
    'Six years ago we set one long table and asked people to pay what they feel. Since then, {meals} dinners have been served from rescued food — no one turned away, everyone welcome. Here’s the story in numbers.',

  statMealsLabel: 'meals served',
  statFoodLabel: 'food rescued',
  statVolunteersLabel: 'volunteers welcomed',

  payEyebrow: 'Pay as you feel',
  payHeading: 'Everyone eats. *However* much you can give.',
  payBody:
    'There’s no price on the menu. Some pay it forward so the next person can eat; some sit down as our guests — no questions asked. Drag through the years and watch a typical table of 100 change.',

  growthEyebrow: 'More neighbours, every year',
  growthHeading: 'A table that keeps *growing.*',
  growthBody:
    'From a single pop-up dinner to a standing welcome across three cities — the number of meals served has climbed year on year as more neighbours find a seat.',
  growthCaption: 'Meals served per year. {firstYear} and the current year are partial (marked *).',

  rescuedEyebrow: 'Good food, not landfill',
  rescuedHeading: 'Every plate starts as *rescued* food.',
  rescuedBody:
    'Our kitchens take surplus ingredients that would otherwise be thrown away and turn them into restaurant-quality meals. Good food finds a plate instead of a bin.',
  rescuedTonnesLabel: 'of food rescued from landfill',
  rescuedMealsLabel: 'meals cooked from that surplus',

  venuesEyebrow: 'Where we serve',
  venuesHeading: 'Three cities, one *open* table.',
  venuesBody:
    'From Onehunga to Wellington, every location runs the same welcome — a warm room, a good meal, and a seat for whoever walks in.',

  peopleEyebrow: 'The people who show up',
  peopleHeading: 'Every plate is carried by a *volunteer.*',
  peopleVolunteersLabel: 'volunteers in the door',
  peopleHoursLabel: 'hours given',
  peopleNightsLabel: 'nights cooked & served',
  peopleSubheading: 'The regulars who keep coming back.',
  peopleSubbody:
    'Most volunteers start with a single shift — and then they keep showing up. Here’s how many have served each milestone of nights.',

  ctaHeading: 'Pull up *a chair.*',
  ctaBody:
    'Come for dinner and pay what you feel — or join the team that makes every night happen.',
  ctaPrimaryLabel: 'Find a dinner',
  ctaSecondaryLabel: 'Volunteer with us',

  footerNote:
    'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Left a koha” and “needed a koha” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.',
}

const text = (name: string, defaultValue: string) => ({
  name,
  type: 'text' as const,
  defaultValue,
})

const area = (name: string, defaultValue: string, description?: string) => ({
  name,
  type: 'textarea' as const,
  defaultValue,
  admin: description ? { description } : undefined,
})

const EM_HINT = 'Wrap a word in *asterisks* for the light editorial italic.'

export const ImpactLanding: Block = {
  slug: 'impactLanding',
  labels: { singular: 'Impact data story', plural: 'Impact data story' },
  fields: [
    {
      type: 'collapsible',
      label: 'Header',
      admin: { initCollapsed: true },
      fields: [
        text('eyebrowPrefix', IMPACT_DEFAULTS.eyebrowPrefix),
        area('heading', IMPACT_DEFAULTS.heading, EM_HINT),
        area('intro', IMPACT_DEFAULTS.intro, 'Use {meals} for the live all-time meal count.'),
        {
          type: 'row',
          fields: [
            text('statMealsLabel', IMPACT_DEFAULTS.statMealsLabel),
            text('statFoodLabel', IMPACT_DEFAULTS.statFoodLabel),
          ],
        },
        text('statVolunteersLabel', IMPACT_DEFAULTS.statVolunteersLabel),
      ],
    },
    {
      type: 'collapsible',
      label: 'Impact stories',
      admin: {
        initCollapsed: true,
        description: 'Optional featured stories shown just under the header. Leave empty to hide.',
      },
      fields: [
        {
          name: 'stories',
          type: 'array',
          labels: { singular: 'Story', plural: 'Stories' },
          admin: { description: 'Each renders as a compact card with an image.' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            { name: 'kicker', type: 'text', defaultValue: 'Story' },
            {
              name: 'heading',
              type: 'text',
              required: true,
              admin: { description: EM_HINT },
            },
            { name: 'body', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'ctaLabel', type: 'text', defaultValue: 'Read the story' },
                {
                  name: 'href',
                  type: 'text',
                  admin: { description: 'Where the card links, e.g. /journal/my-story' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Meals growing each year',
      admin: { initCollapsed: true },
      fields: [
        text('growthEyebrow', IMPACT_DEFAULTS.growthEyebrow),
        area('growthHeading', IMPACT_DEFAULTS.growthHeading, EM_HINT),
        area('growthBody', IMPACT_DEFAULTS.growthBody),
        area('growthCaption', IMPACT_DEFAULTS.growthCaption, 'Use {firstYear} for the first year.'),
      ],
    },
    {
      type: 'collapsible',
      label: 'Food rescued',
      admin: { initCollapsed: true },
      fields: [
        text('rescuedEyebrow', IMPACT_DEFAULTS.rescuedEyebrow),
        area('rescuedHeading', IMPACT_DEFAULTS.rescuedHeading, EM_HINT),
        area('rescuedBody', IMPACT_DEFAULTS.rescuedBody),
        {
          type: 'row',
          fields: [
            text('rescuedTonnesLabel', IMPACT_DEFAULTS.rescuedTonnesLabel),
            text('rescuedMealsLabel', IMPACT_DEFAULTS.rescuedMealsLabel),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'The people',
      admin: { initCollapsed: true },
      fields: [
        text('peopleEyebrow', IMPACT_DEFAULTS.peopleEyebrow),
        area('peopleHeading', IMPACT_DEFAULTS.peopleHeading, EM_HINT),
        {
          type: 'row',
          fields: [
            text('peopleVolunteersLabel', IMPACT_DEFAULTS.peopleVolunteersLabel),
            text('peopleHoursLabel', IMPACT_DEFAULTS.peopleHoursLabel),
          ],
        },
        text('peopleNightsLabel', IMPACT_DEFAULTS.peopleNightsLabel),
        text('peopleSubheading', IMPACT_DEFAULTS.peopleSubheading),
        area('peopleSubbody', IMPACT_DEFAULTS.peopleSubbody),
      ],
    },
    {
      type: 'collapsible',
      label: 'Pay as you feel',
      admin: { initCollapsed: true },
      fields: [
        text('payEyebrow', IMPACT_DEFAULTS.payEyebrow),
        area('payHeading', IMPACT_DEFAULTS.payHeading, EM_HINT),
        area('payBody', IMPACT_DEFAULTS.payBody),
      ],
    },
    {
      type: 'collapsible',
      label: 'Where we serve',
      admin: { initCollapsed: true },
      fields: [
        text('venuesEyebrow', IMPACT_DEFAULTS.venuesEyebrow),
        area('venuesHeading', IMPACT_DEFAULTS.venuesHeading, EM_HINT),
        area('venuesBody', IMPACT_DEFAULTS.venuesBody),
      ],
    },
    {
      type: 'collapsible',
      label: 'Call to action',
      admin: { initCollapsed: true },
      fields: [
        area('ctaHeading', IMPACT_DEFAULTS.ctaHeading, EM_HINT),
        area('ctaBody', IMPACT_DEFAULTS.ctaBody),
        {
          type: 'row',
          fields: [
            text('ctaPrimaryLabel', IMPACT_DEFAULTS.ctaPrimaryLabel),
            text('ctaSecondaryLabel', IMPACT_DEFAULTS.ctaSecondaryLabel),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Reading notes',
      admin: { initCollapsed: true },
      fields: [
        area(
          'footerNote',
          IMPACT_DEFAULTS.footerNote,
          'Use {nights}, {range} and {perMeal} for live figures.',
        ),
      ],
    },
  ],
}
