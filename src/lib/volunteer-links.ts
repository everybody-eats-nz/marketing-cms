/**
 * Public volunteer landing pages on the volunteer portal.
 *
 * The portal hosts per-city pages that are server-rendered and SEO-optimised
 * to rank for generic local searches like "volunteering Wellington" or
 * "volunteer opportunities Auckland". The marketing site links to them so
 * visitors land on the right local page — and so search engines have a crawl
 * path + internal links pointing at them from a higher-authority domain.
 *
 * Keep these in sync with the portal routes in
 * `volunteer-portal/web/src/lib/volunteer-locations.ts`.
 */
export const VOLUNTEER_PORTAL_URL = 'https://volunteers.everybodyeats.nz'

export const VOLUNTEER_LINKS = {
  /** Index: "Volunteer across Aotearoa" — links out to each city. */
  index: `${VOLUNTEER_PORTAL_URL}/volunteer`,
  /** Wellington (Te Aro restaurant). */
  wellington: `${VOLUNTEER_PORTAL_URL}/volunteer/wellington`,
  /** Auckland (covers the Glen Innes and Onehunga restaurants). */
  auckland: `${VOLUNTEER_PORTAL_URL}/volunteer/auckland`,
} as const
