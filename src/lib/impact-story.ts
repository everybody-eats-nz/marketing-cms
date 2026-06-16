/**
 * Impact-story dataset for the `/impact` data-story page.
 *
 * Shapes mirror the volunteer portal's public `/api/public/impact-story`
 * endpoint (see `web/src/lib/impact-story.ts` in the volunteer-portal repo).
 * `fetchImpactStory()` pulls the live aggregates; until that endpoint is
 * deployed — or any time it's unavailable — the page falls back to
 * `MOCK_IMPACT_STORY`, a representative dataset in the exact same shape, so the
 * page always renders. Swapping to live data is automatic once the portal ships.
 */

export type ImpactStoryYear = {
  year: number
  nights: number
  customers: number
  koha: number
  perHead: number | null
  perPaying: number | null
  nonPayingPercent: number | null
  cashPercent: number
  eftposPercent: number
  digitalPercent: number
  partial: boolean
}

export type ImpactStoryLocation = {
  name: string
  firstYear: number
  nights: number
  customers: number
  koha: number
  perHead: number | null
  avgCustomersPerNight: number
  weeknightPerHead: number | null
  weekendPerHead: number | null
}

export type ImpactStoryWeekday = {
  day: number
  label: string
  weekend: boolean
  perHead: number | null
  avgCustomersPerNight: number
}

export type ImpactStoryMilestone = {
  threshold: number
  volunteers: number
}

export type ImpactStory = {
  totals: {
    nights: number
    meals: number
    koha: number
    newVolunteers: number
    volunteers: number
    volunteerHours: number
    foodSavedKg: number
    foodSavedKgPerMeal: number
    perHead: number | null
    perPaying: number | null
    nonPayingPercent: number | null
    firstNight: string | null
    lastNight: string | null
  }
  yearly: ImpactStoryYear[]
  locations: ImpactStoryLocation[]
  weekday: ImpactStoryWeekday[]
  milestones: ImpactStoryMilestone[]
  generatedAt: string
}

/**
 * Fetches the live impact story from the volunteer portal. Returns `null` on any
 * failure so callers fall back to {@link MOCK_IMPACT_STORY}. The frontend is
 * force-dynamic, so we cache in Next's data cache for an hour to avoid hitting
 * the portal on every request (the portal sets its own edge cache too).
 */
export async function fetchImpactStory(): Promise<ImpactStory | null> {
  const base = process.env.VOLUNTEER_PORTAL_URL
  if (!base) return null

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/impact-story`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as ImpactStory
    // Light shape check — a malformed/old response shouldn't crash the page.
    if (!data?.totals || !Array.isArray(data.yearly) || !data.yearly.length) return null
    return data
  } catch (error) {
    console.warn('[impact-story] failed to fetch portal story:', error)
    return null
  }
}

/**
 * Representative fallback dataset — same shape as the live endpoint, figures
 * drawn from Everybody Eats' all-time service log (Jun 2020 – Jun 2026). Used
 * until the portal endpoint is live, and as a graceful fallback if it can't be
 * reached. Numbers are illustrative; the live feed is the source of truth.
 */
export const MOCK_IMPACT_STORY: ImpactStory = {
  totals: {
    nights: 2739,
    meals: 279655,
    koha: 1653611,
    newVolunteers: 5535,
    volunteers: 6842,
    volunteerHours: 174774,
    foodSavedKg: 139828,
    foodSavedKgPerMeal: 0.5,
    perHead: 5.92,
    perPaying: 15.31,
    nonPayingPercent: 62,
    firstNight: '2020-06-28',
    lastNight: '2026-06-14',
  },
  yearly: [
    { year: 2020, nights: 111, customers: 9727, koha: 92265, perHead: 8.6, perPaying: 16.08, nonPayingPercent: 40, cashPercent: 20.4, eftposPercent: 75.9, digitalPercent: 3.8, partial: true },
    { year: 2021, nights: 227, customers: 25026, koha: 159475, perHead: 6.33, perPaying: 15.65, nonPayingPercent: 60, cashPercent: 18.8, eftposPercent: 75.8, digitalPercent: 5.4, partial: false },
    { year: 2022, nights: 354, customers: 33495, koha: 219312, perHead: 6.26, perPaying: 15.88, nonPayingPercent: 60, cashPercent: 17.0, eftposPercent: 75.5, digitalPercent: 7.5, partial: false },
    { year: 2023, nights: 498, customers: 57118, koha: 377486, perHead: 6.24, perPaying: 16.11, nonPayingPercent: 60, cashPercent: 17.2, eftposPercent: 72.0, digitalPercent: 10.8, partial: false },
    { year: 2024, nights: 643, customers: 66775, koha: 367313, perHead: 5.03, perPaying: 15.31, nonPayingPercent: 65, cashPercent: 17.5, eftposPercent: 66.8, digitalPercent: 15.6, partial: false },
    { year: 2025, nights: 642, customers: 63036, koha: 312667, perHead: 4.29, perPaying: 13.15, nonPayingPercent: 70, cashPercent: 15.9, eftposPercent: 63.9, digitalPercent: 20.1, partial: false },
    { year: 2026, nights: 264, customers: 24373, koha: 125092, perHead: 4.26, perPaying: 14.12, nonPayingPercent: 70, cashPercent: 14.8, eftposPercent: 60.5, digitalPercent: 24.6, partial: true },
  ],
  locations: [
    { name: 'Wellington', firstYear: 2021, nights: 852, customers: 118475, koha: 591830, perHead: 4.47, avgCustomersPerNight: 139, weeknightPerHead: 5.1, weekendPerHead: 3.84 },
    { name: 'Onehunga', firstYear: 2020, nights: 1255, customers: 106134, koha: 780240, perHead: 6.72, avgCustomersPerNight: 85, weeknightPerHead: 7.55, weekendPerHead: 5.33 },
    { name: 'Glen Innes', firstYear: 2023, nights: 632, customers: 54941, koha: 281541, perHead: 4.54, avgCustomersPerNight: 87, weeknightPerHead: 5.04, weekendPerHead: 3.38 },
  ],
  weekday: [
    { day: 0, label: 'Sun', weekend: true, perHead: 4.46, avgCustomersPerNight: 97 },
    { day: 1, label: 'Mon', weekend: false, perHead: 5.29, avgCustomersPerNight: 96 },
    { day: 2, label: 'Tue', weekend: false, perHead: 6.41, avgCustomersPerNight: 91 },
    { day: 3, label: 'Wed', weekend: false, perHead: 7.08, avgCustomersPerNight: 85 },
    { day: 6, label: 'Sat', weekend: true, perHead: 4.12, avgCustomersPerNight: 109 },
  ],
  milestones: [
    { threshold: 10, volunteers: 1820 },
    { threshold: 25, volunteers: 764 },
    { threshold: 50, volunteers: 312 },
    { threshold: 100, volunteers: 98 },
    { threshold: 200, volunteers: 24 },
  ],
  generatedAt: '2026-06-16T00:00:00.000Z',
}
