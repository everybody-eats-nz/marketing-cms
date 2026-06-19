import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/seo'

// Generated at request time, not build time: the build runs without a database
// (see the force-dynamic note in the frontend layout), so we must not connect
// to Postgres during `next build`.
export const dynamic = 'force-dynamic'

type Entry = MetadataRoute.Sitemap[number]

function entry(path: string, lastModified?: string | null, priority = 0.6): Entry {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency: 'weekly',
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Hand-rolled routes that aren't CMS pages (file-system routes under
  // src/app/(frontend)/, so they never show up in the `pages` collection query
  // below and must be listed explicitly).
  const staticRoutes: Entry[] = [
    entry('/events', null, 0.7),
    entry('/journal', null, 0.7),
    entry('/impact', null, 0.7),
    entry('/gala', null, 0.7),
  ]

  try {
    const payload = await getPayloadClient()
    const published = { _status: { equals: 'published' } } as const

    const [pages, locations, events, journal] = await Promise.all([
      payload.find({ collection: 'pages', where: published, limit: 500, depth: 0, pagination: false }),
      payload.find({ collection: 'locations', where: published, limit: 100, depth: 0, pagination: false }),
      payload.find({ collection: 'events', where: published, limit: 500, depth: 0, pagination: false }),
      payload.find({ collection: 'journal-posts', where: published, limit: 500, depth: 0, pagination: false }),
    ])

    const pageEntries = pages.docs.map((p: any) =>
      // The home page lives at '/', every other page at '/<slug>'.
      entry(p.slug === 'home' ? '/' : `/${p.slug}`, p.updatedAt, p.slug === 'home' ? 1 : 0.7),
    )
    const locationEntries = locations.docs.map((l: any) =>
      entry(`/dine-with-us/${l.slug}`, l.updatedAt, 0.8),
    )
    const eventEntries = events.docs.map((e: any) => entry(`/events/${e.slug}`, e.updatedAt, 0.6))
    const journalEntries = journal.docs.map((j: any) =>
      entry(`/journal/${j.slug}`, j.updatedAt || j.publishedAt, 0.5),
    )

    return [...pageEntries, ...staticRoutes, ...locationEntries, ...eventEntries, ...journalEntries]
  } catch {
    // If the database is unreachable, still emit a minimal valid sitemap.
    return [entry('/', null, 1), ...staticRoutes]
  }
}
