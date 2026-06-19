import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { JsonLd, buildRestaurant, buildBreadcrumbs } from '@/components/structured-data'
import { BookingLocationLink } from '@/components/booking/booking-dialog'
import { PayloadImage } from '@/components/payload-image'

type Params = { params: Promise<{ slug: string }> }

type MenuCourse = { name: string }
type TonightsMenu = {
  date: string
  location: string
  chefName?: string | null
  announcement?: string | null
  starter?: MenuCourse[]
  mains?: MenuCourse[]
  drink?: MenuCourse[]
  dessert?: MenuCourse[]
  // The portal falls back to the most recent menu when today's isn't published.
  isFallback?: boolean
}

// Tonight's menu is published to the volunteers portal by the restaurant teams.
// `location` must match the Payload location's name ("Onehunga", "Glen Innes", "Wellington").
async function fetchTonightsMenu(locationName: string): Promise<TonightsMenu | null> {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(new Date())
  // Read the portal base from env (set to the internal Docker alias in prod) so
  // this fetch goes container-to-container; falling back to the public URL keeps
  // local dev working. Hitting the public domain from the deployed container
  // fails (same-host hairpin NAT) — keep this in sync with VOLUNTEER_PORTAL_URL.
  const base = (process.env.VOLUNTEER_PORTAL_URL || 'https://volunteers.everybodyeats.nz').replace(/\/$/, '')
  const url = `${base}/api/menus?date=${date}&location=${encodeURIComponent(locationName)}`
  try {
    // Cap the upstream call so a slow/unavailable portal (e.g. no menu published
    // for today) can't stall the whole page render. Responses are cached briefly
    // so we don't re-hit the upstream on every request, but stay fresh enough to
    // pick up a newly published menu quickly.
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 10 },
    })
    if (!res.ok) return null
    const menu = (await res.json()) as TonightsMenu
    const courses = [menu.starter, menu.mains, menu.dessert, menu.drink]
    return courses.some((c) => Array.isArray(c) && c.length > 0) ? menu : null
  } catch {
    // Timeout, network error, or bad JSON — render the page without the menu.
    return null
  }
}

async function fetchLocation(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
}

// A deliberately coarse "posted ~when" label for diner notes — credible
// recency without pinning an exact date to a quote.
function roughDate(iso?: string): string | null {
  if (!iso) return null
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return null
  const days = Math.floor(ms / 86_400_000)
  if (days <= 0) return 'Today'
  if (days < 7) return 'This week'
  if (days < 14) return 'Last week'
  if (days < 31) return `${Math.round(days / 7)} weeks ago`
  if (days < 365) {
    const months = Math.max(1, Math.round(days / 30))
    return months === 1 ? 'A month ago' : `${months} months ago`
  }
  const years = Math.round(days / 365)
  return years <= 1 ? 'Over a year ago' : `${years} years ago`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const loc: any = await fetchLocation(slug)
  if (!loc) return { title: 'Not found', robots: { index: false, follow: false } }
  return pageMetadata({
    title: `${loc.name} restaurant`,
    description: loc.seo?.description || loc.tagline || loc.intro,
    image: loc.seo?.image || loc.heroImage,
    path: `/dine-with-us/${loc.slug}`,
    noindex: loc.seo?.noindex,
  })
}

export default async function LocationPage({ params }: Params) {
  const { slug } = await params
  const loc: any = await fetchLocation(slug)
  if (!loc) notFound()

  const payload = await getPayloadClient()
  const [upcomingEvents, tonightsMenu, dinerNotes] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        'location.slug': { equals: slug },
        date: { greater_than: new Date().toISOString() },
      },
      limit: 3,
      sort: 'date',
      depth: 1,
    }).catch(() => ({ docs: [] })),
    fetchTonightsMenu(loc.name),
    // Published diner feedback (positive + consented, auto-approved by the AI
    // classifier on submit, with staff override). Social proof, in diners' words.
    payload.find({
      collection: 'feedback',
      where: {
        status: { equals: 'published' },
        locationSlug: { equals: slug },
      },
      limit: 6,
      sort: '-createdAt',
      depth: 0,
    }).catch(() => ({ docs: [] })),
  ])

  return (
    <>
      <JsonLd data={buildRestaurant(loc)} />
      <JsonLd
        data={buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Dine with us', path: '/dine-with-us' },
          { name: loc.name, path: `/dine-with-us/${loc.slug}` },
        ])}
      />
      {/* Hero — full-bleed photo with overlay copy */}
      <section className="relative h-[80vh] min-h-[600px] bg-forest-700 overflow-hidden">
        {loc.heroImage ? (
          <PayloadImage
            media={loc.heroImage}
            size="hero"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-300 via-forest-500 to-forest-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/35 to-forest-900/15" />

        <div className="absolute inset-0 flex items-end">
          <div className="container-wide pb-28 sm:pb-20 text-cream-50">
            {/* White hand-drawn sketch of the building, as on the original site's
                restaurant heroes. The hero photo is always dark-scrimmed, so the
                white variant works in both themes. */}
            {loc.illustrationWhite && (
              <PayloadImage
                media={loc.illustrationWhite}
                size="thumbnail"
                alt=""
                className="h-20 sm:h-24 w-auto object-contain mb-6 drop-shadow-md"
              />
            )}
            <div className="inline-flex items-center gap-3 mb-6 text-xs uppercase tracking-[0.18em] text-cream-50/80">
              <span className="w-8 h-px bg-cream-50/40" />
              {loc.city || 'New Zealand'}
            </div>
            <h1 className="display text-6xl sm:text-8xl lg:text-[10rem] font-light leading-[0.9]">
              {loc.name}
            </h1>
            {loc.tagline && (
              <p className="mt-6 max-w-xl text-lg text-cream-50/85 leading-relaxed">
                {loc.tagline}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {loc.bookingUrl && (
                <BookingLocationLink
                  locationSlug={loc.slug}
                  bookingUrl={loc.bookingUrl}
                  className="btn-accent"
                >
                  Book a table
                </BookingLocationLink>
              )}
              <Link
                href={`/dine-with-us/pay/${loc.slug}`}
                className="btn border border-cream-50/40 text-cream-50 hover:bg-surface hover:text-content"
              >
                Pay at table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Practical info strip */}
      <section className="container-wide -mt-16 relative z-10">
        <div className="grid sm:grid-cols-3 bg-surface rounded-[2rem] shadow-xl border border-line/10 overflow-hidden">
          <div className="p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-line/10">
            <p className="eyebrow mb-2">Address</p>
            <p className="text-content text-lg">{loc.address || '—'}</p>
          </div>
          <div className="p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-line/10">
            <p className="eyebrow mb-2">Open</p>
            {loc.hours?.length > 0 ? (
              loc.hours.map((h: any, j: number) => (
                <p key={j} className="text-content text-lg">
                  {h.label}
                  <span className="block text-sm text-muted">
                    {h.times}{h.note && ` · ${h.note}`}
                  </span>
                </p>
              ))
            ) : (
              <p className="text-content text-lg">Sun–Thu · 6pm – 8pm</p>
            )}
          </div>
          <div className="p-8 sm:p-10">
            <p className="eyebrow mb-2">How it works</p>
            <p className="text-content text-lg">
              One three-course menu nightly.{' '}
              <span className="text-muted/85">
                Pay what feels right when you leave.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Tonight's menu — published daily by the kitchen via the volunteers portal */}
      {tonightsMenu && (
        <section className="container-tight pt-24">
          <div className="rounded-[2.5rem] border border-line/15 bg-surface px-8 py-14 sm:px-16 text-center shadow-sm">
            <p className="eyebrow mb-4">
              {tonightsMenu.isFallback ? 'Our latest menu' : 'On the menu tonight'}
            </p>
            <p className="display text-3xl sm:text-4xl font-light text-content">
              {new Date(`${tonightsMenu.date}T00:00:00`).toLocaleDateString('en-NZ', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            {tonightsMenu.chefName && (
              <p className="mt-3 text-sm text-muted">
                From the kitchen of{' '}
                <span className="text-content">{tonightsMenu.chefName}</span>
              </p>
            )}

            <div className="mt-12 space-y-10">
              {[
                { label: 'To start', items: tonightsMenu.starter },
                { label: 'Mains', items: tonightsMenu.mains },
                { label: 'Dessert', items: tonightsMenu.dessert },
                { label: 'To drink', items: tonightsMenu.drink },
              ]
                .filter((course) => course.items && course.items.length > 0)
                .map((course) => (
                  <div key={course.label}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex-1 h-px bg-line/20" />
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted/70">
                        {course.label}
                      </span>
                      <span className="flex-1 h-px bg-line/20" />
                    </div>
                    {/* Items within a course are alternatives — diners choose one */}
                    <ul className="space-y-2">
                      {course.items!.map((item, i) => (
                        <li key={i}>
                          {i > 0 && (
                            <span
                              aria-hidden
                              className="display block mb-2 text-sm text-muted/60"
                            >
                              <em>or</em>
                            </span>
                          )}
                          <span className="display text-xl sm:text-2xl font-light text-content leading-snug">
                            {item.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>

            <p className="mt-12 text-sm text-muted">
              {tonightsMenu.announcement || 'One three-course menu nightly — there’s always a vegetarian option.'}
            </p>
          </div>
        </section>
      )}

      {/* About paragraph */}
      <section className="container-tight py-24">
        <p className="eyebrow mb-6">About this restaurant</p>
        {loc.intro ? (
          <p className="display text-xl sm:text-2xl font-light text-content leading-relaxed">
            {loc.intro}
          </p>
        ) : (
          <p className="display text-3xl sm:text-4xl font-light text-content leading-tight max-w-3xl">
            A neighbourhood table, made from the day's rescue.{' '}
            <em>{loc.name}</em> — strangers turning into regulars over a shared menu.
          </p>
        )}
      </section>

      {/* Upcoming events */}
      {upcomingEvents.docs.length > 0 && (
        <section className="container-wide py-12 pb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="display text-3xl sm:text-5xl font-light text-content">
              Coming up at <em>{loc.name}</em>
            </h2>
            <Link href="/events" className="btn-ghost shrink-0">All events →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.docs.map((ev: any) => {
              const date = ev.date ? new Date(ev.date) : null
              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-3 mb-4">
                    {ev.image ? (
                      <PayloadImage
                        media={ev.image}
                        size="feature"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  {date && (
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted/70 mb-2">
                      {date.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <h3 className="display text-xl text-content font-medium leading-snug">
                    {ev.name}
                  </h3>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* What diners are saying — published, consented feedback from the pay flow */}
      {dinerNotes.docs.length > 0 && (
        <section className="container-wide py-12 pb-24">
          <p className="eyebrow mb-10">In diners’ own words</p>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {dinerNotes.docs.map((note: any) => (
              <figure
                key={note.id}
                className="mb-6 break-inside-avoid rounded-[1.75rem] border border-line/15 bg-surface p-7 shadow-sm"
              >
                {note.rating ? (
                  <div aria-label={`${note.rating} out of 5`} className="mb-3 text-sun-400 text-sm">
                    {'★'.repeat(note.rating)}
                    <span className="text-line/40">{'★'.repeat(5 - note.rating)}</span>
                  </div>
                ) : null}
                <blockquote className="display text-xl font-light text-content leading-snug">
                  “{note.message}”
                </blockquote>
                {(note.name || roughDate(note.createdAt)) && (
                  <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
                    {note.name && <span>— {note.name}</span>}
                    {roughDate(note.createdAt) && (
                      <time dateTime={note.createdAt} className="text-muted/70">
                        {note.name ? '· ' : ''}
                        {roughDate(note.createdAt)}
                      </time>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-wide py-16">
        <div className="rounded-[3rem] bg-forest-700 grain text-cream-50 p-12 sm:p-20 text-center">
          <h2 className="display text-4xl sm:text-6xl font-light max-w-3xl mx-auto">
            Save us a seat at <em className="text-sun-200">{loc.name}</em>
          </h2>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {loc.bookingUrl && (
              <BookingLocationLink locationSlug={loc.slug} bookingUrl={loc.bookingUrl} className="btn-accent">
                Book now
              </BookingLocationLink>
            )}
            <Link href="/get-involved/donate" className="btn border border-cream-50/40 text-cream-50 hover:bg-surface hover:text-content">
              Donate a meal
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
