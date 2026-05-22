import { renderRichText } from './render-text'

type Stat = { value: string; label: string }

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    variant?: 'light' | 'darkPanel'
    source?: 'global' | 'custom'
    items?: Stat[]
  }
  globalStats?: Stat[]
}

export function StatsBlock({ block, globalStats = [] }: Props) {
  const stats = block.source === 'custom' ? block.items || [] : globalStats
  if (!stats.length) return null
  const isDark = block.variant === 'darkPanel'

  if (isDark) {
    return (
      <section className="container-wide py-24">
        <div className="bg-forest-700 grain rounded-[3rem] text-cream-50 px-8 sm:px-16 py-20 relative overflow-hidden">
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl"
            aria-hidden
          />
          {block.eyebrow && (
            <p className="eyebrow text-cream-50/70 mb-4">{block.eyebrow}</p>
          )}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl font-light max-w-3xl">
              {renderRichText(block.heading)}
            </h2>
          )}
          <div className="mt-16 grid sm:grid-cols-3 gap-12">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="display text-5xl sm:text-7xl font-light text-cream-50">
                  {s.value}
                </div>
                <div className="mt-3 text-sm uppercase tracking-[0.15em] text-cream-50/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container-wide py-24">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12">
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl text-forest-700 font-light">
              {renderRichText(block.heading)}
            </h2>
          )}
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-px bg-forest-500/15 rounded-3xl overflow-hidden">
        {stats.map((s, i) => (
          <div key={i} className="bg-cream-50 px-8 py-10 sm:py-14">
            <div className="display text-5xl sm:text-6xl lg:text-7xl font-light text-forest-600 tracking-tight">
              {s.value}
            </div>
            <div className="mt-3 text-sm uppercase tracking-[0.15em] text-forest-500/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
