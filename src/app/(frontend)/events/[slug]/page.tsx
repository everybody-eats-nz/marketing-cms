import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { JsonLd, buildEvent, buildBreadcrumbs } from '@/components/structured-data'
import { PayloadImage } from '@/components/payload-image'
import { RichText } from '@/components/rich-text'

type Params = { params: Promise<{ slug: string }> }

async function fetchEvent(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const ev: any = await fetchEvent(slug)
  if (!ev) return { title: 'Event not found', robots: { index: false, follow: false } }
  return pageMetadata({
    title: ev.name,
    description: ev.shortDescription,
    image: ev.image,
    path: `/events/${ev.slug}`,
    type: 'article',
  })
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params
  const ev: any = await fetchEvent(slug)
  if (!ev) notFound()

  const date = ev.date ? new Date(ev.date) : null

  return (
    <>
      <JsonLd data={buildEvent(ev)} />
      <JsonLd
        data={buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: ev.name, path: `/events/${ev.slug}` },
        ])}
      />
      <section className="container-wide pt-12 sm:pt-20 pb-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted/85 hover:text-content mb-10"
        >
          <span>←</span> All events
        </Link>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] rounded-[2.5rem] overflow-hidden bg-surface-3 shadow-xl">
              {ev.image && (
                <PayloadImage
                  media={ev.image}
                  size="hero"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            {date && (
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted/85 mb-4 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-line/40" />
                {date.toLocaleDateString('en-NZ', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {ev.displayTime && <span>· {ev.displayTime}</span>}
              </div>
            )}
            <h1 className="display text-4xl sm:text-6xl text-content font-light leading-tight">
              {ev.name}
            </h1>
            {ev.shortDescription && (
              <p className="mt-6 text-lg text-content/85 leading-relaxed">
                {ev.shortDescription}
              </p>
            )}

            <dl className="mt-10 space-y-5 border-t border-line/15 pt-8">
              {ev.location?.name && (
                <div className="flex justify-between gap-4">
                  <dt className="eyebrow shrink-0">Where</dt>
                  <dd className="text-right text-content">{ev.location.name}</dd>
                </div>
              )}
              {ev.tickets?.priceLabel && (
                <div className="flex justify-between gap-4">
                  <dt className="eyebrow shrink-0">Tickets</dt>
                  <dd className="text-right text-content">{ev.tickets.priceLabel}</dd>
                </div>
              )}
            </dl>

            {ev.tickets?.ticketUrl && (
              <div className="mt-8">
                <a
                  href={ev.tickets.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-base px-7 py-3.5 w-full justify-center"
                >
                  Get tickets →
                </a>
                {ev.tickets.caption && (
                  <p className="mt-3 text-xs text-muted/85">{ev.tickets.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {ev.description && (
        <section className="container-tight pb-32">
          <RichText content={ev.description} />
        </section>
      )}
    </>
  )
}
