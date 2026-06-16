import { KawakawaPattern } from '@/components/kawakawa-pattern'
import { CountUp } from '@/components/count-up'
import type { LiveImpactStats } from '@/lib/impact-stats'
import type { LiveMetric } from '@/fields/stat-item'
import { renderRichText } from './render-text'

type Stat = {
  value: string
  label: string
  liveMetric?: LiveMetric | 'none' | null
  suffix?: string | null
}

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    variant?: 'light' | 'darkPanel'
    source?: 'global' | 'custom'
    items?: Stat[]
  }
  globalStats?: Stat[]
  liveStats?: LiveImpactStats | null
}

/** Resolve a stat's display value — a live figure when bound and available, else the fixed value. */
function resolveValue(stat: Stat, liveStats?: LiveImpactStats | null): string {
  if (stat.liveMetric && stat.liveMetric !== 'none') {
    const live = liveStats?.[stat.liveMetric]
    if (typeof live === 'number' && Number.isFinite(live)) {
      return `${live.toLocaleString('en-NZ')}${stat.suffix ?? ''}`
    }
  }
  return stat.value
}

export function StatsBlock({ block, globalStats = [], liveStats = null }: Props) {
  const source = block.source === 'custom' ? block.items || [] : globalStats
  if (!source.length) return null
  const stats = source.map((s) => ({ value: resolveValue(s, liveStats), label: s.label }))
  const isDark = block.variant === 'darkPanel'

  if (isDark) {
    return (
      <section className="container-wide py-24">
        <div className="bg-forest-700 grain rounded-[3rem] text-cream-50 px-8 lg:px-16 py-20 relative overflow-hidden">
          <KawakawaPattern className="top-0 -right-8 w-80 sm:w-[26rem]" />
          <div className="relative z-10">
            {block.eyebrow && (
              <p className="eyebrow text-cream-50/70 mb-4">{block.eyebrow}</p>
            )}
            {block.heading && (
              <h2 className="display text-4xl sm:text-6xl font-light max-w-3xl">
                {renderRichText(block.heading)}
              </h2>
            )}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="display stat-figure-dark font-light text-cream-50 tabular-nums whitespace-nowrap">
                    <CountUp value={s.value} delay={i * 120} />
                  </div>
                  <div className="mt-3 text-sm uppercase tracking-[0.15em] text-cream-50/70">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
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
            <h2 className="display text-4xl sm:text-6xl text-content font-light">
              {renderRichText(block.heading)}
            </h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line/15 rounded-3xl overflow-hidden">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface px-8 py-10 sm:py-14">
            <div className="display stat-figure font-light text-content tracking-tight tabular-nums whitespace-nowrap">
              <CountUp value={s.value} delay={i * 120} />
            </div>
            <div className="mt-3 text-sm uppercase tracking-[0.15em] text-muted/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
