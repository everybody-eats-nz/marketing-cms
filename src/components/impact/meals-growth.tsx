import type { ImpactStoryYear } from '@/lib/impact-story'
import { fmt } from './format'
import { InView } from './in-view'

/**
 * Meals served each year — the hopeful growth story, from a single pop-up to
 * tens of thousands of dinners a year. Rounded bars grow up from the baseline as
 * the chart scrolls into view (staggered), with value labels fading in just
 * after. Partial (opening and current) years sit lower-opacity with a marker, so
 * the dip at the ends reads as "year still in progress", not "fewer meals".
 * Colours are theme tokens so it stays legible on the light and dark panels.
 */
export function MealsGrowth({ years }: { years: ImpactStoryYear[] }) {
  const W = 720
  const H = 320
  const padL = 8
  const padR = 8
  const padT = 34
  const padB = 34

  const n = years.length
  const max = Math.max(...years.map((d) => d.customers), 1)
  const slot = (W - padL - padR) / n
  const barW = Math.min(slot * 0.62, 64)
  const baseY = H - padB
  const h = (v: number) => (v / max) * (H - padT - padB)
  const cx = (i: number) => padL + slot * i + slot / 2

  const peak = years.reduce((a, b) => (b.customers > a.customers ? b : a), years[0])

  return (
    <InView
      as="figure"
      className="m-0 impact-chart"
      aria-label={`Meals served each year, from ${fmt(years[0].customers)} in ${years[0].year} to a peak of ${fmt(peak.customers)} in ${peak.year}.`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-hidden>
        <defs>
          <linearGradient id="mealsBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--chart-bar-from))" />
            <stop offset="100%" stopColor="rgb(var(--chart-bar-to))" />
          </linearGradient>
        </defs>

        {years.map((d, i) => {
          const bh = h(d.customers)
          const x = cx(i) - barW / 2
          return (
            <g key={d.year}>
              <rect
                className="reveal-grow-y"
                style={{ transitionDelay: `${i * 70}ms` }}
                x={x}
                y={baseY - bh}
                width={barW}
                height={bh}
                rx={7}
                fill="url(#mealsBar)"
                opacity={d.partial ? 0.42 : 1}
              />
              {/* value label above each bar */}
              <text
                className="reveal-fade font-mono"
                style={{ transitionDelay: `${i * 70 + 220}ms` }}
                x={cx(i)}
                y={baseY - bh - 10}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight={600}
                fill="rgb(var(--chart-label))"
                fillOpacity={d.partial ? 0.6 : 1}
              >
                {fmt(d.customers)}
              </text>
              {/* year label */}
              <text
                x={cx(i)}
                y={H - 12}
                textAnchor="middle"
                className="font-mono"
                fontSize="11.5"
                fill="rgb(var(--chart-ink))"
                fillOpacity={0.7}
              >
                {d.year}
                {d.partial ? '*' : ''}
              </text>
            </g>
          )
        })}

        {/* baseline */}
        <line
          x1={padL}
          x2={W - padR}
          y1={baseY}
          y2={baseY}
          stroke="rgb(var(--chart-ink))"
          strokeOpacity={0.18}
        />
      </svg>

      <table className="sr-only">
        <caption>Meals served by year</caption>
        <thead>
          <tr>
            <th>Year</th>
            <th>Meals served</th>
            <th>Service nights</th>
          </tr>
        </thead>
        <tbody>
          {years.map((d) => (
            <tr key={d.year}>
              <th>
                {d.year}
                {d.partial ? ' (partial)' : ''}
              </th>
              <td>{fmt(d.customers)}</td>
              <td>{fmt(d.nights)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </InView>
  )
}
