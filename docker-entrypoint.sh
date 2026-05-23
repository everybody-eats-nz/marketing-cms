#!/bin/sh
set -e

# Sanity-check the env we need at runtime.
: "${PAYLOAD_SECRET:?PAYLOAD_SECRET is required}"
: "${DATABASE_URI:?DATABASE_URI is required}"

# Call binaries directly (not via pnpm) so we don't trigger corepack at boot —
# pnpm 11's deps-status check tries to mutate the project tree and fails as the
# non-root user.
PAYLOAD_BIN="./node_modules/.bin/payload"
NEXT_BIN="./node_modules/.bin/next"

# Run pending Payload migrations against the configured DB, if any are checked
# in. When the migrations directory is empty, run a one-off schema push instead
# — the postgres adapter's push path is gated on NODE_ENV !== 'production', so
# we force it for this single sync only. The Next.js server below still runs as
# production.
if [ -d "src/migrations" ] && [ -n "$(ls -A src/migrations 2>/dev/null)" ]; then
  echo "→ Running Payload migrations…"
  "${PAYLOAD_BIN}" migrate
else
  echo "→ No migrations checked in — pushing schema (idempotent)…"
  NODE_ENV=development ./node_modules/.bin/tsx src/sync-schema.ts
fi

echo "→ Starting Next.js on ${HOSTNAME}:${PORT}…"
exec "${NEXT_BIN}" start -H "${HOSTNAME}" -p "${PORT}"
