/**
 * One-off: split the team into Board vs Operations and remove duplicate records.
 *
 * Context: the original seed didn't recognise Webflow's Board/Ops option ids, so
 * every team member ended up as `leadership` and the page showed one flat section.
 * The import also left duplicate `-copy` records (and three Nick Loosley entries).
 *
 * This script:
 *   1. Deletes the known duplicate records (keeps the canonical slug per person).
 *   2. Tags every remaining member as `board` or `operations` — board iff their
 *      name contains "Board" (every board member's title says "Board Member"/
 *      "Board Chair"; no operations member's does).
 *
 * Safe to re-run: deletes are no-ops once gone, re-tagging is idempotent.
 *
 * Usage: pnpm tsx scripts/split-team-board-ops.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Duplicate / stale records to remove (canonical entry for each person is kept).
const DUPLICATE_SLUGS = [
  'amy-tew-copy',
  'daniel-tulloch-copy',
  'jack-rainey-copy',
  'sophie-gilmour-copy',
  'nick-loosley---founder-and-board-member',
  'nick-loosley---founder-and-board-member-copy',
]

async function main() {
  const payload = await getPayload({ config })

  // 1. Delete duplicates by slug.
  for (const slug of DUPLICATE_SLUGS) {
    const { docs } = await payload.find({
      collection: 'team-members',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (docs[0]) {
      await payload.delete({ collection: 'team-members', id: docs[0].id })
      console.log(`  ✗ removed duplicate: ${slug}`)
    } else {
      console.log(`  · already gone: ${slug}`)
    }
  }

  // 2. Tag remaining members as board / operations.
  const { docs } = await payload.find({
    collection: 'team-members',
    limit: 200,
    depth: 0,
  })

  const counts: Record<string, number> = { board: 0, operations: 0 }
  for (const m of docs as any[]) {
    const staffType = /board/i.test(m.name) ? 'board' : 'operations'
    counts[staffType]++
    if (m.staffType !== staffType) {
      await payload.update({
        collection: 'team-members',
        id: m.id,
        data: { staffType },
      })
    }
    console.log(`  ✓ ${staffType.padEnd(10)} ${m.name}`)
  }

  console.log(`\nDone. Board: ${counts.board}, Operations: ${counts.operations}, Total: ${docs.length}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
