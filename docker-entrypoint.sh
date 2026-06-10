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
TSX_BIN="./node_modules/.bin/tsx"

# One-time conversion of a push-created database to migration tracking
# (no-op on fresh databases and on every boot after the first). Must run
# before `payload migrate`, which would otherwise prompt interactively on the
# dev-push marker and hang/skip on a non-TTY deploy.
echo "→ Baselining migration state…"
"${TSX_BIN}" src/baseline-migrations.ts

echo "→ Running Payload migrations…"
"${PAYLOAD_BIN}" migrate

echo "→ Starting Next.js on ${HOSTNAME}:${PORT}…"
exec "${NEXT_BIN}" start -H "${HOSTNAME}" -p "${PORT}"
