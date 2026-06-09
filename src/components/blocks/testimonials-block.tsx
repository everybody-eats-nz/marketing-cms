import { renderRichText } from './render-text'

type Quote = { quote: string; attribution?: string }

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    items?: Quote[]
  }
}

export function TestimonialsBlock({ block }: Props) {
  const items = block.items || []
  if (!items.length) return null

  return (
    <section className="container-wide py-24 sm:py-32">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12 max-w-3xl">
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl text-content font-light leading-tight">
              {renderRichText(block.heading)}
            </h2>
          )}
        </div>
      )}

      {/* Masonry-style pull-quote wall via CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
        {items.map((q, i) => (
          <figure
            key={i}
            className="break-inside-avoid mb-6 bg-surface-2 grain rounded-[2rem] p-8 sm:p-9"
          >
            <span
              className="display block text-6xl leading-[0.6] text-sun-300 select-none"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="mt-4 display text-xl sm:text-2xl font-light leading-snug text-content">
              {q.quote}
            </blockquote>
            {q.attribution && (
              <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted/80">
                {q.attribution}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
