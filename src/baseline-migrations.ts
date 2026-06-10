// Run by docker-entrypoint.sh before `payload migrate`.
//
// The production database was originally created by drizzle schema push (dev
// mode), which leaves a `dev` (batch -1) marker row in payload_migrations.
// `payload migrate` prompts interactively when it sees that row — and on a
// non-TTY deploy the prompt resolves to "no" and exits 0 without running
// anything, so migrations would silently never apply. Running the initial
// migration's DDL against a push-created schema would also fail, since every
// table already exists.
//
// This script converts a push-created database to migration-based tracking:
//   1. schema exists but the initial migration isn't recorded → record it as
//      already applied (batch 1) without running its DDL
//   2. remove the `dev` push marker so `payload migrate` never prompts
//
// On a fresh database (no payload_migrations table yet) and on every
// subsequent boot it's a no-op.
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import config from './payload.config'

// Keep in sync with the first file in src/migrations/.
const INITIAL_MIGRATION = '20260609_234426_initial'

const payload = await getPayload({ config })
const db = (payload.db as any).drizzle

const { rows: tableCheck } = await db.execute(
  sql`SELECT to_regclass('public.payload_migrations') AS migrations_table, to_regclass('public.pages') AS pages_table`,
)

if (!tableCheck[0].migrations_table) {
  console.log('✓ Fresh database — nothing to baseline, `payload migrate` will build the schema.')
  process.exit(0)
}

if (tableCheck[0].pages_table) {
  const { rows: recorded } = await db.execute(
    sql`SELECT 1 FROM payload_migrations WHERE name = ${INITIAL_MIGRATION}`,
  )
  if (recorded.length === 0) {
    await db.execute(
      sql`INSERT INTO payload_migrations (name, batch) VALUES (${INITIAL_MIGRATION}, 1)`,
    )
    console.log(`✓ Baselined push-created schema as ${INITIAL_MIGRATION}.`)
  }
}

const { rowCount } = await db.execute(sql`DELETE FROM payload_migrations WHERE batch = -1`)
if (rowCount > 0) {
  console.log('✓ Removed dev push marker from payload_migrations.')
}

process.exit(0)
