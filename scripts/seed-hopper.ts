/**
 * Create/refresh the Hopper Cafe one-pager (Pages doc, slug `hopper`).
 * Content comes from the Hopper launch announcement. Idempotent: re-running
 * overwrites the layout of the existing doc (and creates it if missing).
 *
 * Usage:
 *   pnpm tsx scripts/seed-hopper.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { VOLUNTEER_PORTAL_URL } from '../src/lib/volunteer-links'

// Deep link straight to Hopper's own shifts on the volunteer portal.
const HOPPER_VOLUNTEER_URL = `${VOLUNTEER_PORTAL_URL}/shifts?location=${encodeURIComponent('Hopper Cafe Wellington')}`

async function main() {
  const payload = await getPayload({ config })

  const layout = [
    {
      blockType: 'hopperHero',
      kicker: 'an everybody eats cafe',
      kickerHref: '/',
      wordmark: 'hOPPer',
      label: 'cafe',
      addressLine: '11 Hopper St, Te Aro',
      hoursLine: 'Mon + Tues · 9am–2pm',
    },
    {
      blockType: 'hopperStatement',
      eyebrow: 'The idea',
      heading: 'Rescued food, accessible prices, and a genuine sense of belonging.',
      body: 'Hopper is a cafe from the Everybody Eats team, built on the same values we carry into everything we do. Good food that would otherwise go to waste, cooked simply and priced so everyone can pull up a chair.',
    },
    {
      blockType: 'hopperMenu',
      eyebrow: 'On the counter',
      items: [
        { name: 'loaded toast' },
        { name: 'toasties' },
        { name: 'hot dishes', note: 'changes daily' },
        { name: 'tea' },
        { name: 'filter coffee' },
        { name: 'housemade cordial' },
      ],
      footnote: 'Simple and seasonal — the board changes with what gets rescued that week.',
    },
    {
      blockType: 'hopperVisit',
      eyebrow: 'Find us',
      address: '11 Hopper St\nTe Aro, Wellington',
      note: 'Tucked between [Kaibosh](https://kaibosh.org.nz) and [Cahoots](https://www.cahoots.nz).',
      hours: [
        { days: 'Monday', times: '9am – 2pm' },
        { days: 'Tuesday', times: '9am – 2pm' },
      ],
      mapLabel: 'Open in maps ↗',
      mapHref: 'https://maps.google.com/?q=11+Hopper+Street,+Te+Aro,+Wellington',
    },
    {
      blockType: 'hopperStatement',
      eyebrow: 'Lend a hand',
      heading: 'Hopper is being built by its community — and there’s a spot here for you.',
      body: 'If you’d like to volunteer, we’d love to have you. Front of house, kitchen, dishes — no experience needed.',
      cta: { label: 'Volunteer with us', href: HOPPER_VOLUNTEER_URL },
    },
  ]

  const data = {
    title: 'Hopper Cafe',
    slug: 'hopper',
    layout,
    seo: {
      title: 'Hopper Cafe — 11 Hopper St, Te Aro, Wellington',
      description:
        'Hopper is a cafe from Everybody Eats at 11 Hopper St, Te Aro — rescued food, accessible prices, and a genuine sense of belonging. Open Monday and Tuesday, 9am to 2pm.',
    },
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'hopper' } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`Updated hopper page (id ${existing.docs[0].id})`)
  } else {
    const created = await payload.create({ collection: 'pages', data })
    console.log(`Created hopper page (id ${created.id})`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
