/**
 * Populate the `gala-new` Pages doc with the Gala 2026 "noir" section blocks
 * (src/blocks/GalaNoir.ts) — one block per section so editors can reorder the
 * page and edit every line of copy and every image.
 *
 * Idempotent: re-running resets copy to the block defaults but PRESERVES any
 * images an editor has since uploaded, matched by blockType (and by index for
 * per-person photos). Images fall back to built-in assets when unset.
 *
 * Usage:
 *   pnpm tsx scripts/seed-gala-noir-page.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET). NB: in a worktree the symlinked
 * .env points at PRODUCTION — override DATABASE_URI inline to target dev.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { GALA_NOIR_DEFAULTS as D } from '../src/blocks/GalaNoir'

/** The default page: every section block, in deck order, filled from defaults. */
function defaultLayout() {
  return [
    { blockType: 'galaNoirHero', ...D.hero },
    { blockType: 'galaNoirProblem', ...D.problem },
    { blockType: 'galaNoirAbout', ...D.about },
    { blockType: 'galaNoirNight', ...D.night },
    { blockType: 'galaNoirPerformers', ...D.performers },
    { blockType: 'galaNoirChefs', ...D.chefs },
    { blockType: 'galaNoirCalculator', ...D.calculator },
    { blockType: 'galaNoirTiers', ...D.tiers },
    { blockType: 'galaNoirTable', ...D.table },
    { blockType: 'galaNoirAuction', ...D.auction },
    { blockType: 'galaNoirInKind', ...D.inKind },
    { blockType: 'galaNoirQuotes', ...D.quotes },
    { blockType: 'galaNoirClosing', ...D.closing },
  ] as any[]
}

/** Carry uploaded images over from an existing layout so re-seeding never wipes them. */
function preserveImages(layout: any[], existingLayout: any[]) {
  for (const block of layout) {
    const prior = existingLayout.find((b) => b?.blockType === block.blockType)
    if (!prior) continue
    if (prior.image) block.image = prior.image
    for (const key of ['performers', 'chefs'] as const) {
      if (Array.isArray(block[key]) && Array.isArray(prior[key])) {
        block[key] = block[key].map((entry: any, i: number) =>
          prior[key][i]?.image ? { ...entry, image: prior[key][i].image } : entry,
        )
      }
    }
  }
  return layout
}

async function main() {
  const payload = await getPayload({ config })

  const slug = 'gala-new'
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const doc = existing.docs[0]
  const layout = preserveImages(defaultLayout(), doc?.layout || [])

  if (doc) {
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout, _status: 'published' } as any,
    })
    console.log(`Updated "${slug}" page (id=${doc.id})`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'The Gala 2026',
        slug,
        layout,
        // seo.image left unset — falls back to the site-wide OG image.
        seo: {
          title: 'The Everybody Eats Gala — 30 October 2026',
          description:
            'One audacious night of exquisite dining, high-class drag cabaret and generous bidding at St Matthew-in-the-City, Auckland. Sponsor the Gala, host a table, or donate to the auction.',
        },
        _status: 'published',
      } as any,
    })
    console.log(`Created "${slug}" page (id=${created.id})`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
