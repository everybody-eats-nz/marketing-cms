import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'

type Props = {
  locations: any[]
}

export function LocationsMagazineBlock({ locations }: Props) {
  if (!locations.length) return null
  return (
    <section className="container-wide pb-32 space-y-24">
      {locations.map((loc, i) => {
        const reverse = i % 2 === 1
        return (
          <article
            key={loc.id}
            className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
              reverse ? 'lg:[direction:rtl]' : ''
            }`}
          >
            <div className="lg:col-span-7 [direction:ltr]">
              <Link
                href={`/dine-with-us/${loc.slug}`}
                className="block group relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-forest-100"
              >
                {loc.heroImage ? (
                  <PayloadImage
                    media={loc.heroImage}
                    size="hero"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-300 to-forest-600" />
                )}
                <span className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-pill bg-cream-50/95 text-forest-700 text-xs uppercase tracking-[0.15em] font-medium">
                  <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                  {loc.openStatus === 'open' ? 'Open this week' : loc.openStatus}
                </span>
              </Link>
            </div>

            <div className="lg:col-span-5 [direction:ltr]">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest-500/70 mb-3">
                {String(i + 1).padStart(2, '0')} / {loc.city || 'New Zealand'}
              </p>
              <h2 className="display text-5xl sm:text-6xl font-light text-forest-700">{loc.name}</h2>
              {loc.tagline && (
                <p className="mt-5 text-lg text-forest-600/85 leading-relaxed">{loc.tagline}</p>
              )}
              {loc.address && (
                <div className="mt-7 pt-5 border-t border-forest-500/15">
                  <p className="eyebrow mb-1.5">Address</p>
                  <p className="text-forest-700">{loc.address}</p>
                </div>
              )}
              {loc.hours?.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow mb-1.5">Hours</p>
                  {loc.hours.map((h: any, j: number) => (
                    <p key={j} className="text-forest-700">
                      {h.label}: {h.times}
                      {h.note && <span className="text-forest-500/70"> · {h.note}</span>}
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/dine-with-us/${loc.slug}`} className="btn-primary">
                  Visit {loc.name}
                </Link>
                {loc.bookingUrl && (
                  <a href={loc.bookingUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    Book a table →
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
