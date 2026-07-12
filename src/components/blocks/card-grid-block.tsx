import Link from 'next/link'
import { renderRichText } from './render-text'
import { type DocFile, formatBytes, fileLabel } from './file-meta'

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
    download?: DocFile | string | null
    downloadLabel?: string
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
  // Only a populated (object) upload with a URL is renderable.
  const download =
    typeof block.download === 'object' && block.download?.url ? block.download : null

  const wrapperClasses =
    style === 'tile'
      ? `grid gap-px bg-line/15 rounded-3xl overflow-hidden ${colClass}`
      : `grid gap-6 ${colClass}`

  const downloadBar = download && (
    <a
      href={download.url}
      target="_blank"
      rel="noopener noreferrer"
      download={download.filename}
      className="group grain mb-6 flex items-center gap-5 rounded-[1.75rem] bg-surface-2 p-6 sm:px-8 transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <span
        className="shrink-0 grid place-items-center size-12 rounded-2xl bg-forest-700 text-cream-50"
        aria-hidden
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M12 11v6" />
          <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 mb-0.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted/70">
          {fileLabel(download.mimeType)}
          {formatBytes(download.filesize) && (
            <>
              <span aria-hidden>·</span>
              <span>{formatBytes(download.filesize)}</span>
            </>
          )}
        </span>
        <span className="block display text-lg sm:text-xl font-medium text-content leading-snug">
          {block.downloadLabel || download.title || download.filename || 'Download'}
        </span>
      </span>

      <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-forest-500 dark:text-forest-200 group-hover:gap-2.5 transition-all">
        <span className="hidden sm:inline">Download</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 4v12" />
          <path d="m6 12 6 6 6-6" />
          <path d="M5 20h14" />
        </svg>
      </span>
    </a>
  )

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

      {downloadBar}

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
