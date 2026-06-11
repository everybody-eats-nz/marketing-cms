import Link from 'next/link'
import { renderRichText } from './render-text'

type Card = {
  number?: string
  title: string
  copy?: string
  email?: string
  ctaLabel?: string
  href?: string
  color?: 'cream' | 'sun' | 'clay' | 'forest100' | 'forest700'
}

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    viewAllLabel?: string
    viewAllHref?: string
    columns?: '2' | '3' | '4'
    cardStyle?: 'soft' | 'tile' | 'mixed'
    items?: Card[]
  }
}

const COLUMN_CLASSES: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

const COLOR_CLASSES: Record<string, string> = {
  cream: 'bg-surface-2 text-content',
  sun: 'bg-sun-100 text-forest-700',
  clay: 'bg-clay-100 text-forest-700',
  forest100: 'bg-surface-3 text-content',
  forest700: 'bg-forest-700 text-cream-50',
}

export function CardGridBlock({ block }: Props) {
  const items = block.items || []
  if (!items.length) return null
  const colClass = COLUMN_CLASSES[block.columns || '3']
  const style = block.cardStyle || 'soft'

  const wrapperClasses =
    style === 'tile'
      ? `grid gap-px bg-line/15 rounded-3xl overflow-hidden ${colClass}`
      : `grid gap-6 ${colClass}`

  return (
    <section className="container-wide py-16 sm:py-24">
      {(block.eyebrow || block.heading || (block.viewAllLabel && block.viewAllHref)) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            {block.eyebrow && <p className="eyebrow mb-3">{block.eyebrow}</p>}
            {block.heading && (
              <h2 className="display text-4xl sm:text-6xl text-content font-light leading-tight">
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
      )}

      <div className={wrapperClasses}>
        {items.map((c, i) => {
          const cardBg =
            style === 'tile'
              ? 'bg-surface text-content'
              : style === 'mixed'
                ? COLOR_CLASSES[c.color || 'cream']
                : 'bg-surface-2 text-content'
          const isDark = style === 'mixed' && c.color === 'forest700'
          // sun/clay fills don't flip with the theme, so their secondary text
          // must stay forest-dark rather than use the theme-driven `muted` token
          // (which goes pale in dark mode and vanishes on the light fill).
          const isFixedLight = style === 'mixed' && (c.color === 'sun' || c.color === 'clay')

          const cardInner = (
            <div className={`${cardBg} grain p-8 sm:p-10 rounded-${style === 'tile' ? 'none' : '[2rem]'} flex flex-col h-full`}>
              {c.number && (
                <div
                  className={`font-mono text-xs uppercase tracking-[0.2em] mb-6 ${
                    isDark ? 'text-sun-200/80' : isFixedLight ? 'text-forest-700/60' : 'text-muted/70'
                  }`}
                >
                  {c.number}
                </div>
              )}
              <h3 className={`display text-2xl sm:text-3xl font-medium mb-3 ${isDark ? '' : ''}`}>
                {c.title}
              </h3>
              {c.copy && (
                <p className={`${isDark ? 'opacity-85' : 'opacity-85'} leading-relaxed mb-4`}>{c.copy}</p>
              )}
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className={`mt-2 inline-flex items-center gap-2 text-sm underline underline-offset-4 break-all ${
                    isFixedLight
                      ? 'text-forest-500 hover:text-forest-700'
                      : 'text-muted hover:text-content'
                  }`}
                >
                  {c.email}
                </a>
              )}
              {c.ctaLabel && c.href && (
                <span
                  className={`mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all ${
                    isDark ? 'text-sun-200' : isFixedLight ? 'text-forest-500' : 'text-muted'
                  }`}
                >
                  {c.ctaLabel}
                </span>
              )}
            </div>
          )

          const cls = `group ${style === 'tile' ? '' : ''}`

          if (c.href && c.ctaLabel) {
            return (
              <Link key={i} href={c.href} className={cls}>
                {cardInner}
              </Link>
            )
          }
          return (
            <div key={i} className={cls}>
              {cardInner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
