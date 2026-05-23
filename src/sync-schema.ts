// One-off schema sync used by docker-entrypoint.sh on first boot when no
// migrations are checked in. Invoked with `tsx` and NODE_ENV=development so
// the postgres adapter's `pushDevSchema` path is reached
// (see node_modules/@payloadcms/db-postgres/dist/connect.js — push is gated on
// NODE_ENV !== 'production'). The Next.js server is then started with
// NODE_ENV=production as normal.
import { getPayload } from 'payload'
import config from './payload.config'

await getPayload({ config })
console.log('✓ Payload schema synced.')
process.exit(0)
