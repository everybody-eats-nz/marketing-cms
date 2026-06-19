import { cache } from 'react'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { SITE_NOINDEX, mediaUrl } from '@/lib/site-url'

// Re-export the client-safe helpers so existing server-side importers can keep
// importing from '@/lib/seo'. The definitions live in site-url.ts so they stay
// free of the Payload (node:fs) import below.
export { SITE_URL, SITE_NOINDEX, absoluteUrl, mediaUrl } from '@/lib/site-url'

/** Memoised per-request fetch of the site-settings global. */
export const getSiteSettings = cache(async (): Promise<any> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
})

type PageMetaInput = {
  /** Page title. Plain string → the layout's `%s — Everybody Eats` template is
   *  applied (use for child routes). Set absoluteTitle for the home page and
   *  detail pages that supply their own fully-formed title. */
  title?: string | null
  description?: string | null
  /** Per-page OG image (Payload media). Falls back to the site default. */
  image?: any
  /** Canonical path, e.g. '/our-story'. */
  path: string
  absoluteTitle?: boolean
  noindex?: boolean | null
  type?: 'website' | 'article'
}

/**
 * Build a complete, consistent Metadata object: description, canonical,
 * Open Graph + Twitter (large image card) and robots. og:title / twitter:title
 * are intentionally left unset so Next derives them from the resolved (and
 * template-suffixed) page title.
 */
export async function pageMetadata(input: PageMetaInput): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.siteName || 'Everybody Eats'
  const description =
    input.description ||
    settings?.description ||
    'Restaurant-quality meals from rescued ingredients, served pay-as-you-feel. A New Zealand registered charity.'
  // Per-page image wins; otherwise the global default OG image. When neither is
  // set we omit images entirely so the dynamic opengraph-image route fills in.
  const ogImg = mediaUrl(input.image) || mediaUrl(settings?.ogImage, 'hero')

  const meta: Metadata = {
    description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type || 'website',
      url: input.path,
      siteName,
      description,
      ...(ogImg ? { images: [{ url: ogImg }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      description,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
  }

  if (input.title) {
    // A plain title gets the layout's '%s — Everybody Eats' template appended by
    // Next. If an editor already baked the brand into the SEO title field, treat
    // it as absolute so we don't end up with a doubled '— Everybody Eats' suffix.
    const endsWithBrand = input.title.trim().toLowerCase().endsWith(siteName.toLowerCase())
    meta.title =
      input.absoluteTitle || endsWithBrand ? { absolute: input.title } : input.title
  }
  if (input.noindex || SITE_NOINDEX) {
    meta.robots = { index: false, follow: false }
  }
  return meta
}
