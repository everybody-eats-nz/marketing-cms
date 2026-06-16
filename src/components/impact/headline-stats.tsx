import { CountUp } from '@/components/count-up'

export type HeadlineStat = {
  value: string
  label: string
  /** Tailwind text-colour class for the figure, e.g. 'text-sun-300'. */
  accent?: string
}

/**
 * A responsive row of big count-up figures. `onDark` flips label colours for use
 * on the forest panel. Figures animate up when scrolled into view (CountUp).
 */
export function HeadlineStats({
  stats,
  onDark = false,
}: {
  stats: HeadlineStat[]
  onDark?: boolean
}) {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
      {stats.map((s, i) => (
        <div key={i}>
          <dd
            className={`display font-light tracking-tight tabular-nums whitespace-nowrap text-4xl sm:text-5xl ${
              s.accent ?? (onDark ? 'text-cream-50' : 'text-content')
            }`}
          >
            <CountUp value={s.value} delay={i * 110} />
          </dd>
          <dt
            className={`mt-2 text-xs uppercase tracking-[0.15em] ${
              onDark ? 'text-cream-50/65' : 'text-muted/70'
            }`}
          >
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  )
}
