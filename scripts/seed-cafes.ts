/**
 * Seed the Cafés collection. Cafés are listing cards that link through to an
 * existing page (e.g. the Hopper one-pager at /hopper) — they don't get their
 * own generated detail page. Idempotent: upserts by slug.
 *
 * Usage:
 *   pnpm tsx scripts/seed-cafes.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const CAFES = [
  {
    name: 'Hopper',
    slug: 'hopper',
    city: 'Wellington',
    openStatus: 'open' as const,
    tagline:
      'Rescued food, accessible prices, and a genuine sense of belonging — a café from the Everybody Eats team.',
    link: { label: 'Visit Hopper', type: 'internal' as const, internalHref: '/hopper' },
    displayOrder: 0,
  },
]

async function main() {
  const payload = await getPayload({ config })

  for (const cafe of CAFES) {
    const existing = await payload.find({
      collection: 'cafes',
      where: { slug: { equals: cafe.slug } },
      limit: 1,
      depth: 0,
    })

    const data = { ...cafe, _status: 'published' as const }

    if (existing.docs[0]) {
      await payload.update({ collection: 'cafes', id: existing.docs[0].id, data })
      console.log(`Updated café "${cafe.name}" (id ${existing.docs[0].id})`)
    } else {
      const created = await payload.create({ collection: 'cafes', data })
      console.log(`Created café "${cafe.name}" (id ${created.id})`)
    }
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
