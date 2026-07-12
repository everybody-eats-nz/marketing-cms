/**
 * Move the cooking-sessions page's PDF downloads out of the standalone
 * Downloads block and into the experience sections they belong to, using the
 * card grid `download` field (rendered as a download bar under each section's
 * cards).
 *
 * Matching is by title: each Downloads item (its override title, or the
 * document's own) is matched against the card grid headings on the same page
 * ("Step into Service" → "Step into *Service*."). Items that match a section
 * become that section's download; the Downloads block is then removed. Items
 * that match nothing leave the Downloads block in place (trimmed to just the
 * unmatched leftovers) so no file ever disappears from the page.
 *
 * Idempotent: re-running when the Downloads block is gone is a no-op.
 *
 * Run AFTER deploying the code (the migration adding `download_id` must have
 * run). NODE_ENV=production keeps Payload from schema-pushing:
 *
 *   NODE_ENV=production pnpm tsx scripts/move-cooking-downloads-into-sections.ts
 *
 * Targets whatever DATABASE_URI points at (in this repo's `.env`: production).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_SLUG = process.argv[2] || 'get-involved/cooking-sessions'

/** "Step into *Service*." → "step into service" */
function normalize(text?: string) {
  return (text || '')
    .replace(/\*/g, '')
    .replace(/[.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

async function main() {
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE_SLUG } },
    limit: 1,
    depth: 0,
  })
  const page = found.docs[0] as any
  if (!page) throw new Error(`Page not found: ${PAGE_SLUG}`)

  const layout: any[] = Array.isArray(page.layout) ? [...page.layout] : []
  const downloadsIdx = layout.findIndex((b) => b.blockType === 'downloads')
  if (downloadsIdx === -1) {
    console.log(`No Downloads block on /${PAGE_SLUG} — nothing to move.`)
    process.exit(0)
  }

  const downloadsBlock = layout[downloadsIdx]
  const items: any[] = downloadsBlock.items || []

  const leftovers: any[] = []
  for (const item of items) {
    const fileId = typeof item.file === 'object' && item.file ? item.file.id : item.file
    if (!fileId) continue

    let title: string | undefined = item.title
    if (!title) {
      const doc = (await payload.findByID({
        collection: 'documents',
        id: fileId,
        depth: 0,
      })) as any
      title = doc?.title
    }

    const target = layout.find(
      (b) => b.blockType === 'cardGrid' && normalize(b.heading) === normalize(title),
    )
    if (target) {
      target.download = fileId
      console.log(`✓ "${title}" → section "${normalize(target.heading)}"`)
    } else {
      leftovers.push(item)
      console.warn(`⚠ no matching section for "${title}" — keeping it in the Downloads block`)
    }
  }

  if (leftovers.length) {
    downloadsBlock.items = leftovers
  } else {
    layout.splice(downloadsIdx, 1)
    console.log('✓ removed the Downloads block')
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
  })
  console.log(`\nDone — /${PAGE_SLUG} updated and published.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
