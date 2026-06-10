/**
 * DANGER: Wipes the entire database that DATABASE_URI points at.
 *
 * Drops and recreates the `public` schema (every table, including all Payload
 * collections, versions, and migrations state), then exits. Rebuild the schema
 * afterwards BEFORE seeding — seed scripts cannot bootstrap an empty database
 * (schema push only runs under NODE_ENV=development):
 *   - local: `pnpm migrate` (or just boot `pnpm dev`, which pushes)
 *   - prod:  redeploy (docker-entrypoint.sh runs `payload migrate`), or run
 *            `DATABASE_URI="..." pnpm migrate` from your machine
 *
 * Usage (LOCAL):
 *   pnpm tsx scripts/db-reset.ts
 *
 * Usage (PROD — point at the database your ADMIN connects to):
 *   DATABASE_URI="postgres://user:pass@host:5432/db" pnpm tsx scripts/db-reset.ts
 *
 * Requires confirmation: re-run with --yes to actually execute.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const uri = process.env.DATABASE_URI
  if (!uri) {
    console.error('✗ DATABASE_URI is not set.')
    process.exit(1)
  }

  // Show a redacted target so you can confirm WHICH database you're about to wipe.
  const redacted = uri.replace(/(postgres(?:ql)?:\/\/)[^@]*@/, '$1<redacted>@')
  console.log(`Target database: ${redacted}`)

  if (!process.argv.includes('--yes')) {
    console.error('\n✗ Refusing to wipe without confirmation.')
    console.error('  Re-run with --yes once you have verified the target above is correct:')
    console.error('    DATABASE_URI="..." pnpm tsx scripts/db-reset.ts --yes')
    process.exit(1)
  }

  // Use Payload's own postgres pool (pg isn't hoisted under pnpm to import directly).
  const payload = await getPayload({ config })
  const pool = (payload.db as any).pool
  try {
    console.log('→ Dropping schema public …')
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
    console.log('✓ Database wiped. Run the seed scripts next to repopulate.')
  } finally {
    await pool.end()
  }
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ Reset failed:', e)
  process.exit(1)
})
