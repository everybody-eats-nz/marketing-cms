/**
 * Populate the `gala` and `impact` Pages docs so both bespoke pages become
 * editable in the CMS. Each is a single composite block (`galaLanding` /
 * `impactLanding`) pre-filled from the block defaults — the same content the
 * pages shipped with as hardcoded routes.
 *
 * Idempotent: re-running overwrites the layout but PRESERVES any images an
 * editor has since uploaded (images fall back to built-in assets when unset).
 *
 * Usage:
 *   pnpm tsx scripts/seed-gala-impact-pages.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET). NB: in a worktree the symlinked
 * .env points at PRODUCTION — override DATABASE_URI inline to target dev.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { GALA_DEFAULTS } from '../src/blocks/GalaLanding'
import { IMPACT_DEFAULTS } from '../src/blocks/ImpactLanding'

// Image fields carry over from an existing doc so re-seeding never wipes uploads.
const GALA_IMAGE_FIELDS = [
  'heroImage',
  'nightImage',
  'tableImage',
  'moneyImage',
  'closingImage',
] as const

/** Merge freshly-defaulted content with images preserved from a prior doc. */
function buildGalaBlock(existing: any) {
  const block: any = { blockType: 'galaLanding', ...GALA_DEFAULTS }
  if (existing) {
    for (const f of GALA_IMAGE_FIELDS) if (existing[f]) block[f] = existing[f]
    // Preserve per-person photos by index.
    block.performers = block.performers.map((p: any, i: number) =>
      existing.performers?.[i]?.image ? { ...p, image: existing.performers[i].image } : p,
    )
    block.chefs = block.chefs.map((c: any, i: number) =>
      existing.chefs?.[i]?.image ? { ...c, image: existing.chefs[i].image } : c,
    )
  }
  return block
}

function buildImpactBlock() {
  return { blockType: 'impactLanding', ...IMPACT_DEFAULTS }
}

async function upsertPage(
  payload: any,
  {
    slug,
    title,
    seo,
    buildBlock,
  }: {
    slug: string
    title: string
    seo: { title: string; description: string }
    buildBlock: (existingBlock: any) => any
  },
) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const doc = existing.docs[0]
  const existingBlock = (doc?.layout || []).find((b: any) => b?.blockType === buildBlock(null).blockType)
  const layout = [buildBlock(existingBlock)]

  if (doc) {
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout, _status: 'published' },
    })
    console.log(`Updated "${slug}" page (id=${doc.id})`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title,
        slug,
        layout,
        // seo.image left unset — falls back to the site-wide OG image.
        seo: { title: seo.title, description: seo.description },
        _status: 'published',
      } as any,
    })
    console.log(`Created "${slug}" page (id=${created.id})`)
  }
}

async function main() {
  const payload = await getPayload({ config })

  await upsertPage(payload, {
    slug: 'gala',
    title: 'The Gala',
    seo: {
      title: 'The Gala',
      description:
        'A high-class drag cabaret evening at St Matthew-in-the-City, Auckland, on 30 October 2026. Host a table, sponsor the night, or donate to the auction.',
    },
    buildBlock: buildGalaBlock,
  })

  await upsertPage(payload, {
    slug: 'impact',
    title: 'Our impact',
    seo: {
      title: 'Our impact',
      description:
        'Six years of pay-as-you-feel dinners, in numbers — meals served from rescued food, neighbours welcomed, and the volunteers who make every night happen.',
    },
    buildBlock: buildImpactBlock,
  })

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
