import type { Block } from 'payload'

// Editable content for the bespoke Gala landing page (`/gala`). The whole page
// is a single block so its carefully-sequenced, theatrical layout can't be
// reordered into nonsense — editors change copy, lists, prices and photos while
// the design stays fixed in `gala-landing-block.tsx`.
//
// GALA_DEFAULTS is the single source of truth for the initial content: it seeds
// both the admin `defaultValue`s here and the page document (see
// `scripts/seed-gala-impact-pages.ts`), so the two never drift.

export const GALA_DEFAULTS = {
  galaEmail: 'gala@everybodyeats.nz',
  majorGiftsEmail: 'amy@everybodyeats.nz',
  galaDateTime: '2026-10-30T18:30:00+13:00',

  heroEyebrow: 'Fundraising Gala · Auckland',
  heroHeadingBefore: 'The ',
  heroHeadingHighlight: 'Everybody Eats',
  heroHeadingAfter: ' Gala',
  heroIntro:
    'Auckland trades the boardroom for the ballroom — a high-class drag cabaret evening in support of dignity on every plate.',
  heroDate: 'Friday 30 October 2026',
  heroLocation: 'St Matthew-in-the-City, Auckland CBD',
  heroPrimaryCtaLabel: 'Host a table',
  heroSecondaryCtaLabel: 'Become a sponsor',

  nightEyebrow: 'The night',
  nightHeading: 'Our most *audacious* evening of the year',
  nightBody:
    'The Everybody Eats Gala is our most audacious fundraising event — and this year, guests can expect a high-class drag cabaret evening where Auckland’s most influential names trade the boardroom for the ballroom.',
  nightList: [
    { item: 'Live drag cabaret' },
    { item: 'Canapés on arrival' },
    { item: 'Free-flowing drinks' },
    { item: 'Three incredible courses' },
    { item: 'Live auctions' },
    { item: 'Silent auctions' },
  ],

  problemEyebrow: 'The problem',
  problemHeading: 'Hunger in Aotearoa is closer than most of us think',
  problemStats: [
    {
      figure: '1 in 5',
      body: 'children in New Zealand live in households where food runs out often, or sometimes.',
    },
    {
      figure: '1 in 3',
      body: 'households experience food insecurity — most in just the last 12 months, driven by the cost-of-living crisis.',
    },
    {
      figure: '49%',
      body: 'of food-insecure Kiwi families refuse to ask for charity, because of intense shame and embarrassment.',
    },
    {
      figure: '30%',
      body: 'of full-time Kiwi workers rely on food assistance or struggle to buy groceries for their families.',
    },
  ],
  problemFootnote:
    'At the same time, 1.22 million tonnes of food are lost or wasted across the supply chain each year — 237 kg for every person in the country. Having a job is no longer a shield.',
  problemSources:
    'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',

  whoEyebrow: 'Who is Everybody Eats',
  whoHeading:
    'A social enterprise turning rescued food into restaurant-quality, pay-what-you-can meals — served with *dignity*, no questions asked.',
  whoBody:
    'Founded in Auckland in 2017, we’ve grown from a single Monday-night pop-up into three permanent restaurants and nationwide pop-ups, built on manaakitanga, kaitiakitanga and whanaungatanga. Every service tackles three problems at once — food waste, food insecurity and social isolation — and proves dignity doesn’t have to cost more.',
  impactStats: [
    { value: '279,807+', label: 'Meals served' },
    { value: '139,904+', label: 'Kg of food rescued' },
    { value: '174,853+', label: 'Volunteer hours' },
  ],

  performersEyebrow: 'Meet the performers',
  performersHeading: 'The stars of the *cabaret*',
  performers: [
    {
      name: 'Hugo Grrrl',
      role: 'MC / Producer',
      bio: 'Aotearoa’s leading drag king: a celebrated performer, comedian and MC who blends sharp wit with dazzling theatricality. The first drag king and transgender man to win a televised drag competition, Hugo is a trailblazing force in New Zealand entertainment.',
    },
    {
      name: 'Slay West',
      role: 'Performer',
      bio: 'One of Wellington’s most beloved drag entertainers, renowned for infectious energy, quick wit and the ability to light up any room. A proud member of the acclaimed Māori drag collective The Tīwhas, Slay brings warmth, charisma and joy that leave a lasting impression.',
    },
    {
      name: 'Altra Violet',
      role: 'Performer',
      bio: 'Also known as Robin Yablind, Altra is an award-winning cabaret artist, choreographer and drag performer, and a beloved fixture of Wellington’s queer arts scene. Blending drag, burlesque, dance and theatre, this takatāpui artist brings exceptional creativity, stage presence and heart to every performance.',
    },
  ],

  chefsEyebrow: 'Meet the chefs',
  chefsHeading: 'Three courses, cooked with *heart*',
  chefs: [
    {
      name: 'Archana Kurup',
      location: 'Onehunga',
      bio: 'Trained across cuisines and continents, Archana’s cooking is a celebration of food’s ability to nourish and unite. Her joy for feeding people shines in every delicious plate that supports the kaupapa of Everybody Eats.',
    },
    {
      name: 'Urisha Sing',
      location: 'Glen Innes',
      bio: 'Urisha cooks with compassion and adapts creatively, honouring both her cultural roots and the diverse communities she serves — making her a powerful advocate for tackling food insecurity and uniting people around the table.',
    },
    {
      name: 'Harri Fletcher',
      location: 'Wellington',
      bio: 'Harri’s love of travel and global cuisines inspires bold, flavourful food. With a background in pay-as-you-can dining in the UK, she’s passionate about fighting food waste and making delicious food accessible to all.',
    },
  ],

  sponsorEyebrow: 'Get involved · Headline the Gala',
  sponsorHeading: 'Put your brand at the *centre* of the night',
  sponsorBody:
    'Two ways to headline Auckland’s most talked-about evening — a room of just 200 decision-makers, business leaders, philanthropists and tastemakers you can’t buy your way into with ad spend.',
  tiers: [
    {
      eyebrow: 'Naming sponsor',
      badge: 'One only',
      title: 'The [Your Name] Everybody Eats Gala',
      price: '$25,000',
      includes: [
        { item: 'A reserved table of ten' },
        { item: 'The Gala carries your name, everywhere' },
        { item: 'Sole spotlight in the AV loop and programme' },
        { item: 'Named from the stage by the MC' },
      ],
    },
    {
      eyebrow: 'Premiere sponsor',
      badge: 'Three only',
      title: 'Name a moment of the night',
      price: '$10,000',
      includes: [
        { item: 'A reserved table of ten' },
        { item: 'Host the welcome, the bar or the auction' },
        { item: 'Logo in the AV loop and programme' },
        { item: 'Thanked from the stage' },
      ],
    },
  ],

  tableEyebrow: 'Host a table',
  tableHeading: 'Bring your team. Host your clients.',
  tableBody:
    'Reserve a table of ten in a room of just 200 — the kind of night your guests talk about long afterwards.',
  tableList: [
    { item: 'Ten seats at a reserved table in a room of just 200' },
    { item: 'Canapés on arrival, three fabulous courses, drinks throughout' },
    { item: 'A high-class drag cabaret, live auctions and the full Gala experience' },
  ],
  tablePrice: '$3,000',
  tablePriceLabel: 'per table of ten',
  seatPrice: '$320',
  seatPriceLabel: 'individual seat',
  tableCtaLabel: 'Reserve your table',

  auctionEyebrow: 'Donate items for auction',
  auctionHeading: 'The auction is the *heart* of the night',
  auctionBody:
    'Every item donated converts directly into meals served, and your generosity is named to a room of 200 of Auckland’s most influential guests.',
  auctionOptions: [
    {
      label: 'Option 1',
      title: 'The Live Auction — the showstoppers',
      body: 'Rare, high-value or money-can’t-buy: luxury travel and stays, exclusive experiences, fine art, bespoke pieces, once-in-a-lifetime access. Six to eight items only, each introduced from the stage to a captive audience.',
    },
    {
      label: 'Option 2',
      title: 'The Silent Auction — the collection',
      body: 'Broader and accessible: hospitality and getaway packages, premium products, vouchers and curated bundles. Open for bids nationwide for ten days prior, promoted to our 40,000+ social followers and 6,000+ newsletter subscribers — reaching far beyond the room.',
    },
  ],
  inKindEyebrow: 'In-kind donations',
  inKindHeading: 'Pour into the night',
  inKindBody:
    'Not everything that fuels the night comes as cash. Every bottle of wine, beer or spirits, every box of produce for the kitchen, every gifted service — printing, AV, photography, florals — is a dollar that goes to feeding people instead of running the event. We name your generosity in the room and in the programme.',
  inKindCtaLabel: 'Offer an in-kind gift',
  majorGiftsNote:
    'Prefer to give directly? Major gifts and event underwriting make the biggest single difference of all — talk to Amy at {majorGiftsEmail}.',

  partnershipEyebrow: 'What your partnership gives you',
  partnershipHeading: 'Support that *defends itself*',
  partnershipBody:
    'Your support converts straight into outcomes your board and ESG reporting can use: meals served with dignity, kilograms diverted from landfill, emissions avoided, community hours mobilised. We give you the figures and the human story behind them.',
  partnershipNote:
    'Partnering is simple — tell us what you can offer and we handle the rest, from listing to delivery on the night. Donations close *Tuesday 30 September*, giving us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
  partnership: [
    {
      item: 'Your name, logo or brand introduced to the room via the AV loop, and printed in the programme',
    },
    { item: 'Your logo on the Gala page at everybodyeats.nz/gala' },
    { item: 'Association with one of New Zealand’s most trusted social enterprises' },
    { item: 'Access to our wrap-video collateral to promote on your own platforms' },
    { item: 'The knowledge that your gift feeds people with dignity, long after the night ends' },
  ],

  quotesEyebrow: 'Proven & unforgettable',
  quotesHeading: 'A certified *can’t-miss* hoot',
  quotes: [
    {
      quote:
        'The gala dinner was a beautiful opportunity to both learn and contribute to the ongoing work of Everybody Eats and those they support. A fun, inspiring and delicious evening spent with a room full of fun, inspiring and delicious people.',
      name: 'Amber Armitage',
      place: 'Auckland',
    },
    {
      quote:
        'A fantastic evening. Great food, a wonderful atmosphere, and a cause that really matters. It’s rare to find an event that’s both genuinely enjoyable and meaningful, but this one struck that balance perfectly. I’d encourage anyone to attend.',
      name: 'Matthew Hall-White',
      place: 'Auckland',
    },
    {
      quote:
        'The word “gala” can conjure a stuffy, dry evening. But the infamous EE Gala is the opposite. Powerful speakers, delicious food, a fun atmosphere and auctions for all budgets. A certified can’t-miss hoot.',
      name: 'Freddie Coltart',
      place: 'Hawke’s Bay',
    },
    {
      quote:
        'A beautiful event with delicious food. As someone passionate about the way food can bring people together and create social change, it felt great to support an organisation actively tackling food waste, food insecurity, and loneliness in our communities.',
      name: 'Katya Old',
      place: 'Auckland',
    },
    {
      quote:
        'A fun night, delicious food and so many tempting auction items — all for a great cause. Loved it!',
      name: 'Leisha Jones',
      place: 'Auckland',
    },
  ],

  moneyEyebrow: 'Where the money goes',
  moneyHeading: 'Every dollar keeps the *doors open*',
  moneyBody:
    'It costs $300,000 a year to keep one of our restaurants open — the rent, the kitchen, the food, the core team, the doors that stay open to anyone who walks in. Every dollar raised at the Gala goes straight back into keeping those doors open.',
  moneyCards: [
    { value: 'One seat', body: 'keeps a restaurant’s doors open for half a day.' },
    { value: 'One table', body: 'keeps a restaurant open for nearly a week.' },
    {
      value: '$150,000+',
      body: 'raised in this room last year — six full months of one restaurant open.',
    },
  ],

  closingEyebrow: 'Get in touch',
  closingHeading: 'Our work changes lives. We see it *every day.*',
  closingBody:
    'We would be honoured to have your support on Friday 30 October. Host a table, headline the night, or donate to the auction — every gesture feeds people with dignity, long after the night ends.',
  closingSecondaryCtaLabel: 'everybodyeats.nz',
}

const list = (name: string, rows: { item: string }[], label: string) => ({
  name,
  type: 'array' as const,
  label,
  labels: { singular: 'Item', plural: 'Items' },
  defaultValue: rows,
  fields: [{ name: 'item', type: 'text' as const, required: true }],
})

const uploadField = (name: string, label: string) => ({
  name,
  type: 'upload' as const,
  relationTo: 'media' as const,
  label,
  admin: { description: 'Optional. Falls back to the built-in image when left empty.' },
})

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

export const GalaLanding: Block = {
  slug: 'galaLanding',
  labels: { singular: 'Gala landing page', plural: 'Gala landing page' },
  fields: [
    {
      type: 'collapsible',
      label: 'Contact & event',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'galaEmail',
          type: 'email',
          required: true,
          defaultValue: GALA_DEFAULTS.galaEmail,
          admin: { description: 'Enquiry address used by every “host / sponsor / donate” button.' },
        },
        {
          name: 'majorGiftsEmail',
          type: 'email',
          required: true,
          defaultValue: GALA_DEFAULTS.majorGiftsEmail,
        },
        {
          name: 'galaDateTime',
          type: 'date',
          defaultValue: GALA_DEFAULTS.galaDateTime,
          admin: {
            description: 'Drives the live countdown. Use the event start time.',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hero',
      admin: { initCollapsed: true },
      fields: [
        uploadField('heroImage', 'Hero background image'),
        text('heroEyebrow', GALA_DEFAULTS.heroEyebrow),
        {
          type: 'row',
          fields: [
            text('heroHeadingBefore', GALA_DEFAULTS.heroHeadingBefore),
            text('heroHeadingHighlight', GALA_DEFAULTS.heroHeadingHighlight),
            text('heroHeadingAfter', GALA_DEFAULTS.heroHeadingAfter),
          ],
        },
        area('heroIntro', GALA_DEFAULTS.heroIntro),
        {
          type: 'row',
          fields: [
            text('heroDate', GALA_DEFAULTS.heroDate),
            text('heroLocation', GALA_DEFAULTS.heroLocation),
          ],
        },
        {
          type: 'row',
          fields: [
            text('heroPrimaryCtaLabel', GALA_DEFAULTS.heroPrimaryCtaLabel),
            text('heroSecondaryCtaLabel', GALA_DEFAULTS.heroSecondaryCtaLabel),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'The night',
      admin: { initCollapsed: true },
      fields: [
        text('nightEyebrow', GALA_DEFAULTS.nightEyebrow),
        area('nightHeading', GALA_DEFAULTS.nightHeading, EM_HINT),
        area('nightBody', GALA_DEFAULTS.nightBody),
        uploadField('nightImage', 'Performers image'),
        list('nightList', GALA_DEFAULTS.nightList, 'Experience list'),
      ],
    },
    {
      type: 'collapsible',
      label: 'The problem',
      admin: { initCollapsed: true },
      fields: [
        text('problemEyebrow', GALA_DEFAULTS.problemEyebrow),
        area('problemHeading', GALA_DEFAULTS.problemHeading, EM_HINT),
        {
          name: 'problemStats',
          type: 'array',
          defaultValue: GALA_DEFAULTS.problemStats,
          labels: { singular: 'Stat', plural: 'Stats' },
          fields: [
            { name: 'figure', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
        area('problemFootnote', GALA_DEFAULTS.problemFootnote),
        area('problemSources', GALA_DEFAULTS.problemSources),
      ],
    },
    {
      type: 'collapsible',
      label: 'Who we are + impact',
      admin: { initCollapsed: true },
      fields: [
        text('whoEyebrow', GALA_DEFAULTS.whoEyebrow),
        area('whoHeading', GALA_DEFAULTS.whoHeading, EM_HINT),
        area('whoBody', GALA_DEFAULTS.whoBody),
        {
          name: 'impactStats',
          type: 'array',
          defaultValue: GALA_DEFAULTS.impactStats,
          labels: { singular: 'Figure', plural: 'Figures' },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Performers',
      admin: { initCollapsed: true },
      fields: [
        text('performersEyebrow', GALA_DEFAULTS.performersEyebrow),
        area('performersHeading', GALA_DEFAULTS.performersHeading, EM_HINT),
        {
          name: 'performers',
          type: 'array',
          defaultValue: GALA_DEFAULTS.performers,
          labels: { singular: 'Performer', plural: 'Performers' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', required: true },
            { name: 'bio', type: 'textarea', required: true },
            uploadField('image', 'Photo'),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Chefs',
      admin: { initCollapsed: true },
      fields: [
        text('chefsEyebrow', GALA_DEFAULTS.chefsEyebrow),
        area('chefsHeading', GALA_DEFAULTS.chefsHeading, EM_HINT),
        {
          name: 'chefs',
          type: 'array',
          defaultValue: GALA_DEFAULTS.chefs,
          labels: { singular: 'Chef', plural: 'Chefs' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'location', type: 'text', required: true },
            { name: 'bio', type: 'textarea', required: true },
            uploadField('image', 'Photo'),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Sponsorship tiers',
      admin: { initCollapsed: true },
      fields: [
        text('sponsorEyebrow', GALA_DEFAULTS.sponsorEyebrow),
        area('sponsorHeading', GALA_DEFAULTS.sponsorHeading, EM_HINT),
        area('sponsorBody', GALA_DEFAULTS.sponsorBody),
        {
          name: 'tiers',
          type: 'array',
          defaultValue: GALA_DEFAULTS.tiers,
          labels: { singular: 'Tier', plural: 'Tiers' },
          fields: [
            { name: 'eyebrow', type: 'text', required: true },
            { name: 'badge', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'price', type: 'text', required: true },
            {
              name: 'includes',
              type: 'array',
              labels: { singular: 'Item', plural: 'Items' },
              fields: [{ name: 'item', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Host a table',
      admin: { initCollapsed: true },
      fields: [
        uploadField('tableImage', 'Table image'),
        text('tableEyebrow', GALA_DEFAULTS.tableEyebrow),
        area('tableHeading', GALA_DEFAULTS.tableHeading, EM_HINT),
        area('tableBody', GALA_DEFAULTS.tableBody),
        list('tableList', GALA_DEFAULTS.tableList, 'Included'),
        {
          type: 'row',
          fields: [
            text('tablePrice', GALA_DEFAULTS.tablePrice),
            text('tablePriceLabel', GALA_DEFAULTS.tablePriceLabel),
          ],
        },
        {
          type: 'row',
          fields: [
            text('seatPrice', GALA_DEFAULTS.seatPrice),
            text('seatPriceLabel', GALA_DEFAULTS.seatPriceLabel),
          ],
        },
        text('tableCtaLabel', GALA_DEFAULTS.tableCtaLabel),
      ],
    },
    {
      type: 'collapsible',
      label: 'Auction & in-kind',
      admin: { initCollapsed: true },
      fields: [
        text('auctionEyebrow', GALA_DEFAULTS.auctionEyebrow),
        area('auctionHeading', GALA_DEFAULTS.auctionHeading, EM_HINT),
        area('auctionBody', GALA_DEFAULTS.auctionBody),
        {
          name: 'auctionOptions',
          type: 'array',
          defaultValue: GALA_DEFAULTS.auctionOptions,
          labels: { singular: 'Option', plural: 'Options' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
        text('inKindEyebrow', GALA_DEFAULTS.inKindEyebrow),
        area('inKindHeading', GALA_DEFAULTS.inKindHeading, EM_HINT),
        area('inKindBody', GALA_DEFAULTS.inKindBody),
        text('inKindCtaLabel', GALA_DEFAULTS.inKindCtaLabel),
        area(
          'majorGiftsNote',
          GALA_DEFAULTS.majorGiftsNote,
          'Any email address is auto-linked. Use {majorGiftsEmail} / {galaEmail} to insert the contact addresses.',
        ),
      ],
    },
    {
      type: 'collapsible',
      label: 'Partnership benefits',
      admin: { initCollapsed: true },
      fields: [
        text('partnershipEyebrow', GALA_DEFAULTS.partnershipEyebrow),
        area('partnershipHeading', GALA_DEFAULTS.partnershipHeading, EM_HINT),
        area('partnershipBody', GALA_DEFAULTS.partnershipBody),
        area(
          'partnershipNote',
          GALA_DEFAULTS.partnershipNote,
          `${EM_HINT} Any email address is auto-linked; use {galaEmail} to insert the contact address.`,
        ),
        list('partnership', GALA_DEFAULTS.partnership, 'Benefits'),
      ],
    },
    {
      type: 'collapsible',
      label: 'Testimonials',
      admin: { initCollapsed: true },
      fields: [
        text('quotesEyebrow', GALA_DEFAULTS.quotesEyebrow),
        area('quotesHeading', GALA_DEFAULTS.quotesHeading, EM_HINT),
        {
          name: 'quotes',
          type: 'array',
          defaultValue: GALA_DEFAULTS.quotes,
          labels: { singular: 'Quote', plural: 'Quotes' },
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            { name: 'name', type: 'text', required: true },
            { name: 'place', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Where the money goes',
      admin: { initCollapsed: true },
      fields: [
        uploadField('moneyImage', 'Background image'),
        text('moneyEyebrow', GALA_DEFAULTS.moneyEyebrow),
        area('moneyHeading', GALA_DEFAULTS.moneyHeading, EM_HINT),
        area('moneyBody', GALA_DEFAULTS.moneyBody),
        {
          name: 'moneyCards',
          type: 'array',
          defaultValue: GALA_DEFAULTS.moneyCards,
          labels: { singular: 'Card', plural: 'Cards' },
          maxRows: 3,
          admin: {
            description:
              'Exactly three cards — each keeps its built-in illustration; the third is the highlighted card.',
          },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Closing call to action',
      admin: { initCollapsed: true },
      fields: [
        uploadField('closingImage', 'Volunteers image'),
        text('closingEyebrow', GALA_DEFAULTS.closingEyebrow),
        area('closingHeading', GALA_DEFAULTS.closingHeading, EM_HINT),
        area('closingBody', GALA_DEFAULTS.closingBody),
        text('closingSecondaryCtaLabel', GALA_DEFAULTS.closingSecondaryCtaLabel),
      ],
    },
  ],
}
