// Lightweight liveness probe for the container HEALTHCHECK (see Dockerfile).
// Intentionally does NOT touch the database — it answers "is Next.js serving?",
// not "is every dependency reachable?". Keep it cheap so the healthcheck stays fast.
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ status: 'ok' })
}
