import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'
import { renderRichText } from './render-text'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    viewAllLabel?: string
    viewAllHref?: string
    limit?: number
  }
  events: any[]
}

export function EventsListBlock({ block, events }: Props) {
  const limit = block.limit || 4
  const docs = events.slice(0, limit)
  if (!docs.length) return null

  return (
    <section className="container-wide py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl text-content font-light">
              {renderRichText(block.heading)}
            </h2>
          )}
        </div>
        {block.viewAllLabel && block.viewAllHref && (
          <Link href={block.viewAllHref} className="btn-ghost shrink-0">
            {block.viewAllLabel}
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {docs.map((ev) => {
          const date = ev.date ? new Date(ev.date) : null
          return (
            <Link
              key={ev.id}
              href={`/events/${ev.slug}`}
              className="group flex gap-5 p-4 rounded-2xl hover:bg-surface-2 transition-colors"
            >
              <div className="shrink-0 w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden bg-surface-3 relative">
                {ev.image ? (
                  <PayloadImage
                    media={ev.image}
                    size="card"
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-300 to-forest-500" />
                )}
              </div>
              <div className="flex-1 min-w-0 py-2">
                {date && (
                  <div className="font-mono text-xs uppercase tracking-[0.15em] text-muted/70 mb-2">
                    {date.toLocaleDateString('en-NZ', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                    {ev.displayTime && ` · ${ev.displayTime}`}
                  </div>
                )}
                <h3 className="display text-xl sm:text-2xl text-content font-medium leading-snug line-clamp-2">
                  {ev.name}
                </h3>
                {ev.shortDescription && (
                  <p className="mt-2 text-sm text-content/75 line-clamp-2">{ev.shortDescription}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-muted group-hover:gap-2 transition-all">
                  Learn more <span>→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
