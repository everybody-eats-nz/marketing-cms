import type { ImpactStoryLocation } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { InView } from './in-view'
import { fmt, money } from './format'

/**
 * Where we serve — one card per venue, warm and public-facing: total meals, how
 * many neighbours sit down on a typical night, and koha given by that community.
 * Rather than ranking the venues against each other, each card shows its own
 * pay-as-you-feel split — the share who paid it forward vs. ate as our guests —
 * which wipes in on scroll. Theme-aware so it reads on light or dark. Falls back
 * to a share-of-meals bar if the split isn't available for a venue.
 */
export function VenueCards({ locations }: { locations: ImpactStoryLocation[] }) {
  const maxMeals = Math.max(...locations.map((v) => v.customers), 1)

  return (
    <InView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((v) => {
        const free = v.nonPayingPercent != null ? Math.round(v.nonPayingPercent) : null
        const paid = free != null ? 100 - free : null

        return (
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

            {free != null && paid != null ? (
              /* pay-as-you-feel split — paid it forward vs. ate as our guests */
              <div className="mt-5">
                <div className="flex h-2.5 rounded-pill bg-surface-3 overflow-hidden">
                  <div
                    className="reveal-grow-x h-full shrink-0 bg-forest-500 dark:bg-forest-300"
                    style={{ ['--reveal-w' as string]: `${paid}%` }}
                  />
                  <div
                    className="reveal-grow-x h-full shrink-0 bg-clay-300"
                    style={{ ['--reveal-w' as string]: `${free}%` }}
                  />
                </div>
                <div className="flex justify-between gap-3 mt-2.5 text-xs text-muted/70">
                  <span>
                    <span className="font-mono text-content">{paid}%</span> paid it forward
                  </span>
                  <span>
                    <span className="font-mono text-content">{free}%</span> ate as guests
                  </span>
                </div>
              </div>
            ) : (
              /* fallback: share-of-meals bar when the split isn't available */
              <div className="mt-4 h-2 rounded-pill bg-surface-3 overflow-hidden">
                <div
                  className="reveal-grow-x h-full rounded-pill bg-forest-500 dark:bg-forest-300"
                  style={{ ['--reveal-w' as string]: `${(v.customers / maxMeals) * 100}%` }}
                />
              </div>
            )}

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
        )
      })}
    </InView>
  )
}
