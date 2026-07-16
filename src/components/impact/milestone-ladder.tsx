import type { ImpactStoryMilestone } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { InView } from './in-view'
import { fmt } from './format'

/**
 * The volunteer milestone ladder — how many volunteers have served at least
 * 10 / 25 / 50 / 100 / 200 nights. Bars scale to the biggest rung so the steep
 * drop-off (lots of first-timers, a devoted few who keep coming back) reads at a
 * glance. Counts animate in via the shared CountUp.
 */
export function MilestoneLadder({ milestones }: { milestones: ImpactStoryMilestone[] }) {
  const rungs = [...milestones].sort((a, b) => a.threshold - b.threshold)
  const max = Math.max(...rungs.map((m) => m.volunteers), 1)

  return (
    <InView as="div" threshold={0.3}>
      <div className="flex items-center gap-4 mb-4">
        <span className="w-24 sm:w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-50/45">
          service nights milestones
        </span>
        <span className="flex-1" />
        <span className="w-16 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-cream-50/45">
          volunteers
        </span>
      </div>
      <ul className="space-y-4">
        {rungs.map((m, i) => (
          <li key={m.threshold} className="flex items-center gap-4">
            <span className="w-24 sm:w-28 shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-cream-50/70">
              {m.threshold}+ nights
            </span>
            <span className="flex-1 h-3 rounded-pill bg-cream-50/10 relative overflow-hidden">
              <span
                className="reveal-grow-x absolute inset-y-0 left-0 rounded-pill bg-sun-200/85"
                style={{
                  ['--reveal-w' as string]: `${Math.max((m.volunteers / max) * 100, 3)}%`,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
            <span className="w-16 text-right font-mono text-base sm:text-lg font-semibold text-cream-50 tabular-nums">
              <CountUp value={fmt(m.volunteers)} delay={i * 120} />
            </span>
          </li>
        ))}
      </ul>
    </InView>
  )
}
