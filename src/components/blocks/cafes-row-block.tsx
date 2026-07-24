import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'
import { resolveHref } from '@/lib/types'
import { renderRichText } from './render-text'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    intro?: string
  }
  cafes: any[]
}

// Friendly badge text — the raw enum ("coming-soon") would render as an ugly
// hyphenated "COMING-SOON" under the uppercase tracking.
const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  'coming-soon': 'Coming soon',
  closed: 'Closed',
}

export function CafesRowBlock({ block, cafes }: Props) {
  if (!cafes.length) return null

  return (
    <section className="container-wide pb-32">
      <div className="max-w-2xl mb-12">
        {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
        {block.heading && (
          <h2 className="display text-4xl sm:text-6xl text-content font-light">
            {renderRichText(block.heading)}
          </h2>
        )}
        {block.intro && (
          <p className="mt-5 text-lg text-content/85 leading-relaxed">{block.intro}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe, i) => {
          const href = resolveHref(cafe.link)
          const external = cafe.link?.type === 'external'
          const ctaLabel = cafe.link?.label || `Visit ${cafe.name}`
          return (
            <Link
              key={cafe.id}
              href={href}
              target={external && cafe.link?.openInNewTab ? '_blank' : undefined}
              rel={external && cafe.link?.openInNewTab ? 'noreferrer' : undefined}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-3 card-hover"
            >
              {cafe.heroImage ? (
                <PayloadImage
                  media={cafe.heroImage}
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
                {cafe.openStatus && (
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-3 text-cream-50/80">
                    <span className="w-2 h-2 rounded-full bg-sun-200 animate-pulse" />
                    {STATUS_LABEL[cafe.openStatus as string] || cafe.openStatus}
                  </div>
                )}
                <h3 className="display text-3xl sm:text-4xl font-light leading-tight">{cafe.name}</h3>
                {cafe.city && <p className="text-sm text-cream-50/85 mt-1">{cafe.city}</p>}
                {cafe.tagline && (
                  <p className="text-sm text-cream-50/85 mt-3 max-w-sm line-clamp-2">{cafe.tagline}</p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sun-200 group-hover:gap-3 transition-all">
                  {ctaLabel} <span>→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
