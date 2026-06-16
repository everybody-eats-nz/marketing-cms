import type { ImpactStoryLocation } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { InView } from './in-view'
import { fmt, money } from './format'

/**
 * Where we serve — one card per venue, warm and public-facing: total meals, how
 * many neighbours sit down on a typical night, koha given by that community, and
 * the year it opened. A proportional bar (wiping in on scroll) shows each venue's
 * share of meals; the figures count up. Theme-aware so it reads on light or dark.
 */
export function VenueCards({ locations }: { locations: ImpactStoryLocation[] }) {
  const maxMeals = Math.max(...locations.map((v) => v.customers), 1)

  return (
    <InView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((v) => (
        <div key={v.name} className="bg-surface-2 border border-line/10 rounded-3xl p-7 card-hover">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="display text-2xl font-light text-content">{v.name}</h3>
            <span className="eyebrow">since {v.firstYear}</span>
          </div>

          <div className="mt-6">
            <div className="display text-4xl font-light text-content tabular-nums leading-none">
              <CountUp value={fmt(v.customers)} />
            </div>
            <div className="text-xs uppercase tracking-[0.15em] text-muted/70 mt-2">meals served</div>
          </div>

          {/* share-of-meals bar */}
          <div className="mt-4 h-2 rounded-pill bg-surface-3 overflow-hidden">
            <div
              className="reveal-grow-x h-full rounded-pill bg-forest-500 dark:bg-forest-300"
              style={{ ['--reveal-w' as string]: `${(v.customers / maxMeals) * 100}%` }}
            />
          </div>

          <dl className="flex gap-7 mt-6">
            <div>
              <dd className="font-mono text-lg text-content tabular-nums">
                <CountUp value={fmt(v.avgCustomersPerNight)} />
              </dd>
              <dt className="text-xs text-muted/70 mt-0.5">diners a night</dt>
            </div>
            <div>
              <dd className="font-mono text-lg text-content tabular-nums">
                <CountUp value={money(v.koha)} />
              </dd>
              <dt className="text-xs text-muted/70 mt-0.5">given in koha</dt>
            </div>
          </dl>
        </div>
      ))}
    </InView>
  )
}
