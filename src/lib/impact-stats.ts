import { LIVE_METRICS, type LiveMetric } from '@/fields/stat-item'

/**
 * Partial so a single bad/missing field in the portal response only drops that
 * one metric — the others still resolve live, and `resolveValue` falls back per
 * stat for anything absent.
 */
export type LiveImpactStats = Partial<Record<LiveMetric, number>>

/**
 * Fetches the headline impact figures from the volunteer portal's public
 * stats endpoint. Returns `null` on any failure so callers fall back to the
 * fixed values configured in the CMS.
 *
 * The portal endpoint sets its own edge cache; we additionally cache the fetch
 * in Next's data cache for an hour (the frontend is force-dynamic, so without
 * this every request would hit the portal).
 */
export async function fetchLiveImpactStats(): Promise<LiveImpactStats | null> {
  const base = process.env.VOLUNTEER_PORTAL_URL
  if (!base) return null

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/impact-stats`, {
      next: { revalidate: 3600 },
      // Fail fast to the CMS fallback if the portal is unreachable (e.g. blocked
      // egress / hairpin NAT) rather than blocking the homepage render on a dead
      // connection until the OS-level TCP timeout. Mirrors fetchImpactStory.
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as Record<string, unknown>

    // Parse each metric independently: one bad field shouldn't sink the others.
    const stats: LiveImpactStats = {}
    const invalid: LiveMetric[] = []
    for (const metric of LIVE_METRICS) {
      const value = Number(data[metric])
      if (Number.isFinite(value)) stats[metric] = value
      else invalid.push(metric)
    }

    if (invalid.length) {
      console.warn(`[impact-stats] portal response missing/invalid metrics: ${invalid.join(', ')}`)
    }
    return Object.keys(stats).length ? stats : null
  } catch (error) {
    console.warn('[impact-stats] failed to fetch portal stats:', error)
    return null
  }
}
