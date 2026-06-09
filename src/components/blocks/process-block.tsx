import { renderRichText } from './render-text'

type Step = { number?: string; title: string; copy?: string }

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    items?: Step[]
  }
}

export function ProcessBlock({ block }: Props) {
  const items = block.items || []
  if (!items.length) return null

  return (
    <section className="container-wide py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sticky heading column — pins while the steps scroll past */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl font-light text-content leading-[1.05]">
              {renderRichText(block.heading)}
            </h2>
          )}
          <div className="mt-8 hidden lg:flex items-center gap-3 text-muted/70">
            <span className="inline-block w-10 h-px bg-line/40" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              {items.length} steps
            </span>
          </div>
        </div>

        {/* Scrolling steps */}
        <ol className="lg:col-span-7 lg:col-start-6 border-t border-line/15">
          {items.map((s, i) => (
            <li
              key={i}
              className="group grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-10 gap-y-3 border-b border-line/15 py-10 sm:py-14"
            >
              <span
                className="display text-5xl sm:text-7xl font-light leading-none text-content/15 transition-colors duration-300 group-hover:text-sun-200"
                aria-hidden
              >
                {s.number || String(i + 1).padStart(2, '0')}
              </span>
              <div className="self-center">
                <h3 className="display text-2xl sm:text-3xl font-medium text-content">
                  {s.title}
                </h3>
              </div>
              {s.copy && (
                <p className="col-start-2 max-w-xl text-content/80 leading-relaxed">
                  {s.copy}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
