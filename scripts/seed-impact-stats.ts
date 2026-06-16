/**
 * Seed the Site Settings → Impact stats with the three live-bound headline
 * figures pulled from the volunteer portal:
 *   - People served   (live: peopleServed)
 *   - Volunteer hours (live: volunteerHours)
 *   - Food saved, kg  (live: foodSavedKg, derived from people served)
 *
 * Each stat carries a fixed `value` used as a fallback when the portal's live
 * stats can't be fetched. The live numbers are resolved at render time by the
 * Stats block — this script only configures which metric each row binds to.
 *
 * Idempotent: re-running overwrites the stats array. Other Site Settings fields
 * are left untouched.
 *
 * Usage:
 *   pnpm tsx scripts/seed-impact-stats.ts
 *
 * Requires .env loaded (DATABASE_URI, PAYLOAD_SECRET).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const IMPACT_STATS = [
  { liveMetric: 'peopleServed', value: '279,550', label: 'people served', suffix: '+' },
  { liveMetric: 'volunteerHours', value: '1,400', label: 'volunteer hours', suffix: '+' },
  { liveMetric: 'foodSavedKg', value: '139,775', label: 'kg of food rescued', suffix: '+' },
] as const

async function main() {
  const payload = await getPayload({ config })

  const current = (await payload.findGlobal({ slug: 'site-settings' })) as any
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { ...current, stats: IMPACT_STATS },
  })

  console.log('✓ Seeded Site Settings impact stats:')
  for (const s of IMPACT_STATS) {
    console.log(`    ${s.label} → live:${s.liveMetric} (fallback "${s.value}${s.suffix}")`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
