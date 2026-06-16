import type { LiveMetric } from '@/fields/stat-item'

export type LiveImpactStats = Record<LiveMetric, number>

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
    })
    if (!res.ok) return null
    const data = (await res.json()) as Partial<LiveImpactStats>

    const peopleServed = Number(data.peopleServed)
    const volunteerHours = Number(data.volunteerHours)
    const foodSavedKg = Number(data.foodSavedKg)
    if (![peopleServed, volunteerHours, foodSavedKg].every(Number.isFinite)) return null

    return { peopleServed, volunteerHours, foodSavedKg }
  } catch {
    return null
  }
}
