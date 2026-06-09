import Link from 'next/link'
import { renderRichText } from './render-text'

type Pillar = {
  number?: string
  title: string
  copy?: string
  ctaLabel?: string
  href: string
}

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    theme?: 'forest' | 'cream'
    items?: Pillar[]
  }
}

export function PillarsBlock({ block }: Props) {
  const items = block.items || []
  if (!items.length) return null
  const isForest = block.theme !== 'cream'

  return (
    <section
      className={`${isForest ? 'bg-forest-700 text-cream-50' : 'bg-surface-2 text-content'} grain py-24 sm:py-32 relative overflow-hidden`}
    >
      <div className="container-wide relative z-10">
        {block.eyebrow && (
          <p className={`eyebrow mb-4 ${isForest ? 'text-cream-50/60' : ''}`}>{block.eyebrow}</p>
        )}
        {block.heading && (
          <h2 className="display text-4xl sm:text-6xl lg:text-7xl font-light max-w-3xl">
            {renderRichText(block.heading)}
          </h2>
        )}

        <div
          className={`mt-16 grid gap-px rounded-3xl overflow-hidden ${
            items.length >= 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : ''
          } ${isForest ? 'bg-cream-50/10' : 'bg-line/15'}`}
        >
          {items.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className={`group p-8 sm:p-12 transition-colors ${
                isForest ? 'bg-forest-700 hover:bg-forest-600' : 'bg-surface hover:bg-surface-2'
              }`}
            >
              {c.number && (
                <div
                  className={`font-mono text-xs mb-6 tracking-[0.2em] ${
                    isForest ? 'text-sun-200/80' : 'text-muted/70'
                  }`}
                >
                  {c.number}
                </div>
              )}
              <h3 className="display text-3xl sm:text-4xl font-light mb-4">{c.title}</h3>
              {c.copy && (
                <p className={`leading-relaxed mb-8 ${isForest ? 'text-cream-50/80' : 'text-content/80'}`}>
                  {c.copy}
                </p>
              )}
              <span
                className={`inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all ${
                  isForest ? 'text-sun-200' : 'text-muted'
                }`}
              >
                {(c.ctaLabel || 'Learn more').replace(/\s*→\s*$/, '')} <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      {isForest && (
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl pointer-events-none"
          aria-hidden
        />
      )}
    </section>
  )
}
