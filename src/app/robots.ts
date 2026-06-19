import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_NOINDEX } from '@/lib/seo'

// Note: in production the host may sit behind Cloudflare's managed robots.txt,
// which appends AI-bot rules to this origin response. This sets the base policy
// (allow crawling + advertise the sitemap). Set SITE_NOINDEX on the pre-launch
// preview deployment to disallow everything until cutover.
export default function robots(): MetadataRoute.Robots {
  if (SITE_NOINDEX) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/').replace(/\/$/, ''),
  }
}
