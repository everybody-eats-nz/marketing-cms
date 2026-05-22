/**
 * Populate the `home` Pages doc with a block-based layout that mirrors
 * the original bespoke home page. Idempotent: re-running overwrites the
 * `layout` field of the existing home doc (and creates the doc if missing).
 *
 * Usage:
 *   pnpm tsx scripts/seed-home-layout.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })

  // Preserve the existing hero image (now stored inside the layout blocks).
  const existingLayout = (existing.docs[0] as any)?.layout || []
  const existingHeroBlock = existingLayout.find((b: any) => b?.blockType === 'hero')
  const existingHeroImage = existingHeroBlock?.image

  const layout = [
    {
      blockType: 'hero',
      eyebrow: 'Pay-as-you-feel restaurants',
      heading: 'Making a *difference*\none plate at a time.',
      highlightWord: 'plate',
      subheading:
        'Restaurant-quality meals from rescued ingredients, served on a pay-as-you-feel basis. Everyone is welcome at our table.',
      image: existingHeroImage,
      primaryCta: { label: 'Find a restaurant', href: '/dine-with-us' },
      secondaryCta: { label: 'Our story →', href: '/our-story' },
      sticker: {
        text: 'Pay what\nyou can.\n*Eat well.*',
      },
    },
    {
      blockType: 'marquee',
      items: [
        { text: 'Eat well' },
        { text: 'Pay as you feel' },
        { text: 'Everyone is welcome' },
        { text: 'Rescued food, restaurant-quality' },
        { text: 'A registered charity' },
        { text: 'Three restaurants' },
      ],
    },
    {
      blockType: 'stats',
      source: 'global',
    },
    {
      blockType: 'locationsGrid',
      eyebrow: 'Dine with us',
      heading: 'Three tables, *one big welcome*',
      viewAllLabel: 'All locations →',
      viewAllHref: '/dine-with-us',
      limit: 6,
    },
    {
      blockType: 'pillars',
      eyebrow: 'Get involved',
      heading: 'Pull up a chair. *Pitch in.*',
      theme: 'forest',
      items: [
        {
          number: '01',
          title: 'Volunteer',
          copy: 'Cook, serve, host. Spend an evening helping us fill the table — no experience needed.',
          ctaLabel: 'Learn more',
          href: '/get-involved/volunteer',
        },
        {
          number: '02',
          title: 'Donate',
          copy: 'Every $20 puts another seat at our table. Give once or set up a regular gift.',
          ctaLabel: 'Learn more',
          href: '/get-involved/donate',
        },
        {
          number: '03',
          title: 'Partner',
          copy: "Businesses, food rescuers, suppliers — let's work together.",
          ctaLabel: 'Learn more',
          href: '/get-involved/partner',
        },
      ],
    },
    {
      blockType: 'eventsList',
      eyebrow: "What's coming up",
      heading: 'Special *nights*, special *plates*',
      viewAllLabel: 'View all events →',
      viewAllHref: '/events',
      limit: 4,
    },
    {
      blockType: 'journalList',
      eyebrow: 'Latest news & stories',
      heading: 'From the *journal*',
      viewAllLabel: 'All stories →',
      viewAllHref: '/journal',
      limit: 3,
    },
    {
      blockType: 'ctaStrip',
      heading: 'Help us set *another* table.',
      body: 'Your gift helps us serve thousands of meals every year — no questions asked, no judgment, just dinner.',
      variant: 'sun',
      primaryCta: { label: 'Donate today', href: '/get-involved/donate' },
      secondaryCta: { label: 'Meet the team', href: '/about/team' },
    },
  ]

  if (existing.docs[0]) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'pages',
      id,
      data: { layout },
    })
    console.log(`Updated home Pages doc (id=${id}) with ${layout.length} blocks`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout,
      } as any,
    })
    console.log(`Created home Pages doc (id=${created.id}) with ${layout.length} blocks`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
