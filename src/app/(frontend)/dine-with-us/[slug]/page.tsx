import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { PayloadImage } from '@/components/payload-image'

type Params = { params: Promise<{ slug: string }> }

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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const loc = await fetchLocation(slug)
  if (!loc) return { title: 'Not found' }
  return {
    title: `${(loc as any).name} restaurant`,
    description: (loc as any).tagline || undefined,
  }
}

export default async function LocationPage({ params }: Params) {
  const { slug } = await params
  const loc: any = await fetchLocation(slug)
  if (!loc) notFound()

  const payload = await getPayloadClient()
  const upcomingEvents = await payload.find({
    collection: 'events',
    where: {
      'location.slug': { equals: slug },
      date: { greater_than: new Date().toISOString() },
    },
    limit: 3,
    sort: 'date',
    depth: 1,
  }).catch(() => ({ docs: [] }))

  return (
    <>
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
          <div className="container-wide pb-16 sm:pb-20 text-cream-50">
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
                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent"
                >
                  Book a table
                </a>
              )}
              {loc.payAtTableUrl && (
                <a
                  href={loc.payAtTableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn border border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-forest-700"
                >
                  Pay at table
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Practical info strip */}
      <section className="container-wide -mt-16 relative z-10">
        <div className="grid sm:grid-cols-3 bg-cream-50 rounded-[2rem] shadow-xl border border-forest-500/10 overflow-hidden">
          <div className="p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-forest-500/10">
            <p className="eyebrow mb-2">Address</p>
            <p className="text-forest-700 text-lg">{loc.address || '—'}</p>
          </div>
          <div className="p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-forest-500/10">
            <p className="eyebrow mb-2">Open</p>
            {loc.hours?.length > 0 ? (
              loc.hours.map((h: any, j: number) => (
                <p key={j} className="text-forest-700 text-lg">
                  {h.label}
                  <span className="block text-sm text-forest-500">
                    {h.times}{h.note && ` · ${h.note}`}
                  </span>
                </p>
              ))
            ) : (
              <p className="text-forest-700 text-lg">Wed–Sat · 5pm – 9pm</p>
            )}
          </div>
          <div className="p-8 sm:p-10">
            <p className="eyebrow mb-2">How it works</p>
            <p className="text-forest-700 text-lg">
              One three-course menu nightly.{' '}
              <span className="text-forest-500/85">
                Pay what feels right when you leave.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* About paragraph */}
      <section className="container-tight py-24">
        <p className="eyebrow mb-6">About this restaurant</p>
        <p className="display text-3xl sm:text-4xl font-light text-forest-700 leading-tight max-w-3xl">
          A neighbourhood table, made from the day's rescue.{' '}
          <em>{loc.name}</em> seats around 60 every service — strangers turning into
          regulars over a shared menu.
        </p>
      </section>

      {/* Upcoming events */}
      {upcomingEvents.docs.length > 0 && (
        <section className="container-wide py-12 pb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="display text-3xl sm:text-5xl font-light text-forest-700">
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
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-forest-100 mb-4">
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
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-forest-500/70 mb-2">
                      {date.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <h3 className="display text-xl text-forest-700 font-medium leading-snug">
                    {ev.name}
                  </h3>
                </Link>
              )
            })}
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
              <a href={loc.bookingUrl} target="_blank" rel="noreferrer" className="btn-accent">
                Book now
              </a>
            )}
            <Link href="/get-involved/donate" className="btn border border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-forest-700">
              Donate a meal
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
