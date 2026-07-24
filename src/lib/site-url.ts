// Pure, client-safe site URL + media helpers. Kept free of any Payload/server
// imports (no node:fs) so they can be used from components that end up in the
// client bundle (e.g. structured-data rendered inside the FAQ block, which is
// reached through the 'use client' render-blocks switch).

/**
 * Canonical origin for the site, used to build absolute URLs for sitemaps,
 * canonical tags and OG/Twitter images. Must be the canonical apex origin
 * (https://everybodyeats.nz) in production (set NEXT_PUBLIC_SITE_URL) — the
 * www host 308s to the apex (see redirects() in next.config.mjs); falls back
 * to localhost in dev.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

/**
 * Set SITE_NOINDEX (any truthy value) on the pre-launch preview deployment so
 * the whole site is `noindex` — prevents new.everybodyeats.nz from being
 * indexed and competing with www before cutover. Leave unset in production.
 */
export const SITE_NOINDEX = !!process.env.SITE_NOINDEX

export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}

/** Resolve a Payload media object (or relation) to an absolute image URL. */
export function mediaUrl(
  media: any,
  size: 'card' | 'feature' | 'hero' = 'feature',
): string | null {
  if (!media || typeof media !== 'object') return null
  const url = media.sizes?.[size]?.url || media.sizes?.feature?.url || media.url
  if (!url) return null
  return url.startsWith('http') ? url : absoluteUrl(url)
}
