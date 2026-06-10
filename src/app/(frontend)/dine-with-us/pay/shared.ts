// Shared config for the pay-at-table flow.
//
// Diners scan a QR code at the table after dinner, pick the restaurant they
// ate at, then tap an amount — each amount goes straight to a Stripe Payment
// Link (the same links the old Webflow site used, so payments land in the
// existing Stripe account with no API keys involved). "Other" opens a
// customer-chooses-price link where the diner types their own amount.
//
// The links are managed in the Stripe dashboard (Products → Payment links).
// If an amount or location changes, update the link here.

export const PRESET_AMOUNTS: { amount: number; label: string }[] = [
  { amount: 25, label: 'Covers tonight’s meal' },
  { amount: 35, label: 'A meal, plus a little extra' },
  { amount: 50, label: 'Yours — and one paid forward' },
  { amount: 100, label: 'Feeds the whole table' },
]

// Diners at pop-ups and one-off dinners don't belong to a restaurant in the
// Locations collection — this pseudo-location keeps the old "Special Events"
// option from the Webflow flow working.
export const SPECIAL_EVENTS = {
  slug: 'special-events',
  name: 'A special event',
} as const

type LocationLinks = {
  /** Preset dollar amount → Stripe Payment Link */
  amounts: Record<number, string>
  /** Customer-chooses-price link ("Other" on the old site) */
  other: string
}

export const STRIPE_PAYMENT_LINKS: Record<string, LocationLinks> = {
  wellington: {
    amounts: {
      25: 'https://buy.stripe.com/aFa28r7ZRgk7a7T0L1gQE0s',
      35: 'https://buy.stripe.com/9B6fZha7Zd7V0xjgJZgQE0t',
      50: 'https://buy.stripe.com/4gMdR9gwngk793PeBRgQE08',
      100: 'https://buy.stripe.com/6oUfZh0xp2th2FreBRgQE09',
    },
    other: 'https://buy.stripe.com/7sY7sL0xp2th4NzfFVgQE0a',
  },
  onehunga: {
    amounts: {
      25: 'https://buy.stripe.com/3cIeVd2FxebZ0xj8dtgQE0x',
      35: 'https://buy.stripe.com/28E00j2Fx0l9cg13XdgQE0w',
      50: 'https://buy.stripe.com/bJe00ja7Z0l993PalBgQE0d',
      100: 'https://buy.stripe.com/28E28r4NF8RF6VH79pgQE0e',
    },
    other: 'https://buy.stripe.com/00waEX0xp6Jx93P0L1gQE0f',
  },
  'glen-innes': {
    amounts: {
      25: 'https://buy.stripe.com/00wfZhgwn0l91Bn8dtgQE0y',
      35: 'https://buy.stripe.com/00w3cvcg71pddk50L1gQE0z',
      50: 'https://buy.stripe.com/fZu6oHbc34Bp93PeBRgQE0i',
      100: 'https://buy.stripe.com/bJedR90xp7NB1BngJZgQE0j',
    },
    other: 'https://buy.stripe.com/bJe5kDfsj3xldk5ctJgQE0k',
  },
  [SPECIAL_EVENTS.slug]: {
    amounts: {
      25: 'https://buy.stripe.com/dRm8wPgwnfg37ZL9hxgQE0q',
      35: 'https://buy.stripe.com/14A28reofd7V0xjgJZgQE0r',
      50: 'https://buy.stripe.com/9B65kD4NFgk7a7TeBRgQE0n',
      100: 'https://buy.stripe.com/bJe9AT5RJ0l9a7TctJgQE0o',
    },
    other: 'https://buy.stripe.com/bJe9AT6VNaZN5RD2T9gQE0p',
  },
}
