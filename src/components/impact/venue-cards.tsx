import type { ImpactStoryLocation } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { InView } from './in-view'
import { fmt } from './format'

/**
 * Where we serve — one card per venue, warm and public-facing: the total meals
 * served at that location and the number of service nights behind them. Figures
 * count up on scroll. Theme-aware so it reads on light or dark.
 */
export function VenueCards({ locations }: { locations: ImpactStoryLocation[] }) {
  return (
    <InView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((v) => (
        <div
          key={v.name}
          className="flex flex-col bg-surface-2 border border-line/10 rounded-3xl p-6 sm:p-7 card-hover"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="display text-2xl font-light leading-[1.1] text-balance text-content">
              {v.name}
            </h3>
            <span className="eyebrow shrink-0 whitespace-nowrap">since {v.firstYear}</span>
          </div>

          {/* mt-auto pins the figures to the card's bottom so every card in a row
              baseline-aligns, however many lines the venue name wraps to. */}
          <div className="mt-auto flex items-end justify-between gap-4 pt-8">
            <div>
              <div className="display text-4xl font-light text-content tabular-nums leading-none">
                <CountUp value={fmt(v.customers)} />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted/70 mt-2">
                meals served
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl text-content tabular-nums leading-none">
                <CountUp value={fmt(v.nights)} />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted/70 mt-2">services</div>
            </div>
          </div>
        </div>
      ))}
    </InView>
  )
}
