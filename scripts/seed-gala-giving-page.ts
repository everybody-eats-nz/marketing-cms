/**
 * Populate the `gala-giving` Pages doc — the /get-involved/regular-giving page
 * in Gala 2026 "noir" dress, for pushing monthly giving on the night. Built
 * from the regular-giving gala-noir blocks (src/blocks/GalaNoir.ts).
 *
 * Idempotent: re-running resets copy to the block defaults but PRESERVES any
 * images an editor has since uploaded, matched by blockType. Images fall back
 * to built-in assets when unset.
 *
 * Usage:
 *   pnpm tsx scripts/seed-gala-giving-page.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET). NB: in a worktree the symlinked
 * .env points at PRODUCTION — override DATABASE_URI inline to target dev.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { GALA_NOIR_DEFAULTS as D } from '../src/blocks/GalaNoir'

function defaultLayout() {
  return [
    { blockType: 'galaNoirGivingHero', ...D.givingHero },
    { blockType: 'galaNoirMonthlyGifts', ...D.monthlyGifts },
    { blockType: 'galaNoirGivingWays', ...D.givingWays },
    { blockType: 'galaNoirGiveOnce', ...D.giveOnce },
  ] as any[]
}

/** Carry uploaded images over from an existing layout so re-seeding never wipes them. */
function preserveImages(layout: any[], existingLayout: any[]) {
  for (const block of layout) {
    const prior = existingLayout.find((b) => b?.blockType === block.blockType)
    if (prior?.image) block.image = prior.image
  }
  return layout
}

async function main() {
  const payload = await getPayload({ config })

  const slug = 'gala-giving'
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
        title: 'Regular giving at the Gala',
        slug,
        layout,
        seo: {
          title: 'Regular giving — The Everybody Eats Gala',
          description:
            'Keep the magic of the Gala going all year. Become an Everybody Eats superstar with a monthly gift and help us plan and grow our impact across Aotearoa.',
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
