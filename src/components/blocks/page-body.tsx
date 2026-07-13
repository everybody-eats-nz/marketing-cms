import { draftMode } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { fetchLiveImpactStats } from '@/lib/impact-stats'
import { fetchImpactStory, MOCK_IMPACT_STORY } from '@/lib/impact-story'
import { getPayCopy } from '@/lib/pay-copy.server'
import { RenderBlocks } from './render-blocks'
import { PageLivePreview } from './page-live-preview'

export async function fetchPageDoc(slug: string) {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: isEnabled,
    overrideAccess: isEnabled,
  })
  return { page: docs[0] || null, isDraft: isEnabled }
}

/** Render a page document via the blocks pipeline. Wraps in PageLivePreview when in draft mode. */
export async function PageBody({ page, isDraft }: { page: any; isDraft: boolean }) {
  const layout: any[] = Array.isArray(page.layout) ? page.layout : []
  const types = new Set(layout.map((b) => b.blockType))
  // In draft/preview mode we fetch all extras so newly-added blocks render immediately.
  // The impact "Where we serve" section also needs the CMS locations, to tell
  // permanent restaurants apart from pop-ups (by the showInMainGrids flag).
  const needLocations =
    isDraft ||
    types.has('locationsGrid') ||
    types.has('locationsMagazine') ||
    types.has('impactLanding')
  const needCafes = isDraft || types.has('cafesRow')
  const needEvents = isDraft || types.has('eventsList')
  const needJournal = isDraft || types.has('journalList')
  const needTeam = isDraft || types.has('teamGrid')
  const needFaqs = isDraft || types.has('faqsAccordion')
  const needPartners = isDraft || types.has('partnersGrid')
  const needSettings = isDraft || types.has('stats') || types.has('donateHero')
  const needPayCopy = isDraft || types.has('donateHero')
  const needImpactStory = isDraft || types.has('impactLanding')

  const payload = await getPayloadClient()
  const [settings, payCopy, liveStats, impactStory, locations, cafes, events, journal, team, faqs, partners] =
    await Promise.all([
    needSettings
      ? payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
      : Promise.resolve(null),
    needPayCopy ? getPayCopy() : Promise.resolve(null),
    isDraft || types.has('stats') ? fetchLiveImpactStats() : Promise.resolve(null),
    needImpactStory
      ? fetchImpactStory().then((s) => s ?? MOCK_IMPACT_STORY)
      : Promise.resolve(null),
    needLocations
      ? payload.find({
          collection: 'locations',
          limit: 20,
          sort: 'name',
          depth: 1,
          // Only venues flagged "Show in restaurant grids" (our permanent
          // restaurants), so pop-ups / one-off sites stay out of the list.
          // Outside preview we also hide unpublished docs so grids don't link to
          // pages that 404 (dine-with-us/[slug]/page.tsx only serves published docs).
          where: {
            showInMainGrids: { equals: true },
            ...(isDraft ? {} : { _status: { equals: 'published' } }),
          },
        })
      : Promise.resolve({ docs: [] as any[] }),
    needCafes
      ? payload.find({
          collection: 'cafes',
          limit: 20,
          sort: 'displayOrder',
          depth: 1,
          // Outside preview, hide unpublished cafés so the list stays consistent
          // with what's live (mirrors the locations query above).
          ...(isDraft ? {} : { where: { _status: { equals: 'published' } } }),
        })
      : Promise.resolve({ docs: [] as any[] }),
    needEvents
      ? payload.find({
          collection: 'events',
          limit: 8,
          sort: '-date',
          depth: 1,
          // Outside preview, hide unpublished events so the list doesn't link to
          // pages that 404 (events/[slug]/page.tsx only serves published docs).
          where: {
            date: { greater_than: new Date(0).toISOString() },
            ...(isDraft ? {} : { _status: { equals: 'published' } }),
          },
        })
      : Promise.resolve({ docs: [] as any[] }),
    needJournal
      ? payload.find({
          collection: 'journal-posts',
          limit: 6,
          sort: '-createdAt',
          depth: 1,
          // Outside preview, hide unpublished posts so lists don't link to pages
          // that 404 (journal/[slug]/page.tsx only serves published docs).
          ...(isDraft ? {} : { where: { _status: { equals: 'published' } } }),
        })
      : Promise.resolve({ docs: [] as any[] }),
    needTeam
      ? payload.find({
          collection: 'team-members',
          limit: 200,
          sort: 'displayOrder',
          depth: 1,
          // Outside preview, hide unpublished team members so the grid only
          // shows people who've been published.
          ...(isDraft ? {} : { where: { _status: { equals: 'published' } } }),
        })
      : Promise.resolve({ docs: [] as any[] }),
    needFaqs
      ? payload.find({ collection: 'faqs', limit: 100, sort: 'displayOrder' })
      : Promise.resolve({ docs: [] as any[] }),
    needPartners
      ? payload.find({ collection: 'partners', limit: 300, sort: 'displayOrder', depth: 1 })
      : Promise.resolve({ docs: [] as any[] }),
  ])

  const extras = {
    globalStats: (settings as any)?.stats || [],
    liveStats,
    impactStory,
    locations: locations.docs as any[],
    cafes: cafes.docs as any[],
    events: events.docs as any[],
    journal: journal.docs as any[],
    team: team.docs as any[],
    faqs: faqs.docs as any[],
    partners: partners.docs as any[],
    defaultDonateUrl: (settings as any)?.donateUrl,
    charityNumber: (settings as any)?.charityNumber,
    donateFormCopy: payCopy?.form,
  }

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (isDraft) {
    return <PageLivePreview initial={page} serverURL={serverURL} {...extras} />
  }

  return <RenderBlocks blocks={layout} {...extras} fallbackHeroHeading={page.title} />
}
