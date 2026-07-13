import type { Block } from 'payload'

// ─────────────────────────────────────────────────────────────────────────────
// Gala "noir" section blocks — the 2026 sponsorship-kit art direction (black
// silk, candlelight ivory serif, hot magenta, the pink→peach→gold GALA
// gradient). Unlike the single composite `galaLanding` block, each section here
// is its own block so editors can reorder the page, drop sections, and edit
// every line of copy and every image in the admin.
//
// GALA_NOIR_DEFAULTS is the single source of truth for the initial content:
// it seeds both the admin `defaultValue`s and the `gala-new` page document
// (see scripts/seed-gala-noir-page.ts), so the two never drift.
//
// Renderers live in src/components/blocks/gala-noir-blocks.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export const GALA_NOIR_DEFAULTS = {
  hero: {
    galaEmail: 'gala@everybodyeats.nz',
    galaDateTime: '2026-10-30T18:30:00+13:00',
    eyebrow: 'Fundraising event — 30 October 2026',
    kitLine: 'Event *Sponsorship* Kit',
    scriptLine: 'everybody eats',
    word: 'GALA',
    intro:
      'One audacious night of exquisite dining, high-class drag cabaret and generous bidding — so that everybody eats.',
    primaryCtaLabel: 'Sponsor the Gala',
    secondaryCtaLabel: 'Host a table',
    showCountdown: true,
    ribbon: [
      { item: 'Friday 30 October 2026' },
      { item: '6:30pm' },
      { item: 'St Matthew-in-the-City, Auckland CBD' },
      { item: 'Dresscode: your most flamboyant self!' },
      { item: '200 seats only' },
    ],
  },

  problem: {
    eyebrow: 'Why this night matters',
    heading: 'The *Problem*',
    stats: [
      {
        figure: '1 in 3',
        body: 'households experience food insecurity — most became food insecure in the last 12 months due to the cost-of-living crisis.',
      },
      {
        figure: '1.22m',
        body: 'tonnes of food are lost or wasted across the supply chain each year — 237kg for every person in Aotearoa.',
      },
      {
        figure: '1 in 5',
        body: 'children in New Zealand live in households where food runs out often, or sometimes.',
      },
      {
        figure: '30%',
        body: 'of full-time Kiwi workers rely on food assistance or struggle to buy groceries. Having a job is no longer a shield.',
      },
    ],
    pullQuote:
      'Nearly half — *49%* — of food-insecure households in New Zealand are too ashamed or embarrassed to ask for support.',
    sources:
      'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',
  },

  about: {
    heading: 'What is *Everybody Eats?*',
    tagline: 'Making a difference, one plate at a time.',
    bodyLeft:
      'Everybody Eats runs charity restaurants which bring communities together through dignified hospitality experiences. With a mission to tackle food waste, food insecurity and social isolation in Aotearoa New Zealand, our teams of hospitality professionals and volunteers rescue and transform surplus food into quality three-course meals, served nightly at our pay-what-you-can restaurants.',
    bodyRight:
      'Founded in Auckland in 2017, we have grown from a weekly pop-up on Karangahape Road into a national movement with three permanent restaurants and pop-ups across the motu.',
    linkLabel: 'everybodyeats.nz',
    linkUrl: 'https://everybodyeats.nz',
    impactStats: [
      { value: '332,234+', label: 'Meals served' },
      { value: '166', label: 'Tonnes of food rescued' },
      { value: '175,882', label: 'Volunteer hours' },
    ],
  },

  night: {
    eyebrow: 'Friday 30 October 2026 · 6:30pm · St Matthew-in-the-City',
    heading: 'An *unforgettable* evening',
    body: 'The Everybody Eats Gala is our most audacious fundraising event to date. Alongside exquisite dining, guests can expect a high-class drag cabaret show, where Auckland’s finest join for an unforgettable evening.',
    features: [
      { item: 'Live drag cabaret performances' },
      { item: 'Welcome drink and canapés on arrival' },
      { item: 'Three incredible courses' },
      { item: 'Wine with dinner, then pay-as-you-go' },
      { item: 'Live and silent auction' },
    ],
    dresscode: 'Your most flamboyant self!',
    imageCaption: 'Images from previous Everybody Eats Galas',
  },

  performers: {
    eyebrow: 'On stage',
    heading: 'Meet the Gala *performers*',
    performers: [
      {
        name: 'Hugo Grrrl',
        role: 'MC / Producer',
        bio: 'Aotearoa’s leading drag king — the first drag king and transgender man to win a televised drag competition. Sharp wit, dazzling theatricality, and performances that are equal parts hilarious, heartfelt and unforgettable.',
      },
      {
        name: 'Slay West',
        role: 'Performer',
        bio: 'One of Wellington’s most beloved drag entertainers and a proud member of the acclaimed Māori drag collective The Tīwhas. Infectious energy, quick wit, and warmth that lights up any room.',
      },
      {
        name: 'Altra Violet',
        role: 'Performer',
        bio: 'Award-winning cabaret artist, choreographer and takatāpui performer blending drag, burlesque, dance and theatre — bold, inventive and deeply engaging on every stage.',
      },
    ],
  },

  chefs: {
    eyebrow: 'In the kitchen',
    heading: 'Meet the Gala *chefs*',
    chefs: [
      {
        name: 'Archana Kurup',
        role: 'Head Chef · Onehunga',
        bio: 'Trained across cuisines and continents, Archana’s cooking is a celebration of food’s ability to nourish and unite.',
      },
      {
        name: 'Urisha Sing',
        role: 'Head Chef · Glen Innes',
        bio: 'A food philosophy rooted in heritage, heart and humble beginnings — honouring her cultural roots and the diverse communities she serves.',
      },
      {
        name: 'Harri Fletcher',
        role: 'Head Chef · Wellington',
        bio: 'With a background in pay-as-you-can dining in the UK, Harri creates bold, flavourful food that fights waste and brings people together.',
      },
    ],
  },

  calculator: {
    eyebrow: 'Where the money goes',
    heading: 'Why *fundraise*',
    body: 'It costs *$300,000 a year* to keep one of our restaurants open — pay-what-you-can contributions bring in around half that. The Gala helps cover rent, kitchen operating costs, supplementary food and the core team behind the scenes. Every dollar raised at the Gala goes back into keeping those doors open. Last year, this room raised over $150,000. This year, with your help, we’re aiming for even more.',
    roomSeats: 200,
    seatPrice: 330,
    tablePrice: 3000,
    annualCost: 300000,
    roomLabel: 'The room — 200 seats at St Matthew-in-the-City',
    sliderLabel: 'How many seats will you fill?',
    footnote:
      'Based on $300,000 a year to run one restaurant. Tables of ten $3,000 · individual seats $330, inclusive of GST.',
  },

  tiers: {
    galaEmail: 'gala@everybodyeats.nz',
    eyebrow: 'Partnership packages',
    heading: 'Sponsor *the Gala*',
    body: 'How to put your brand at the centre of Auckland’s most talked-about night — 200 seats, an influential room, genuine connection beyond the reach of advertising alone.',
    tiers: [
      {
        tier: 'Gold',
        badge: 'One only',
        title: 'The [Your Name] Everybody Eats Gala',
        price: '$25,000',
        featured: true,
        perks: [
          { item: 'The Gala carries your name' },
          { item: 'Reserved table of ten with premium drinks package' },
          { item: 'Complimentary drinks throughout the evening' },
          { item: 'Spotlight position in the AV loop and programme' },
          { item: 'Repeatedly named from the stage by the MC' },
          { item: 'Named on the Everybody Eats website and socials' },
          { item: 'Featured in the Wrap Video' },
        ],
      },
      {
        tier: 'Silver',
        badge: 'Three only',
        title: 'Name a moment of the night',
        price: '$10,000',
        featured: false,
        perks: [
          { item: 'Be the named Welcome, Bar, or Auction partner' },
          { item: 'Reserved table of ten with premium drinks package' },
          { item: 'Complimentary drinks throughout the evening' },
          { item: 'Logo in the AV loop and programme' },
          { item: 'Acknowledged from the stage' },
          { item: 'Named on the Everybody Eats website and socials' },
          { item: 'Shown in the Wrap Video' },
        ],
      },
      {
        tier: 'Bronze',
        badge: 'Five only',
        title: 'Corporate table',
        price: '$5,000',
        featured: false,
        perks: [
          { item: 'Reserved table of ten with premium drinks package' },
          { item: 'Complimentary drinks throughout the evening' },
          { item: 'Logo in the AV loop and programme' },
          { item: 'Acknowledged from the stage' },
          { item: 'Named on the Everybody Eats website' },
          { item: 'Shown in the Wrap Video' },
        ],
      },
    ],
  },

  table: {
    galaEmail: 'gala@everybodyeats.nz',
    eyebrow: 'Come with friends, whānau or colleagues',
    heading: 'Host a *table*',
    includes: [
      { item: 'Ten-seat reserved table' },
      { item: 'Canapés and welcome drink on arrival' },
      { item: 'Fabulous three-course dinner with live entertainment' },
      { item: 'Two bottles of wine with dinner, then pay as you go' },
    ],
    price: '$3,000',
    priceLabel: 'Table of ten, inclusive of GST',
    seatNote: 'Individual tickets $330 on shared tables.',
    ctaLabel: 'Book a table',
    ctaUrl: '',
    secondaryCtaLabel: 'Individual tickets',
    secondaryCtaUrl: '',
    imageCaption: 'Images from previous Everybody Eats Galas',
  },

  auction: {
    galaEmail: 'gala@everybodyeats.nz',
    eyebrow: 'The heart of the night’s fundraising',
    heading: 'Donate items *for auction*',
    body: 'Every item donated converts directly into meals served.',
    options: [
      {
        label: 'Option 1 — The live auction',
        title: 'The Showstoppers',
        body: 'Rare, high-value or money-can’t-buy: luxury travel and stays, exclusive experiences, fine art, bespoke pieces, once-in-a-lifetime access. A tightly curated selection, each introduced from the stage to a captive audience.',
      },
      {
        label: 'Option 2 — The silent auction',
        title: 'The Collection',
        body: 'Broader and accessible: hospitality and getaway packages, premium products, vouchers and curated bundles. Open for bids nationwide for 10 days prior, promoted to our social followers and newsletter subscribers.',
      },
    ],
    note: '*Auction donations close Tuesday 30 September* — this gives us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
    imageCaption: 'Images from previous Everybody Eats Galas',
  },

  inKind: {
    galaEmail: 'gala@everybodyeats.nz',
    majorGiftsEmail: 'amy@everybodyeats.nz',
    heading: 'In-kind *donations*',
    body: 'Not everything that fuels the night comes as cash. Every bottle, box of produce or gifted service is a dollar redirected from event costs into meals for the community. We welcome wine, beer, spirits and beverages, food and produce for the kitchen, and services such as printing, AV, photography, florals and production.',
    benefits: [
      {
        item: 'Your name, logo or brand introduced to the room via AV loop, and printed in the programme',
      },
      { item: 'Your logo on the Gala page at everybodyeats.nz/gala' },
      { item: 'Association with one of New Zealand’s most trusted charitable social enterprises' },
      { item: 'Access to our Wrap Video collateral to promote on your business platforms' },
      { item: 'The knowledge that your gift feeds people with dignity, long after the night ends' },
    ],
    note: 'Partnering is simple — tell us what you can offer and we handle the rest. Prefer to give directly? Major gifts and event underwriting make a big difference: talk to Amy at {majorGiftsEmail}.',
  },

  quotes: {
    capsTitle: 'Proven & unforgettable',
    eyebrow: '2022 · 2023 · 2024 — a proven track record',
    quotes: [
      {
        quote:
          'The word ‘gala’ can conjure a stuffy, dry evening. But the infamous EE Gala is the opposite. Powerful speakers, delicious food, a fun atmosphere and auctions for all budgets. A certified can’t-miss hoot.',
        name: 'Freddie Coltart',
        place: 'Hawke’s Bay',
      },
      {
        quote:
          'A fun night, delicious food and so many tempting auction items — all for a great cause. Loved it!',
        name: 'Leisha Jones',
        place: 'Auckland',
      },
      {
        quote:
          'It’s rare to find an event that’s both genuinely enjoyable and meaningful, but this one struck that balance perfectly. I’d encourage anyone to attend and experience it for themselves.',
        name: 'Matthew Hall-White',
        place: 'Auckland',
      },
      {
        quote:
          'A beautiful opportunity to both learn and contribute to the ongoing work of Everybody Eats. A fun, inspiring and delicious evening spent with a room full of fun, inspiring and delicious people.',
        name: 'Amber Armitage',
        place: 'Auckland',
      },
      {
        quote:
          'As someone who is passionate about food and the way it can bring people together and create social change, it felt great to support an organisation that’s actively tackling food waste, food insecurity, and loneliness in our communities.',
        name: 'Katya Old',
        place: 'Auckland',
      },
    ],
  },

  closing: {
    galaEmail: 'gala@everybodyeats.nz',
    heading: 'Our *work changes lives*',
    body: 'We see it every day. We would be honoured to have your support.',
    secondaryCtaLabel: 'everybodyeats.nz',
    secondaryCtaUrl: 'https://everybodyeats.nz',
    footerLeft:
      'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
    footerRight: 'Photography from previous Everybody Eats Galas',
  },
}

// ── field helpers ────────────────────────────────────────────────────────────

const EM_HINT = 'Wrap a word in *asterisks* for the editorial italic.'

const text = (name: string, defaultValue: string, description?: string, label?: string) => ({
  name,
  type: 'text' as const,
  defaultValue,
  label,
  admin: description ? { description } : undefined,
})

const area = (name: string, defaultValue: string, description?: string) => ({
  name,
  type: 'textarea' as const,
  defaultValue,
  admin: description ? { description } : undefined,
})

const upload = (name: string, label: string, description?: string) => ({
  name,
  type: 'upload' as const,
  relationTo: 'media' as const,
  label,
  admin: {
    description: description ?? 'Optional. Falls back to the built-in image when left empty.',
  },
})

const list = (name: string, rows: { item: string }[], label: string) => ({
  name,
  type: 'array' as const,
  label,
  labels: { singular: 'Item', plural: 'Items' },
  defaultValue: rows,
  fields: [{ name: 'item', type: 'text' as const, required: true }],
})

const email = (name: string, defaultValue: string, description?: string) => ({
  name,
  type: 'email' as const,
  required: true,
  defaultValue,
  admin: description ? { description } : undefined,
})

const D = GALA_NOIR_DEFAULTS

// ── blocks ───────────────────────────────────────────────────────────────────

export const GalaNoirHero: Block = {
  slug: 'galaNoirHero',
  labels: { singular: 'Gala 2026 — Hero', plural: 'Gala 2026 — Hero' },
  fields: [
    upload('image', 'Background image', 'Full-screen backdrop. Defaults to the peacock feathers.'),
    text('eyebrow', D.hero.eyebrow),
    text('kitLine', D.hero.kitLine, `Top-right label. ${EM_HINT}`),
    text('scriptLine', D.hero.scriptLine, 'The italic script line above the big word.'),
    text('word', D.hero.word, 'The giant gradient word. Keep it short — every letter is huge.'),
    area('intro', D.hero.intro),
    {
      type: 'row',
      fields: [
        text('primaryCtaLabel', D.hero.primaryCtaLabel),
        text('secondaryCtaLabel', D.hero.secondaryCtaLabel),
      ],
    },
    email(
      'galaEmail',
      D.hero.galaEmail,
      'Fallback for the hero buttons when the Sponsor or Host-a-table section is not on the page.',
    ),
    {
      name: 'showCountdown',
      type: 'checkbox' as const,
      defaultValue: D.hero.showCountdown,
      admin: { description: 'Show the live countdown to the event.' },
    },
    {
      name: 'galaDateTime',
      type: 'date' as const,
      defaultValue: D.hero.galaDateTime,
      admin: {
        description: 'Drives the countdown. Use the event start time.',
        date: { pickerAppearance: 'dayAndTime' as const },
      },
    },
    list('ribbon', D.hero.ribbon, 'Scrolling ribbon items'),
  ],
}

export const GalaNoirProblem: Block = {
  slug: 'galaNoirProblem',
  labels: { singular: 'Gala 2026 — The problem', plural: 'Gala 2026 — The problem' },
  fields: [
    upload('image', 'Background image', 'Faint full-bleed backdrop. Defaults to the dinner plate.'),
    text('eyebrow', D.problem.eyebrow),
    text('heading', D.problem.heading, EM_HINT),
    {
      name: 'stats',
      type: 'array',
      defaultValue: D.problem.stats,
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        {
          name: 'figure',
          type: 'text',
          required: true,
          admin: { description: 'Numbers count up on scroll — e.g. “1 in 3”, “30%”, “1.22m”.' },
        },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    area('pullQuote', D.problem.pullQuote, EM_HINT),
    area('sources', D.problem.sources),
  ],
}

export const GalaNoirAbout: Block = {
  slug: 'galaNoirAbout',
  labels: { singular: 'Gala 2026 — About Everybody Eats', plural: 'Gala 2026 — About Everybody Eats' },
  fields: [
    text('heading', D.about.heading, EM_HINT),
    text('tagline', D.about.tagline),
    area('bodyLeft', D.about.bodyLeft),
    area('bodyRight', D.about.bodyRight),
    {
      type: 'row',
      fields: [text('linkLabel', D.about.linkLabel), text('linkUrl', D.about.linkUrl)],
    },
    {
      name: 'impactStats',
      type: 'array',
      defaultValue: D.about.impactStats,
      labels: { singular: 'Figure', plural: 'Figures' },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'Counts up on scroll — e.g. “332,234+”.' },
        },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const GalaNoirNight: Block = {
  slug: 'galaNoirNight',
  labels: { singular: 'Gala 2026 — The night', plural: 'Gala 2026 — The night' },
  fields: [
    upload('image', 'Photo', 'Defaults to the performers at the dinner table.'),
    text('imageCaption', D.night.imageCaption),
    text('eyebrow', D.night.eyebrow),
    text('heading', D.night.heading, EM_HINT),
    area('body', D.night.body),
    list('features', D.night.features, 'What to expect'),
    text('dresscode', D.night.dresscode),
  ],
}

export const GalaNoirPerformers: Block = {
  slug: 'galaNoirPerformers',
  labels: { singular: 'Gala 2026 — Performers', plural: 'Gala 2026 — Performers' },
  fields: [
    upload('image', 'Background image', 'Defaults to the iridescent texture.'),
    text('eyebrow', D.performers.eyebrow),
    text('heading', D.performers.heading, EM_HINT),
    {
      name: 'performers',
      type: 'array',
      defaultValue: D.performers.performers,
      labels: { singular: 'Performer', plural: 'Performers' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'bio', type: 'textarea', required: true },
        upload('image', 'Photo'),
      ],
    },
  ],
}

export const GalaNoirChefs: Block = {
  slug: 'galaNoirChefs',
  labels: { singular: 'Gala 2026 — Chefs', plural: 'Gala 2026 — Chefs' },
  fields: [
    upload('image', 'Background image', 'Defaults to the silk texture.'),
    text('eyebrow', D.chefs.eyebrow),
    text('heading', D.chefs.heading, EM_HINT),
    {
      name: 'chefs',
      type: 'array',
      defaultValue: D.chefs.chefs,
      labels: { singular: 'Chef', plural: 'Chefs' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'bio', type: 'textarea', required: true },
        upload('image', 'Photo'),
      ],
    },
  ],
}

export const GalaNoirCalculator: Block = {
  slug: 'galaNoirCalculator',
  labels: {
    singular: 'Gala 2026 — Why fundraise + seat calculator',
    plural: 'Gala 2026 — Why fundraise + seat calculator',
  },
  fields: [
    text('eyebrow', D.calculator.eyebrow),
    text('heading', D.calculator.heading, EM_HINT),
    area('body', D.calculator.body, EM_HINT),
    {
      type: 'row',
      fields: [
        { name: 'roomSeats', type: 'number' as const, defaultValue: D.calculator.roomSeats },
        { name: 'seatPrice', type: 'number' as const, defaultValue: D.calculator.seatPrice },
        { name: 'tablePrice', type: 'number' as const, defaultValue: D.calculator.tablePrice },
        {
          name: 'annualCost',
          type: 'number' as const,
          defaultValue: D.calculator.annualCost,
          admin: { description: 'Annual cost of running one restaurant — drives the “days of open doors” maths.' },
        },
      ],
    },
    text('roomLabel', D.calculator.roomLabel),
    text('sliderLabel', D.calculator.sliderLabel),
    area('footnote', D.calculator.footnote),
  ],
}

export const GalaNoirTiers: Block = {
  slug: 'galaNoirTiers',
  labels: { singular: 'Gala 2026 — Sponsorship tiers', plural: 'Gala 2026 — Sponsorship tiers' },
  fields: [
    text('eyebrow', D.tiers.eyebrow),
    text('heading', D.tiers.heading, EM_HINT),
    area('body', D.tiers.body),
    email('galaEmail', D.tiers.galaEmail, 'Enquiry address for every tier CTA.'),
    {
      name: 'tiers',
      type: 'array',
      defaultValue: D.tiers.tiers,
      labels: { singular: 'Tier', plural: 'Tiers' },
      fields: [
        { name: 'tier', type: 'text', required: true },
        {
          name: 'badge',
          type: 'text',
          required: true,
          admin: { description: 'Scarcity chip — e.g. “One only”.' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Gives the card the gradient “gold” treatment.' },
        },
        {
          name: 'perks',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [{ name: 'item', type: 'text', required: true }],
        },
      ],
    },
  ],
}

export const GalaNoirTable: Block = {
  slug: 'galaNoirTable',
  labels: { singular: 'Gala 2026 — Host a table', plural: 'Gala 2026 — Host a table' },
  fields: [
    upload('image', 'Photo', 'Defaults to the table setting.'),
    text('imageCaption', D.table.imageCaption),
    text('eyebrow', D.table.eyebrow),
    text('heading', D.table.heading, EM_HINT),
    list('includes', D.table.includes, 'Included'),
    {
      type: 'row',
      fields: [text('price', D.table.price), text('priceLabel', D.table.priceLabel)],
    },
    text('seatNote', D.table.seatNote),
    {
      type: 'row',
      fields: [
        text('ctaLabel', D.table.ctaLabel, undefined, 'Book a table — button text'),
        text(
          'ctaUrl',
          D.table.ctaUrl,
          'Humanitix booking link. Falls back to a mailto when empty.',
          'Book a table URL',
        ),
      ],
    },
    {
      type: 'row',
      fields: [
        text(
          'secondaryCtaLabel',
          D.table.secondaryCtaLabel,
          undefined,
          'Individual tickets — button text',
        ),
        text(
          'secondaryCtaUrl',
          D.table.secondaryCtaUrl,
          'Humanitix booking link. Falls back to a mailto when empty.',
          'Individual tickets URL',
        ),
      ],
    },
    email('galaEmail', D.table.galaEmail),
  ],
}

export const GalaNoirAuction: Block = {
  slug: 'galaNoirAuction',
  labels: { singular: 'Gala 2026 — Auction', plural: 'Gala 2026 — Auction' },
  fields: [
    upload('image', 'Photo', 'Defaults to the auctioneer on stage.'),
    text('imageCaption', D.auction.imageCaption),
    text('eyebrow', D.auction.eyebrow),
    text('heading', D.auction.heading, EM_HINT),
    area('body', D.auction.body),
    {
      name: 'options',
      type: 'array',
      defaultValue: D.auction.options,
      labels: { singular: 'Option', plural: 'Options' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    area(
      'note',
      D.auction.note,
      `${EM_HINT} Any email address is auto-linked; {galaEmail} inserts the contact address.`,
    ),
    email('galaEmail', D.auction.galaEmail),
  ],
}

export const GalaNoirInKind: Block = {
  slug: 'galaNoirInKind',
  labels: { singular: 'Gala 2026 — In-kind donations', plural: 'Gala 2026 — In-kind donations' },
  fields: [
    text('heading', D.inKind.heading, EM_HINT),
    area('body', D.inKind.body),
    list('benefits', D.inKind.benefits, 'What your donation gives you'),
    area(
      'note',
      D.inKind.note,
      'Any email address is auto-linked; {galaEmail} / {majorGiftsEmail} insert the contact addresses.',
    ),
    {
      type: 'row',
      fields: [
        email('galaEmail', D.inKind.galaEmail),
        email('majorGiftsEmail', D.inKind.majorGiftsEmail),
      ],
    },
  ],
}

export const GalaNoirQuotes: Block = {
  slug: 'galaNoirQuotes',
  labels: { singular: 'Gala 2026 — Testimonials', plural: 'Gala 2026 — Testimonials' },
  fields: [
    upload('image', 'Background image', 'Rendered as a magenta duotone. Defaults to the gala room.'),
    text('capsTitle', D.quotes.capsTitle, 'The big display-caps title.'),
    text('eyebrow', D.quotes.eyebrow),
    {
      name: 'quotes',
      type: 'array',
      defaultValue: D.quotes.quotes,
      labels: { singular: 'Quote', plural: 'Quotes' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'place', type: 'text' },
      ],
    },
  ],
}

export const GalaNoirClosing: Block = {
  slug: 'galaNoirClosing',
  labels: { singular: 'Gala 2026 — Closing call to action', plural: 'Gala 2026 — Closing call to action' },
  fields: [
    upload('image', 'Photo', 'Defaults to the volunteers at the gala.'),
    text('heading', D.closing.heading, EM_HINT),
    area('body', D.closing.body),
    email('galaEmail', D.closing.galaEmail, 'The primary CTA is a mailto to this address.'),
    {
      type: 'row',
      fields: [
        text('secondaryCtaLabel', D.closing.secondaryCtaLabel),
        text('secondaryCtaUrl', D.closing.secondaryCtaUrl),
      ],
    },
    {
      type: 'row',
      fields: [text('footerLeft', D.closing.footerLeft), text('footerRight', D.closing.footerRight)],
    },
  ],
}

/** Every gala-noir block, in default page order — used by Pages.ts and the seed script. */
export const GALA_NOIR_BLOCKS = [
  GalaNoirHero,
  GalaNoirProblem,
  GalaNoirAbout,
  GalaNoirNight,
  GalaNoirPerformers,
  GalaNoirChefs,
  GalaNoirCalculator,
  GalaNoirTiers,
  GalaNoirTable,
  GalaNoirAuction,
  GalaNoirInKind,
  GalaNoirQuotes,
  GalaNoirClosing,
]
