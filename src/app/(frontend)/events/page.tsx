import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { PayloadImage } from '@/components/payload-image'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Special dining events, guest chefs and supper clubs across our three restaurants.',
}

export default async function EventsPage() {
  const payload = await getPayloadClient()
  const { docs: events } = await payload.find({
    collection: 'events',
    limit: 50,
    sort: '-date',
    depth: 2,
  })

  const now = new Date()
  const upcoming = events.filter((e: any) => e.date && new Date(e.date) >= now)
  const past = events.filter((e: any) => e.date && new Date(e.date) < now)

  return (
    <>
      <section className="container-wide pt-16 sm:pt-24 pb-16">
        <p className="eyebrow mb-5">Events</p>
        <h1 className="display text-5xl sm:text-7xl lg:text-8xl font-light leading-[1] text-forest-700 max-w-5xl">
          Special <em>nights</em>,
          <br />
          special <em>plates</em>.
        </h1>
        <p className="mt-8 max-w-2xl text-lg sm:text-xl text-forest-600/85 leading-relaxed">
          Guest chefs, supper clubs, cause dinners and one-night-only feasts. Tickets
          go to keeping our regular service free for anyone who needs it.
        </p>
      </section>

      {upcoming.length > 0 && (
        <section className="container-wide pb-24">
          <h2 className="display text-3xl text-forest-700/85 mb-8">
            Coming up <span className="text-forest-500/60">({upcoming.length})</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((ev: any) => <EventCard key={ev.id} ev={ev} priority />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="container-wide pb-32">
          <h2 className="display text-3xl text-forest-700/85 mb-8">
            Past events <span className="text-forest-500/60">({past.length})</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((ev: any) => <EventCard key={ev.id} ev={ev} dim />)}
          </div>
        </section>
      )}
    </>
  )
}

function EventCard({ ev, priority, dim }: { ev: any; priority?: boolean; dim?: boolean }) {
  const date = ev.date ? new Date(ev.date) : null
  return (
    <Link
      href={`/events/${ev.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden bg-cream-100 card-hover ${dim ? 'opacity-90' : ''}`}
    >
      <div className="relative aspect-[5/6] bg-forest-100 overflow-hidden">
        {ev.image ? (
          <PayloadImage
            media={ev.image}
            size="feature"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-clay-100 to-clay-200" />
        )}
        {date && (
          <div className="absolute top-4 left-4 bg-cream-50 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="text-forest-700 leading-none">
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-forest-500/85">
                {date.toLocaleDateString('en-NZ', { month: 'short' })}
              </div>
              <div className="display text-2xl font-medium mt-0.5">
                {date.getDate()}
              </div>
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium text-forest-700">
                {date.toLocaleDateString('en-NZ', { weekday: 'short' })}
              </div>
              {ev.displayTime && (
                <div className="text-forest-500/85">{ev.displayTime}</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        {ev.location?.name && (
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-forest-500/85 mb-2">
            {ev.location.name}
          </p>
        )}
        <h3 className="display text-xl text-forest-700 font-medium leading-snug">
          {ev.name}
        </h3>
        {ev.shortDescription && (
          <p className="mt-3 text-sm text-forest-600/75 line-clamp-3">
            {ev.shortDescription}
          </p>
        )}
        <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm text-forest-500 group-hover:gap-2 transition-all">
          Learn more <span>→</span>
        </span>
      </div>
    </Link>
  )
}
