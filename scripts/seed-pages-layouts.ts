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
          blockType: 'cardGrid',
          eyebrow: 'What we stand for',
          columns: '3',
          cardStyle: 'tile',
          items: [
            {
              number: '01',
              title: 'Restaurant-quality',
              copy: 'Three-course menu cooked by trained chefs in real kitchens. Not a soup kitchen.',
            },
            {
              number: '02',
              title: 'Pay what you can',
              copy:
                "Suggested koha covers tonight's meal — pay more to cover the next person, or less if you need to.",
            },
            {
              number: '03',
              title: 'Rescued food',
              copy:
                'Every plate starts as ingredients that would otherwise be wasted. Nothing planned, everything fresh.',
            },
          ],
        },
        {
          blockType: 'timeline',
          eyebrow: 'A short history',
          heading: 'From *pop-up* to *permanent*.',
          items: [
            {
              year: '2017',
              title: 'Pop-up dinner',
              body: 'Nick Loosley hosts the first pay-as-you-feel pop-up in Auckland. It sells out instantly.',
            },
            {
              year: '2018',
              title: 'First Onehunga restaurant',
              body: 'Everybody Eats opens its doors permanently in Onehunga, Auckland.',
            },
            {
              year: '2020',
              title: 'Wellington opens',
              body: 'We expand to central Wellington and feed a city through lockdowns.',
            },
            {
              year: '2022',
              title: 'Glen Innes joins',
              body: 'A third restaurant opens in East Auckland, kindly supported by local funders.',
            },
            {
              year: 'Today',
              title: '350,000+ meals',
              body: 'Three restaurants, hundreds of volunteers, and one big pay-as-you-feel table.',
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
