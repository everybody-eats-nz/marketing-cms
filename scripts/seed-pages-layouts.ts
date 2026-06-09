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
      slug: 'about/newsletter',
      title: 'Newsletter',
      seo: { description: 'Stories from the table, monthly.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Newsletter',
          heading: 'Stories, *monthly*.',
          subheading:
            "A short letter once a month with what we've been cooking, what's coming up, and the people behind every plate. No spam, unsubscribe anytime.",
        },
        {
          blockType: 'newsletterForm',
          footnote:
            'By subscribing you agree to receive a monthly email. We will never share your address.',
        },
      ],
    },

    {
      slug: 'about/contact-us',
      title: 'Contact',
      seo: { description: 'Get in touch with the Everybody Eats team.' },
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Contact',
          heading: 'Get in *touch*.',
          subheading:
            "Whether you want to volunteer, donate, partner with us, or just say hello — we'd love to hear from you.",
        },
        {
          blockType: 'cardGrid',
          columns: '3',
          cardStyle: 'soft',
          items: [
            {
              title: 'Say kia ora',
              copy: 'Questions, suggestions, kind words.',
              email: 'hello@everybodyeats.nz',
            },
            {
              title: 'Press & media',
              copy: 'Story pitches, interviews and photography.',
              email: 'press@everybodyeats.nz',
            },
            {
              title: 'Get on the roster',
              copy: 'Lend an evening — front of house or in the kitchen.',
              email: 'volunteer@everybodyeats.nz',
            },
          ],
        },
        {
          blockType: 'cardGrid',
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
              href: '/about/newsletter',
              color: 'sun',
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
              ctaLabel: 'Open portal →',
              href: 'https://volunteers.everybodyeats.nz',
            },
            {
              number: '02',
              title: 'Pick a shift',
              copy: 'Browse upcoming shifts at your nearest restaurant.',
              ctaLabel: 'Open portal →',
              href: 'https://volunteers.everybodyeats.nz',
            },
            {
              number: '03',
              title: 'Turn up',
              copy: "Arrive a little early. We'll show you the ropes and feed you after.",
              ctaLabel: 'Open portal →',
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
  ]

  for (const spec of pages) {
    const found = existing.docs.find((d: any) => d.slug === spec.slug)
    if (found) {
      await payload.update({
        collection: 'pages',
        id: (found as any).id,
        data: {
          title: spec.title,
          slug: spec.slug,
          ...(spec.seo ? { seo: spec.seo } : {}),
          layout: spec.layout,
        } as any,
      })
      console.log(`✓ Updated  ${spec.slug.padEnd(30)} (${spec.layout.length} blocks)`)
    } else {
      const created = await payload.create({
        collection: 'pages',
        data: {
          title: spec.title,
          slug: spec.slug,
          ...(spec.seo ? { seo: spec.seo } : {}),
          layout: spec.layout,
        } as any,
      })
      console.log(`✓ Created  ${spec.slug.padEnd(30)} (id=${created.id}, ${spec.layout.length} blocks)`)
    }
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
