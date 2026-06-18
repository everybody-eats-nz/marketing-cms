// Newsletter region definitions, shared by the signup form (client) and the
// /api/newsletter route (server). The region KEYS are client-safe; the
// Campaign Monitor list IDs they map to are resolved server-side only.
//
// The default list IDs mirror the volunteer portal's production seed
// (web/prisma/seed-production.ts) so both apps subscribe to the same audiences.
// Override per-environment with CAMPAIGN_MONITOR_AUCKLAND_LIST_ID /
// CAMPAIGN_MONITOR_WELLINGTON_LIST_ID if the lists ever change.

export const NEWSLETTER_REGIONS = ['auckland', 'wellington'] as const

export type NewsletterRegion = (typeof NEWSLETTER_REGIONS)[number]

export function isNewsletterRegion(value: unknown): value is NewsletterRegion {
  return typeof value === 'string' && (NEWSLETTER_REGIONS as readonly string[]).includes(value)
}

// Best-effort: infer which newsletter to pre-select from a restaurant's
// location strings (city, name, slug). Used on the pay-at-table thank-you page
// so a diner's region is pre-ticked — they can still switch. Returns undefined
// when nothing matches (e.g. a pop-up in a region without a list), leaving the
// choice to the diner. Client-safe (pure string matching, no secrets).
export function inferNewsletterRegion(...parts: (string | undefined | null)[]): NewsletterRegion | undefined {
  const haystack = parts.filter(Boolean).join(' ').toLowerCase()
  if (haystack.includes('wellington')) return 'wellington'
  if (haystack.includes('auckland')) return 'auckland'
  return undefined
}

// Server-only: resolve a region to its Campaign Monitor list ID. Returns
// undefined for an unknown region.
export function getNewsletterListId(region: NewsletterRegion): string | undefined {
  const map: Record<NewsletterRegion, string> = {
    auckland:
      process.env.CAMPAIGN_MONITOR_AUCKLAND_LIST_ID || 'd0fa752b4fe96d8b9a14e77d3c917222',
    wellington:
      process.env.CAMPAIGN_MONITOR_WELLINGTON_LIST_ID || 'dca35fce91d251a98c06a2d783794181',
  }
  return map[region]
}
