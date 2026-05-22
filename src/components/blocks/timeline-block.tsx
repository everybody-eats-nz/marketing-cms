import { renderRichText } from './render-text'

type Item = { year: string; title: string; body?: string }

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    items?: Item[]
  }
}

export function TimelineBlock({ block }: Props) {
  const items = block.items || []
  if (!items.length) return null

  return (
    <section className="container-tight py-24">
      {block.eyebrow && <p className="eyebrow mb-6">{block.eyebrow}</p>}
      {block.heading && (
        <h2 className="display text-4xl sm:text-6xl font-light text-forest-700 leading-tight">
          {renderRichText(block.heading)}
        </h2>
      )}
      <ol className="mt-14 space-y-12 relative border-l-[1.5px] border-forest-500/25 pl-8 sm:pl-12">
        {items.map((m, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -left-[40px] sm:-left-[55px] top-1 w-3 h-3 rounded-full bg-sun-200 border-[3px] border-forest-700/10"
              aria-hidden
            />
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-forest-500/85 mb-2">
              {m.year}
            </div>
            <h3 className="display text-2xl sm:text-3xl font-medium text-forest-700">{m.title}</h3>
            {m.body && (
              <p className="mt-2 text-forest-600/85 max-w-2xl leading-relaxed">{m.body}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
