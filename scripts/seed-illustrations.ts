/**
 * Seed the hand-drawn illustrations from the original Webflow site:
 *
 *  - Per-location building sketches (ink + yellow on transparent) and their
 *    white chalk variants, set on `locations.illustration` / `illustrationWhite`.
 *  - The three white "Get involved" drawings (spatula & tongs / coins / herbs),
 *    set on the home page's pillars block items by title.
 *
 * Assets are downloaded from the Webflow CDN into data/webflow/assets/ on
 * first run (under meaningful names), then uploaded to the media collection.
 * Idempotent: media is matched by filename, re-running is safe.
 *
 * NOTE on Webflow filenames: the ink sketches are mis-named at the source —
 * the file called "GlenInnes" draws the Onehunga building and vice versa.
 * The mapping below follows what the live site actually displayed next to
 * each location (verified against the white variants, which are named
 * correctly and clearly depict each building).
 *
 * Usage:
 *   pnpm tsx scripts/seed-illustrations.ts
 */

import 'dotenv/config'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'

const ASSETS = path.resolve(process.cwd(), 'data/webflow/assets')
const CDN = 'https://cdn.prod.website-files.com/66d7cb82647de44647142131'

const FILES: Record<string, string> = {
  // location sketches — ink on transparent (light surfaces)
  'illustration-onehunga.png': `${CDN}/67199daf90589128950e9636_GlenInnes.png`,
  'illustration-glen-innes.png': `${CDN}/67199dafb174650cb7d33481_Onehunga.png`,
  'illustration-wellington.png': `${CDN}/67199dafefbcd50505daa455_TeAro.png`,
  // location sketches — white chalk variants (dark surfaces)
  'illustration-onehunga-white.png': `${CDN}/6719a0bdd06a95c842b21b24_Onehunga.png`,
  'illustration-glen-innes-white.png': `${CDN}/6719a0bd7312d5169bf33498_GlenInnes.png`,
  'illustration-wellington-white.png': `${CDN}/6719a0bd04461e540b7c1bbc_TeAro.png`,
  // "Get involved" white line drawings
  'illustration-volunteer.png': `${CDN}/66da39581e2037096d8a32a5_Mask%20group.png`,
  'illustration-donate.png': `${CDN}/66da3958630ffc55338d4804_Mask%20group-2.png`,
  'illustration-partner.png': `${CDN}/66da39591cf2edd1da49de49_Mask%20group-1.png`,
}

const LOCATION_ILLOS: Record<string, { ink: string; white: string }> = {
  onehunga: { ink: 'illustration-onehunga.png', white: 'illustration-onehunga-white.png' },
  'glen-innes': { ink: 'illustration-glen-innes.png', white: 'illustration-glen-innes-white.png' },
  wellington: { ink: 'illustration-wellington.png', white: 'illustration-wellington-white.png' },
}

const PILLAR_ILLOS: Record<string, string> = {
  volunteer: 'illustration-volunteer.png',
  donate: 'illustration-donate.png',
  partner: 'illustration-partner.png',
}

async function ensureDownloaded() {
  await mkdir(ASSETS, { recursive: true })
  for (const [name, url] of Object.entries(FILES)) {
    const dest = path.join(ASSETS, name)
    if (existsSync(dest)) continue
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
    // The source PNGs (especially the ink sketches) carry large transparent
    // margins that make them render small and misaligned — trim to content.
    const trimmed = await sharp(Buffer.from(await res.arrayBuffer())).trim().png().toBuffer()
    await writeFile(dest, trimmed)
    console.log(`  ↓ downloaded ${name}`)
  }
}

async function uploadByFilename(payload: any, filename: string, alt: string): Promise<string> {
  // The media collection converts uploads to webp, so match on either name.
  const existing = await payload.find({
    collection: 'media',
    where: {
      or: [
        { filename: { equals: filename } },
        { filename: { equals: filename.replace(/\.png$/, '.webp') } },
      ],
    },
    limit: 1,
  })
  if (existing.totalDocs > 0) return existing.docs[0].id

  const buffer = await readFile(path.join(ASSETS, filename))
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: 'image/png', name: filename, size: buffer.length },
  })
  console.log(`  ✓ uploaded ${filename}`)
  return created.id
}

async function main() {
  console.log('→ Downloading illustration assets')
  await ensureDownloaded()

  const payload = await getPayload({ config })

  console.log('\n→ Locations')
  for (const [slug, files] of Object.entries(LOCATION_ILLOS)) {
    const { docs } = await payload.find({
      collection: 'locations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (!docs[0]) {
      console.warn(`  ⚠ location "${slug}" not found — skipped`)
      continue
    }
    const illustration = await uploadByFilename(payload, files.ink, `Hand-drawn sketch of the ${docs[0].name} restaurant`)
    const illustrationWhite = await uploadByFilename(payload, files.white, `Hand-drawn sketch of the ${docs[0].name} restaurant (white)`)
    await payload.update({
      collection: 'locations',
      id: docs[0].id,
      data: { illustration, illustrationWhite },
    })
    console.log(`  ✓ ${docs[0].name}`)
  }

  console.log('\n→ Home pillars ("Get involved")')
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })
  if (!home.docs[0]) {
    console.warn('  ⚠ home page not found — skipped')
  } else {
    const layout = ((home.docs[0] as any).layout || []).map((block: any) => {
      if (block.blockType !== 'pillars' || !Array.isArray(block.items)) return block
      return {
        ...block,
        items: block.items.map((item: any) => {
          const file = PILLAR_ILLOS[(item.title || '').trim().toLowerCase()]
          return file ? { ...item, illustration: item.illustration ?? undefined, _illoFile: file } : item
        }),
      }
    })
    // Resolve media ids for the matched items (kept outside the map so the
    // uploads happen once, sequentially).
    for (const block of layout) {
      if (block.blockType !== 'pillars' || !Array.isArray(block.items)) continue
      for (const item of block.items) {
        if (item._illoFile) {
          item.illustration = await uploadByFilename(payload, item._illoFile, '')
          delete item._illoFile
        }
      }
    }
    await payload.update({
      collection: 'pages',
      id: home.docs[0].id,
      data: { layout },
    })
    console.log('  ✓ home pillars updated')
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
