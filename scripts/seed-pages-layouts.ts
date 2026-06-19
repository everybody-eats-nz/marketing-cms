/**
 * Populate ALL marketing Pages docs with block-based layouts mirroring the
 * original bespoke routes. Idempotent: every doc is upserted by slug.
 *
 * Usage:
 *   pnpm tsx scripts/seed-pages-layouts.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Layout = any[]

type PageSpec = {
  slug: string
  title: string
  seo?: { title?: string; description?: string }
  layout: Layout
  // When 'published', the doc is seeded live (not left as a draft). Use for
  // pages the nav/footer link to that must be visible immediately.
  status?: 'draft' | 'published'
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    limit: 200,
    depth: 0,
  })

  const homeHeroImage = (existing.docs.find((d: any) => d.slug === 'home') as any)?.hero?.image
  const firstLocation = await payload.find({
    collection: 'locations',
    limit: 1,
    sort: 'name',
    depth: 1,
  })
  const ourStoryHeroImage = (firstLocation.docs[0] as any)?.heroImage

  // Reuse images already in the media library for the new corporate pages.
  // `diners` is the same Webflow asset as the live catering-events hero; the
  // McVinnie kitchen shot fits the hands-on cooking-session pages.
  const findMediaId = async (frag: string) => {
    const r = await payload.find({
      collection: 'media',
      where: { filename: { contains: frag } },
      limit: 1,
      depth: 0,
    })
    return (r.docs[0] as any)?.id
  }
  const dinersImage = await findMediaId('diners')
  const kitchenImage = await findMediaId('Alex-McVinnie')

  const pages: PageSpec[] = [
    {
      slug: 'our-story',
      title: 'Our story',
      seo: {
        description:
          'Everybody Eats started in 2017 with a pop-up dinner in Auckland and a question: what if a restaurant served everyone, regardless of what they could pay?',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Our story',
          heading: 'What started as *one* meal\nbecame a *movement*.',
          subheading:
            "In 2017, Nick Loosley hosted a pop-up dinner in Auckland with a single question: what if a restaurant served everyone, regardless of what they could pay? That night was packed. Eight years later we're a registered charity serving thousands of meals across three restaurants.",
          image: ourStoryHeroImage,
        },
        ourStoryHeroImage && {
          blockType: 'media',
          image: ourStoryHeroImage,
          aspect: '16:8',
        },
        {
          blockType: 'process',
          eyebrow: 'How it works',
          heading: 'From *rescued food* to a shared table.',
          items: [
            {
              number: '01',
              title: 'Food rescue',
              copy: 'We collect surplus food from supermarkets, growers and producers — perfectly good meat and veg that is a little wonky or close to its date — in our electric vans, before any of it can go to waste.',
            },
            {
              number: '02',
              title: 'Preparation',
              copy: 'Each afternoon our chefs turn that day’s rescued ingredients into a fresh three-course menu, with volunteers learning to cook and cut waste right alongside them.',
            },
            {
              number: '03',
              title: 'Service',
              copy: 'At 6pm the doors open. Guests share long tables, volunteers carry the plates, and strangers become neighbours over dinner.',
            },
            {
              number: '04',
              title: 'Pay as you feel',
              copy: 'There are no prices. Pay what you can — more to cover someone else’s meal, less if times are tight — so everyone eats with dignity.',
            },
          ],
        },
        {
          blockType: 'values',
          eyebrow: 'What drives us',
          missionLabel: 'Our mission',
          mission:
            'To address food waste, food insecurity and social isolation in *Aotearoa*.',
          visionLabel: 'Our vision',
          vision:
            'Everybody Eats restaurants across the country — building stronger communities and making a *measurable difference*.',
          valuesLabel: 'Ngā Uara — our values',
          items: [
            {
              term: 'Whanaungatanga',
              translation: 'Connection & belonging',
              copy: 'We build community through trust, connection and a shared sense of belonging at every table.',
            },
            {
              term: 'Manaakitanga',
              translation: 'Care & hospitality',
              copy: 'We look after one another with generosity, care and empathy — everyone is welcome, no questions asked.',
            },
            {
              term: 'Kaitiakitanga',
              translation: 'Guardianship',
              copy: 'We care for our environment through a circular, waste-free food system that gives good food a second life.',
            },
          ],
        },
        {
          blockType: 'timeline',
          eyebrow: 'A short history',
          heading: 'From *pop-up* to *permanent*.',
          items: [
            {
              year: '2016',
              title: 'An idea takes shape',
              body: 'Founder Nick Loosley, drawing on years in hospitality, sets out to tackle food insecurity and food waste together.',
            },
            {
              year: '2017',
              title: 'The first pop-up',
              body: 'A pay-as-you-feel pop-up at Gemmayze Street in St Kevin’s Arcade sells out — and wins the Restaurant Association’s Good Neighbour Award.',
            },
            {
              year: '2018',
              title: 'A registered charity',
              body: 'Everybody Eats becomes a charity, a crowdfunding campaign raises $129,000, and Nick is named a Westfield Local Hero.',
            },
            {
              year: '2019',
              title: 'Onehunga opens',
              body: 'Our flagship Onehunga restaurant opens permanently, serving five nights a week.',
            },
            {
              year: '2020',
              title: '20,000 meals',
              body: 'Wellington and Papamoa pop-ups launch, we serve our 20,000th meal, and we pivot to takeaways through lockdown. Nick is named Kiwibank Local Hero of the Year.',
            },
            {
              year: '2021',
              title: '50,000 meals',
              body: 'We pass 50,000 meals and launch the Goodie Box with DDB and Al Brown.',
            },
            {
              year: '2023',
              title: '100,000 meals',
              body: 'Our 100,000th meal is served and a third restaurant opens in Glen Innes, alongside shared space Tātou.',
            },
            {
              year: '2024',
              title: '200,000 meals',
              body: 'We reach 200,000 meals served, and Wellington wins Outstanding Sustainability Practices at the Welly Hospo Awards.',
            },
            {
              year: 'Today',
              title: 'One big table',
              body: 'Three restaurants, hundreds of volunteers, and one pay-as-you-feel table that keeps on growing.',
            },
          ],
        },
        {
          blockType: 'stats',
          eyebrow: 'Our impact',
          heading: 'By the *numbers*',
          variant: 'darkPanel',
          source: 'global',
        },
        {
          blockType: 'testimonials',
          eyebrow: 'From our guests',
          heading: 'Pull up a chair, *stay a while*.',
          items: [
            {
              quote: 'The staff were so attentive and friendly. I left feeling cared for, not just fed.',
              attribution: 'Diner, Onehunga',
            },
            {
              quote: 'I was genuinely blown away by how good the food was — three courses, all from rescued ingredients.',
              attribution: 'Diner, Wellington',
            },
            {
              quote: 'Everybody Eats has been a life saver for me, financially and socially. It’s a place to belong.',
              attribution: 'Diner, Glen Innes',
            },
            {
              quote: 'We came in to celebrate a birthday and couldn’t have asked for a warmer welcome. Thank you for making it special.',
              attribution: 'Diner, Wellington',
            },
            {
              quote: 'Ka pai to the whole team. You’re doing something really special here.',
              attribution: 'Diner, Onehunga',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          heading: 'Be part of *the next chapter*.',
          variant: 'sun',
          align: 'center',
          primaryCta: { label: 'Donate', href: '/get-involved/donate' },
          secondaryCta: { label: 'Volunteer', href: '/get-involved/volunteer' },
        },
      ].filter(Boolean) as Layout,
    },

    {
      slug: 'about/team',
      title: 'The team',
      seo: { description: 'The board, leadership and chefs behind Everybody Eats.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'The team',
          heading: 'The people behind *every plate*.',
          subheading:
            "We're a tiny team of paid staff supported by hundreds of volunteers across three restaurants. Together we serve thousands of meals every year.",
        },
        { blockType: 'teamGrid' },
      ],
    },

    {
      slug: 'about/faqs',
      title: 'FAQs',
      seo: { description: 'Common questions about pay-as-you-feel dining at Everybody Eats.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'FAQs',
          heading: 'The *good questions*.',
          subheading:
            "Everything we're asked most often, in one place. Can't find what you're looking for? Drop us a line on the contact page.",
        },
        { blockType: 'faqsAccordion' },
      ],
    },

    {
      // Slug matches the footer + secondary-nav link (/newsletter). Published so
      // it’s live the moment it’s seeded — the linked page used to be an empty draft.
      slug: 'newsletter',
      title: 'Newsletter',
      status: 'published',
      seo: { description: 'Stories from the table, monthly. Sign up for the Everybody Eats letter.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Newsletter',
          heading: 'Stories from the table,\n*monthly*.',
          subheading:
            "A short letter once a month: what we've been cooking, what's coming up, and the people behind every plate. No spam, unsubscribe anytime.",
        },
        {
          blockType: 'newsletterForm',
          footnote:
            'By subscribing you agree to receive our newsletter by email — we will never share your address, and you can unsubscribe from any letter.',
        },
      ],
    },

    {
      // Slug matches the footer + secondary-nav link (/contact). Published on seed
      // so the page that everything links to is no longer empty.
      slug: 'contact',
      title: 'Contact',
      status: 'published',
      seo: { description: 'Get in touch with the Everybody Eats team.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Contact',
          heading: 'Get in *touch*.',
          subheading:
            "Whether you want to volunteer, donate, partner with us, or just say kia ora — we'd love to hear from you. Pick the right inbox below and we'll get back to you.",
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Email us',
          heading: 'Pick the right *inbox*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'Say kia ora',
              copy: 'General questions, suggestions and kind words.',
              email: 'hello@everybodyeats.nz',
            },
            {
              title: 'Press & media',
              copy: 'Story pitches, interviews and photography requests.',
              email: 'press@everybodyeats.nz',
            },
            {
              title: 'Volunteer with us',
              copy: 'Lend an evening — front of house or in the kitchen.',
              email: 'volunteer@everybodyeats.nz',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Other ways to reach us',
          columns: '2',
          cardStyle: 'mixed',
          items: [
            {
              title: 'Find a restaurant',
              copy: 'Wed – Sat, 5pm – 9pm. Bookings recommended but walk-ins welcome.',
              ctaLabel: 'All locations →',
              href: '/dine-with-us',
              color: 'forest700',
            },
            {
              title: 'Stories, monthly.',
              copy: 'Behind-the-scenes notes, event announcements and the occasional recipe.',
              ctaLabel: 'Subscribe →',
              href: '/newsletter',
              color: 'sun',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          columns: '2',
          cardStyle: 'soft',
          items: [
            {
              title: 'Catering & corporate events',
              copy: 'Planning a catered event, venue hire or a team volunteering day? Start an enquiry and our events team will be in touch.',
              ctaLabel: 'Start an enquiry →',
              href: '/get-involved/catering-events',
            },
            {
              title: 'Partner or sponsor',
              copy: 'Food rescue partners, funders and sponsors keep every seat at the table free of judgment.',
              ctaLabel: 'Partner with us →',
              href: '/get-involved/partner',
            },
          ],
        },
      ],
    },

    {
      slug: 'dine-with-us',
      title: 'Dine with us',
      seo: {
        description:
          'Three pay-as-you-feel restaurants serving meals from rescued food across Aotearoa.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Three restaurants',
          heading: 'Pull up a chair.\n*Every*body eats.',
          subheading:
            "Our restaurants serve a three-course menu Wednesday through Saturday. Pay what feels right — generously, modestly, or anywhere in between. There's only ever one menu, made fresh that day from ingredients rescued from supermarkets, farms and producers.",
        },
        { blockType: 'locationsMagazine' },
      ],
    },

    {
      slug: 'get-involved',
      title: 'Get involved',
      seo: { description: 'Volunteer, donate, partner — three ways to help us serve everyone.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Get involved',
          heading: 'Pull up a chair.\n*Pitch in.*',
          subheading:
            "We're sustained by people who turn up — volunteers, donors and partners who believe in food without judgment. Here's how you can join in.",
        },
        {
          blockType: 'cardGrid',
          columns: '3',
          cardStyle: 'mixed',
          items: [
            {
              number: '01',
              title: 'Volunteer',
              copy: 'Cook with our chefs, serve our guests, or work behind the scenes.',
              ctaLabel: 'Learn more',
              href: '/get-involved/volunteer',
              color: 'forest700',
            },
            {
              number: '02',
              title: 'Donate',
              copy: 'Every gift fills another seat at the table.',
              ctaLabel: 'Learn more',
              href: '/get-involved/donate',
              color: 'sun',
            },
            {
              number: '03',
              title: 'Partner',
              copy: "Suppliers, food rescuers, businesses — let's work together.",
              ctaLabel: 'Learn more',
              href: '/get-involved/partner',
              color: 'cream',
            },
            {
              number: '04',
              title: 'Catering & events',
              copy: 'Cater a function, hire a restaurant, or bring your team into the kitchen — every booking feeds the community.',
              ctaLabel: 'Learn more',
              href: '/get-involved/catering-events',
              color: 'clay',
            },
            {
              number: '05',
              title: 'Team experiences',
              copy: 'Hands-on cooking sessions, private dinners and restaurant takeovers — meaningful days that give back.',
              ctaLabel: 'Learn more',
              href: '/get-involved/cooking-sessions',
              color: 'forest100',
            },
          ],
        },
        {
          blockType: 'partnersGrid',
          eyebrow: 'Partners',
          heading: "We couldn't do it *alone*.",
          viewAllLabel: 'Become a partner →',
          viewAllHref: '/get-involved/partner',
        },
      ],
    },

    {
      slug: 'get-involved/donate',
      title: 'Donate',
      seo: {
        description:
          'Every $20 puts another seat at our table. Donate once or set up a regular gift.',
      },
      layout: [
        {
          blockType: 'donateHero',
          eyebrow: 'Donate',
          heading: 'Set *another seat* at the table.',
          subheading:
            'Every $20 covers another meal — cooked, served, and shared with someone who might not otherwise eat tonight. Give once, or make it a habit.',
          panelLabel: 'A one-off gift',
          amounts: [
            { amount: 20, label: '1 meal' },
            { amount: 50, label: '~2 meals' },
            { amount: 100, label: '5 meals' },
            { amount: 200, label: '10 meals' },
          ],
          ctaLabel: 'Donate now →',
        },
        {
          blockType: 'cardGrid',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'Regular giving',
              copy: 'Set up a monthly gift and become part of our regular table.',
              ctaLabel: 'Set up monthly →',
              href: '/get-involved/regular-giving',
            },
            {
              title: 'Corporate giving',
              copy: 'Match employee donations, sponsor a service, or send your team to volunteer.',
              ctaLabel: 'Talk to us →',
              href: '/get-involved/corporate-giving',
            },
            {
              title: 'Fundraise for us',
              copy: 'Run a marathon, throw a dinner, set up a birthday fundraiser — we help with all of it.',
              ctaLabel: 'Start a fundraiser →',
              href: '/get-involved/fundraise',
            },
          ],
        },
      ],
    },

    {
      slug: 'get-involved/regular-giving',
      title: 'Regular giving',
      seo: {
        description:
          'Become an Everybody Eats superstar with a monthly gift. Pick an amount that suits your budget and help us plan ahead.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Regular giving',
          heading: 'Become an Everybody Eats\n*superstar*.',
          subheading:
            'Choose to support us with regular contributions and you help us plan and grow our impact across Aotearoa. Pick an amount that suits your budget below — or get in touch for a personalised giving plan.',
          secondaryCta: { label: 'Prefer to give once?', href: '/get-involved/donate' },
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Monthly giving',
          heading: 'Pick your *monthly* gift.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: '$10 / month',
              copy: 'A steady hand — helps cover a meal every month.',
              ctaLabel: 'Set up $10 →',
              href: 'https://buy.stripe.com/eVag0McpH070e2I3cd',
            },
            {
              title: '$20 / month',
              copy: 'Puts another seat at the table, month after month.',
              ctaLabel: 'Set up $20 →',
              href: 'https://buy.stripe.com/28odSEdtL070cYE4gi',
            },
            {
              title: '$50 / month',
              copy: 'Around three meals, every single month.',
              ctaLabel: 'Set up $50 →',
              href: 'https://buy.stripe.com/4gw4i4ahz8Dwf6MeUX',
            },
            {
              title: '$100 / month',
              copy: 'Five meals a month — a regular at our table.',
              ctaLabel: 'Set up $100 →',
              href: 'https://buy.stripe.com/7sI6qcgFX9HA4s87sw',
            },
            {
              title: '$250 / month',
              copy: 'Helps keep a whole service running.',
              ctaLabel: 'Set up $250 →',
              href: 'https://buy.stripe.com/14k6qc9dv0705wc28d',
            },
            {
              title: '$500 / month',
              copy: 'A champion of the pay-as-you-feel table.',
              ctaLabel: 'Set up $500 →',
              href: 'https://buy.stripe.com/eVa01O4Xf1b4gaQcMS',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Other ways to give regularly',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'A personalised plan',
              copy: 'Want to give a different amount, or talk it through? We will set up a plan that suits your budget.',
              email: 'amy@everybodyeats.nz',
            },
            {
              title: 'Bank transfer',
              copy: 'Kiwi Bank · Everybody Eats Charitable Trust · 38-9020-0272020-00. Use your name and organisation as the reference.',
            },
            {
              title: 'Claim it back',
              copy: 'Donations of $5 or more are eligible for a 33.33% tax credit through IRD. We email a receipt for every gift.',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          heading: 'Not ready for monthly? *Give once.*',
          body: 'Every one-off gift goes straight towards keeping our doors open and our communities fed.',
          variant: 'sun',
          align: 'center',
          primaryCta: { label: 'Make a one-off gift →', href: '/get-involved/donate' },
        },
      ],
    },

    {
      slug: 'get-involved/corporate-giving',
      title: 'Corporate giving',
      seo: {
        description:
          'Payroll giving, matched donations, team volunteering and more — partner your business with Everybody Eats.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Corporate giving',
          heading: "Let's build\n*healthier communities*.",
          subheading:
            'Strong partnerships with business help build healthier communities and a more sustainable future. There are many meaningful ways your company can get involved and make a lasting impact.',
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Ways to support',
          heading: 'Eight ways to *get involved*.',
          columns: '4',
          cardStyle: 'soft',
          items: [
            {
              number: '01',
              title: 'Payroll giving',
              copy: 'Make it easy for your team to give regularly. Even small contributions add up to big change.',
            },
            {
              number: '02',
              title: 'Team building',
              copy: 'Book a session in our kitchen — learn zero-waste cooking, prepare meals and package them for families in need.',
              ctaLabel: 'Explore team experiences →',
              href: '/get-involved/cooking-sessions',
            },
            {
              number: '03',
              title: 'Matched donations',
              copy: "Double the impact of your employees' generosity by matching their donations.",
            },
            {
              number: '04',
              title: 'Volunteer hours & skills',
              copy: 'Volunteer in our restaurants, or contribute professional skills and services to support our growth.',
            },
            {
              number: '05',
              title: 'Charity partnership',
              copy: 'Become an official partner and work with us on shared goals, campaigns and events.',
            },
            {
              number: '06',
              title: 'Host an event',
              copy: 'Use our welcoming spaces in Onehunga, Glen Innes or Wellington for your next meeting or celebration.',
              ctaLabel: 'Plan an event →',
              href: '/get-involved/catering-events',
            },
            {
              number: '07',
              title: 'Catering services',
              copy: 'Choose us for catering — surplus and seasonal options make every event tastier and more sustainable.',
              ctaLabel: 'See catering →',
              href: '/get-involved/catering-events',
            },
            {
              number: '08',
              title: 'Workplace fundraising',
              copy: 'Bake sales, quizzes, dress-up days — we provide a speaker, resources and ideas to get started.',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Making a donation',
          columns: '2',
          cardStyle: 'mixed',
          items: [
            {
              title: 'Donate by bank transfer',
              copy: 'For larger donations, or payments that need an invoice or tax receipt, donate directly: Kiwi Bank · Everybody Eats Charitable Trust · 38-9020-0272020-00. We can provide a donation receipt and certificate of appreciation on request.',
              color: 'cream',
            },
            {
              title: 'Tell us your plan',
              copy: "Get in touch to tell us what you're planning, or to request support for your team's activity.",
              email: 'susan@everybodyeats.nz',
              color: 'sun',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          heading: 'Make a difference *one plate at a time*.',
          body: "Let's create impact together. Tell us what you have in mind and we'll help make it happen.",
          variant: 'forest',
          align: 'center',
          primaryCta: {
            label: 'susan@everybodyeats.nz',
            href: 'mailto:susan@everybodyeats.nz?subject=Corporate giving',
          },
        },
      ],
    },

    {
      slug: 'get-involved/fundraise',
      title: 'Fundraise for us',
      seo: {
        description:
          'Bake, bike or throw a quiz night — every dollar you raise helps us rescue food and feed communities.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Fundraise',
          heading: 'Throw a *fundraiser*.\nFeed a community.',
          subheading:
            "Whether you're baking, biking or throwing a quiz night, every dollar you raise helps us rescue more food, keep our kitchens open and create dignified dining experiences for anyone who needs a good meal.",
        },
        {
          blockType: 'pillars',
          eyebrow: 'How it works',
          heading: 'Three steps to *get started*.',
          theme: 'forest',
          items: [
            {
              number: '01',
              title: 'Choose an idea',
              copy: 'Pick something that suits you — big or small. Anything goes, as long as it brings people together.',
              ctaLabel: 'Talk it through',
              href: 'mailto:amy@everybodyeats.nz?subject=Fundraising',
            },
            {
              number: '02',
              title: 'Set up a page',
              copy: 'Spin up an online fundraising page (Give-a-Little is great) so people can chip in from anywhere.',
              ctaLabel: 'Get help setting up',
              href: 'mailto:amy@everybodyeats.nz?subject=Fundraising',
            },
            {
              number: '03',
              title: 'Spread the word',
              copy: 'Share it through your networks and social media — then watch the meals add up.',
              ctaLabel: 'Tell us about it',
              href: 'mailto:amy@everybodyeats.nz?subject=Fundraising',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Need inspiration?',
          heading: 'Fundraising *ideas*.',
          columns: '4',
          cardStyle: 'soft',
          items: [
            { title: 'Sponsored challenge', copy: 'Run, ride or swim with a Give-a-Little page behind you.' },
            { title: 'Workplace match-giving', copy: 'Get your employer to match what your team raises.' },
            { title: 'Pay-what-you-can dinner', copy: 'Host a dinner party in the Everybody Eats spirit.' },
            { title: 'Give instead of gifts', copy: 'Ask for donations for your birthday or special occasion.' },
            { title: 'Bake sale', copy: 'A classic for a reason. Sell treats, raise dough.' },
            { title: 'Skills or fitness session', copy: 'Teach a class and donate the takings.' },
            { title: 'Movie or quiz night', copy: 'Charge an entry fee and have a laugh for a cause.' },
            { title: 'Garage sale', copy: 'Clear out the clutter and turn it into meals.' },
          ],
        },
        {
          blockType: 'ctaStrip',
          heading: "Got an idea? *Let's make it happen.*",
          body: "Tell us what you're planning and we'll help with resources, ideas and a cheer squad.",
          variant: 'sun',
          align: 'center',
          primaryCta: {
            label: 'amy@everybodyeats.nz',
            href: 'mailto:amy@everybodyeats.nz?subject=Fundraising',
          },
        },
      ],
    },

    {
      slug: 'get-involved/volunteer',
      title: 'Volunteer',
      seo: {
        description:
          'Spend an evening cooking, serving or hosting at Everybody Eats. No experience needed.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Volunteer',
          heading: 'Cook. Serve.\n*Be welcomed.*',
          subheading:
            'Our doors stay open because of hundreds of volunteers across Onehunga, Glen Innes and Wellington. No restaurant or hospitality experience required — just a couple of hours and a willingness to chip in.',
        },
        {
          blockType: 'pillars',
          eyebrow: 'How it works',
          heading: 'Three steps to *your first shift*.',
          theme: 'forest',
          items: [
            {
              number: '01',
              title: 'Sign up',
              copy: 'Create a volunteer account on our portal — it takes a minute.',
              ctaLabel: 'Open portal',
              href: 'https://volunteers.everybodyeats.nz',
            },
            {
              number: '02',
              title: 'Pick a shift',
              copy: 'Browse upcoming shifts at your nearest restaurant.',
              ctaLabel: 'Open portal',
              href: 'https://volunteers.everybodyeats.nz',
            },
            {
              number: '03',
              title: 'Turn up',
              copy: "Arrive a little early. We'll show you the ropes and feed you after.",
              ctaLabel: 'Open portal',
              href: 'https://volunteers.everybodyeats.nz',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          heading: 'Roles on a shift',
          columns: '4',
          cardStyle: 'soft',
          items: [
            {
              title: 'Kitchen prep',
              copy: 'Chopping, plating, and lending an extra pair of hands to the chefs.',
            },
            {
              title: 'Front of house',
              copy: 'Greeting guests, taking orders, running plates and clearing tables.',
            },
            {
              title: 'Dish pit',
              copy: 'The engine room — keeping the plates moving so service flows.',
            },
            {
              title: 'Hosting',
              copy: 'Welcoming guests, managing the booking sheet and seating people warmly.',
            },
          ],
        },
      ],
    },

    {
      slug: 'get-involved/partner',
      title: 'Partner with us',
      seo: {
        description:
          "Whether you supply food, fund our mission or bring your team to volunteer, we'd love to talk.",
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Partnership',
          heading: "Let's *partner up*.",
          subheading:
            "We're powered by businesses, funders and food rescuers who share the belief that food is a right, not a privilege.",
        },
        {
          blockType: 'cardGrid',
          columns: '2',
          cardStyle: 'mixed',
          items: [
            {
              title: 'Hospitality partners',
              copy: 'Lend your venue, your chefs, or a portion of your covers to support a service night.',
              color: 'clay',
            },
            {
              title: 'Food partners',
              copy: 'Donate surplus produce, dairy, dry goods or proteins. We rescue thousands of kilos every month.',
              color: 'cream',
            },
            {
              title: 'Funding partners',
              copy: 'Sponsor a service, fund a restaurant, or back a specific programme. We measure and report impact.',
              color: 'sun',
            },
            {
              title: 'Supporting partners',
              copy: 'Goods, services, expertise — anything that keeps our restaurants running and growing.',
              color: 'forest100',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          heading: "Let's *talk*.",
          body:
            "Drop us an email and we'll come back to you with a coffee, a tour and a plan.",
          variant: 'forest',
          align: 'center',
          primaryCta: {
            label: 'hello@everybodyeats.nz',
            href: 'mailto:hello@everybodyeats.nz?subject=Partnership',
          },
        },
      ],
    },
    {
      slug: 'get-involved/catering-events',
      title: 'Catering & events',
      seo: {
        title: 'Catering & events — Everybody Eats',
        description:
          'From canapés to full-service dinners, in-house experiences to private events at home or in the workplace — food experiences that bring people together and give back.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Events & catering',
          heading: 'Catering\n*and events*.',
          subheading:
            'Our events and catering offering supports our restaurants and the communities they serve. From canapés to full-service dinners, and from in-house dining experiences to private events at home or in the workplace, we offer something for every occasion.',
          image: dinersImage,
          primaryCta: { label: 'Start an enquiry', href: '#enquiry' },
          secondaryCta: {
            label: 'jack@everybodyeats.nz',
            href: 'mailto:jack@everybodyeats.nz?subject=Events%20%26%20Catering%20enquiry',
          },
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'What we offer',
          heading: 'From the kitchen to *your table*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              number: '01',
              title: 'Catering from the kitchen',
              copy: 'Good kai, delivered fresh and served in style. Everything from individual lunch boxes and sharing platters to canapés and bespoke full-service dinners, all crafted using seasonal and rescued ingredients.',
            },
            {
              number: '02',
              title: 'Venue hire',
              copy: 'Our three restaurants in Onehunga, Glen Innes and Wellington are available for private and corporate events — fully equipped with furniture, cutlery, sound and WiFi. Every booking directly supports our pay-what-you-can kaupapa.',
            },
            {
              number: '03',
              title: 'Dine for good',
              copy: 'Our fundraising dining series fills great restaurants with food-loving supporters for one special night. Chefs design creative menus using seasonal and surplus ingredients, and every ticket directly funds Everybody Eats.',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          variant: 'sun',
          align: 'center',
          heading: 'Food that brings people *together*.',
          body:
            'From the kitchen to your table, we create food experiences that bring people together and give back.',
        },
        {
          blockType: 'testimonials',
          eyebrow: 'From our guests',
          heading: 'Memorable for all the *right reasons*.',
          items: [
            {
              quote:
                'Everybody Eats gave me a birthday experience that was memorable for all the right reasons. Beautiful food, a meaningful story, and a team that made everything effortless.',
              attribution: 'Sarah — birthday party',
            },
          ],
        },
        {
          blockType: 'enquiryForm',
          eyebrow: 'Start an enquiry',
          variant: 'forest',
          heading: "Let's plan something\n*special*.",
          intro:
            'Whatever the occasion, we would love to work with you. Get in touch and we’ll find the right option for your event, your budget and your values — every booking supports our restaurants and the communities they serve.',
          recipientEmail: 'jack@everybodyeats.nz',
          enquiryTypes: [
            { label: 'Catering from the kitchen' },
            { label: 'Venue hire' },
            { label: 'Dine for good (fundraising dinner)' },
            { label: 'Something else' },
          ],
          successMessage:
            "Thanks — your enquiry is on its way to Jack. We'll be in touch within two working *days*.",
          footnote: 'Prefer email? Reach us any time at jack@everybodyeats.nz.',
        },
      ],
    },
    {
      slug: 'get-involved/cooking-sessions',
      title: 'Gather for Good',
      seo: {
        title: 'Gather for Good — team experiences — Everybody Eats',
        description:
          'Meaningful, hands-on team experiences that give back — from a single restaurant service to a full restaurant takeover. Whatever your group size or goals.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Cooking sessions',
          heading: 'Gather for\n*good*.',
          subheading:
            "Looking for a team-building experience that's meaningful, hands-on and gives back? We have a range of ways to gather for good, whatever your group size or goals.",
          image: kitchenImage,
          primaryCta: { label: 'Enquire about a session', href: '#enquiry' },
          secondaryCta: {
            label: 'jack@everybodyeats.nz',
            href: 'mailto:jack@everybodyeats.nz?subject=Gather%20for%20Good%20enquiry',
          },
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Option 01 · $100 + GST per person',
          heading: 'Step into *Service*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'The experience',
              copy: 'Join our kitchen or front-of-house team during a normal service and see how rescued food becomes a three-course meal. Invite friends or whānau to dine on a meal you helped make — we work with one point of contact to handle registration and booking.',
            },
            { title: 'Group size', copy: 'Groups of 2–6.' },
            { title: 'When', copy: 'Prep 12–4pm, or evening service 5:30–8:30pm (front-of-house, kitchen or dishwashing).' },
            { title: 'Availability', copy: 'Auckland Mon–Thu · Wellington Mon–Wed.' },
            { title: 'Where', copy: 'Onehunga, Glen Innes or Wellington.' },
            {
              title: 'Enquire',
              copy: 'The easy way to volunteer as a group — get in touch and we’ll set it up.',
              ctaLabel: 'Enquire →',
              href: '/get-involved/cooking-sessions?type=Step%20into%20Service#enquiry',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Option 02 · $1,500 + GST for up to 10',
          heading: 'Meals that *Matter*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'The experience',
              copy: 'A hands-on team session cooking nourishing meals for a community partner, using thoughtfully sourced ingredients and zero-waste techniques. The meals go straight to where they’re needed most.',
            },
            { title: 'When', copy: '11am–3pm, with time to share kai. Double sessions available for two groups a day.' },
            { title: 'Where', copy: 'Glen Innes (Tuesdays) or Wellington (Thursdays).' },
            {
              title: 'Full details',
              copy: 'Everything that’s included, the day flow, and the addresses.',
              ctaLabel: 'Open the page →',
              href: '/get-involved/cooking-sessions/meals-that-matter',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Option 03 · from $2,000 + GST',
          heading: 'Private *Events*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'The experience',
              copy: 'A fully hosted Everybody Eats experience — hire one of our spaces for a private dinner or celebration that brings your team together and supports the community.',
            },
            { title: 'Group size', copy: '40–100.' },
            { title: 'When', copy: 'Lunch 12–4pm (Glen Innes & Wellington) or dinner 5–10pm.' },
            { title: 'Availability', copy: 'Glen Innes Tue · Onehunga Fri–Sat · Wellington Thu.' },
            { title: 'Add-ons', copy: 'Drinks and AV packages available.' },
            {
              title: 'Enquire',
              copy: 'Tell us your date and numbers and we’ll tailor a package.',
              ctaLabel: 'Enquire →',
              href: '/get-involved/cooking-sessions?type=Private%20Events#enquiry',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Option 04 · from $5,000 + GST',
          heading: 'Restaurant *Takeover*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'The experience',
              copy: 'Sponsor a service night and make it your own — your brand on the menu, and however involved you want to be: volunteer, showcase a product, run a pop-up, or simply lend your name to a night that feeds the community.',
            },
            { title: 'Group size', copy: 'Flexible — bring as many or as few as suits you.' },
            { title: 'When', copy: 'Evening service 5:30–8:30pm (prep from 12pm for hands-on teams).' },
            { title: 'Availability', copy: 'Auckland Mon–Thu · Wellington Mon–Wed.' },
            {
              title: 'What’s included',
              copy: 'Pre-event promotion naming your organisation, your logo on the menu and signage, a community shoutout, menu input, photo opportunities, and a post-event impact summary.',
            },
            {
              title: 'Enquire',
              copy: 'Let’s build the night around your goals.',
              ctaLabel: 'Enquire →',
              href: '/get-involved/cooking-sessions?type=Restaurant%20Takeover#enquiry',
            },
          ],
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Option 05 · tailored pricing',
          heading: 'Everybody Eats *on the Road*.',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'The experience',
              copy: 'We bring the kaupapa to you — a catered lunch, a pop-up mini-restaurant, or a shared kōrero about Everybody Eats at your office, event or venue.',
            },
            { title: 'Group size', copy: '20–200 people.' },
            { title: 'Cost', copy: 'Tailored to your space, numbers and vision.' },
            {
              title: 'Enquire',
              copy: 'Tell us where and when, and we’ll shape it to suit.',
              ctaLabel: 'Enquire →',
              href: '/get-involved/cooking-sessions?type=Everybody%20Eats%20on%20the%20Road#enquiry',
            },
          ],
        },
        {
          blockType: 'testimonials',
          eyebrow: 'From the teams',
          heading: 'Closer to *home*.',
          items: [
            {
              quote:
                'Of all the volunteering opportunities we get exposed to, this feels like the one where you can see the tangible impact. It’s relatable. It feels closer to home.',
              attribution: 'Lion',
            },
            {
              quote:
                'Everybody Eats gave me a birthday experience that was memorable for all the right reasons. Beautiful food, a meaningful story, and a team that made everything effortless.',
              attribution: 'Sarah — birthday party',
            },
          ],
        },
        {
          blockType: 'enquiryForm',
          eyebrow: 'Enquire about a session',
          variant: 'forest',
          heading: 'Gather your team\n*for good*.',
          intro:
            'Tell us about your group and what you have in mind — including anything that isn’t listed here, we love a creative collaboration — and we’ll help you find the right fit.',
          recipientEmail: 'jack@everybodyeats.nz',
          enquiryTypes: [
            { label: 'Step into Service' },
            { label: 'Meals that Matter' },
            { label: 'Private Events' },
            { label: 'Restaurant Takeover' },
            { label: 'Everybody Eats on the Road' },
            { label: 'Not sure yet' },
          ],
          successMessage:
            "Thanks — your enquiry is on its way to Jack. We'll be in touch within two working *days*.",
          footnote: 'Prefer email? Reach us any time at jack@everybodyeats.nz.',
        },
      ],
    },
    {
      slug: 'get-involved/cooking-sessions/meals-that-matter',
      title: 'Meals that Matter',
      seo: {
        title: 'Meals that Matter — Everybody Eats',
        description:
          'A hands-on team experience cooking nourishing meals for the community using thoughtfully sourced ingredients and zero-waste techniques. $1,500 +GST for up to 10 people.',
      },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Gather for good',
          heading: 'Meals that\n*matter*.',
          subheading:
            'An exclusive hands-on team experience cooking nourishing meals for the wider community. Your team prepares meals using thoughtfully sourced ingredients and zero-waste techniques to support a local community organisation — then they’re distributed directly to a partner organisation, where they’re needed most.',
          image: kitchenImage,
          primaryCta: { label: 'Book your team', href: '#enquiry' },
          secondaryCta: {
            label: 'See all team experiences',
            href: '/get-involved/cooking-sessions',
          },
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'The essentials',
          heading: 'What to *know*.',
          columns: '4',
          cardStyle: 'soft',
          items: [
            { number: '01', title: 'Cost', copy: '$1,500 + GST for a group of up to 10 people.' },
            { number: '02', title: 'When', copy: 'A four-hour session, 11am–3pm, with time to sit down and share kai together.' },
            { number: '03', title: 'Where', copy: 'Glen Innes on Tuesdays, Wellington on Thursdays. Other weekdays by prior arrangement.' },
            { number: '04', title: 'Group size', copy: 'Up to 10 — and double sessions are available for two groups in a day.' },
          ],
        },
        {
          blockType: 'process',
          eyebrow: 'How the day runs',
          heading: 'Four hours, *one* shared purpose.',
          items: [
            {
              number: '01',
              title: 'Arrive & learn',
              copy: 'Meet our chefs, pull on an apron, and get a feel for the rescued and thoughtfully sourced ingredients you’ll be cooking with.',
            },
            {
              number: '02',
              title: 'Cook together',
              copy: 'Your team prepares nourishing meals hands-on, learning zero-waste techniques side by side with our kitchen.',
            },
            {
              number: '03',
              title: 'Share kai',
              copy: 'Sit down together over a meal you’ve made — the part everyone remembers.',
            },
            {
              number: '04',
              title: 'Meals delivered',
              copy: 'The meals go straight to a community partner — a charity of your choice if you have one — distributed where they’re needed most.',
            },
          ],
        },
        {
          blockType: 'ctaStrip',
          variant: 'sun',
          align: 'center',
          heading: 'Team building, learning, and real *impact*.',
          body:
            'Meals that Matter blends a hands-on team day with tangible social good — and we can work with a charity partner of your choice to receive the meals.',
        },
        {
          blockType: 'cardGrid',
          eyebrow: 'Where you’ll cook',
          heading: 'Two kitchens, *one* kaupapa.',
          columns: '2',
          cardStyle: 'soft',
          items: [
            {
              title: 'Glen Innes',
              copy: '133 Line Road, Glen Innes, Auckland 1072. Sessions on Tuesdays.',
            },
            {
              title: 'Wellington',
              copy: '60 Dixon Street, Te Aro, Wellington 6011. Sessions on Thursdays.',
            },
          ],
        },
        {
          blockType: 'testimonials',
          eyebrow: 'From the teams',
          heading: 'Closer to *home*.',
          items: [
            {
              quote:
                'Of all the volunteering opportunities we get exposed to, this feels like the one where you can see the tangible impact. It’s relatable. It feels closer to home.',
              attribution: 'Lion',
            },
          ],
        },
        {
          blockType: 'enquiryForm',
          eyebrow: 'Book your team',
          variant: 'forest',
          heading: 'Bring your team\n*to the table*.',
          intro:
            'Tell us about your group and your preferred dates, and we’ll lock in a Meals that Matter session for you. Double sessions for two groups in a day are available on request.',
          recipientEmail: 'jack@everybodyeats.nz',
          enquiryTypes: [
            { label: 'Meals that Matter — single session' },
            { label: 'Meals that Matter — double session' },
            { label: 'Another Gather for Good experience' },
            { label: 'Something else' },
          ],
          successMessage:
            "Thanks — your enquiry is on its way to Jack. We'll be in touch within two working *days*.",
          footnote: 'Looking at other ways to gather for good? Email jack@everybodyeats.nz and we’ll talk options.',
        },
      ],
    },
  ]

  // Optional slug filter: pass one or more slugs as CLI args to seed only those
  // pages, e.g. `pnpm tsx scripts/seed-pages-layouts.ts contact newsletter`.
  // With no args, every page above is seeded.
  const onlySlugs = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const toSeed = onlySlugs.length ? pages.filter((p) => onlySlugs.includes(p.slug)) : pages

  if (onlySlugs.length) {
    const missing = onlySlugs.filter((s) => !pages.some((p) => p.slug === s))
    if (missing.length) {
      console.warn(`⚠ No spec for slug(s): ${missing.join(', ')} (known slugs: ${pages.map((p) => p.slug).join(', ')})`)
    }
    if (!toSeed.length) {
      console.error('Nothing to seed — none of the given slugs matched a page spec.')
      process.exit(1)
    }
    console.log(`Seeding only: ${toSeed.map((p) => p.slug).join(', ')}\n`)
  }

  for (const spec of toSeed) {
    const found = existing.docs.find((d: any) => d.slug === spec.slug)
    const data = {
      title: spec.title,
      slug: spec.slug,
      ...(spec.seo ? { seo: spec.seo } : {}),
      layout: spec.layout,
      ...(spec.status ? { _status: spec.status } : {}),
    } as any
    if (found) {
      await payload.update({ collection: 'pages', id: (found as any).id, data })
      console.log(
        `✓ Updated  ${spec.slug.padEnd(30)} (${spec.layout.length} blocks${
          spec.status === 'published' ? ', published' : ''
        })`,
      )
    } else {
      const created = await payload.create({ collection: 'pages', data })
      console.log(
        `✓ Created  ${spec.slug.padEnd(30)} (id=${created.id}, ${spec.layout.length} blocks${
          spec.status === 'published' ? ', published' : ''
        })`,
      )
    }
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
