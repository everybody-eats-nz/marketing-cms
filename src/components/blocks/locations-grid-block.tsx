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
  locations: any[]
}

export function LocationsGridBlock({ block, locations }: Props) {
  const limit = block.limit || 6
  const docs = locations.slice(0, limit)
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((loc, i) => (
          <Link
            key={loc.id}
            href={loc.listButtons?.visitHref || `/dine-with-us/${loc.slug}`}
            className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-3 card-hover"
          >
            {loc.heroImage ? (
              <PayloadImage
                media={loc.heroImage}
                size="feature"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: [
                    'linear-gradient(135deg, #1D5337, #5A8B62)',
                    'linear-gradient(135deg, #2E6438, #9BBDA0)',
                    'linear-gradient(135deg, #163F2A, #5A8B62)',
                  ][i % 3],
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-700/85 via-forest-700/20 to-transparent" />
            <div className="absolute inset-0 p-7 flex flex-col justify-end text-cream-50">
              {loc.openStatus && (
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-3 text-cream-50/80">
                  <span className="w-2 h-2 rounded-full bg-sun-200 animate-pulse" />
                  {loc.openStatus === 'open' ? 'Open' : loc.openStatus}
                </div>
              )}
              <h3 className="display text-3xl sm:text-4xl font-light leading-tight">{loc.name}</h3>
              {loc.city && <p className="text-sm text-cream-50/85 mt-1">{loc.city}</p>}
              {loc.tagline && (
                <p className="text-sm text-cream-50/85 mt-3 max-w-sm line-clamp-2">{loc.tagline}</p>
              )}
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sun-200 group-hover:gap-3 transition-all">
                {loc.listButtons?.visitLabel?.replace('{name}', loc.name) || `Visit ${loc.name}`}{' '}
                <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
