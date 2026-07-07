import Link from 'next/link'
import type { ImpactStory } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { fmt, money } from '@/components/impact/format'
import { CommunalTable } from '@/components/impact/communal-table'
import { MealsGrowth } from '@/components/impact/meals-growth'
import { VenueCards } from '@/components/impact/venue-cards'
import { MilestoneLadder } from '@/components/impact/milestone-ladder'
import { HeadlineStats } from '@/components/impact/headline-stats'
import { DiningRoomMural } from '@/components/dining-room-mural'
import { renderRichText } from './render-text'

// Renders the `/impact` data story from CMS copy + LIVE portal figures. The
// numbers and charts come from `story` (fetched in page-body.tsx); this block
// only owns the prose around them. See src/blocks/ImpactLanding.ts.

type Block = Record<string, any>

/** "2020-06-28" → "Jun 2020". */
function monthYear(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
}

/** Substitute {token}s with live figures, collapsing any doubled spaces. */
function fill(template: string | undefined, vars: Record<string, string>) {
  if (!template) return ''
  return template.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m).replace(/\s{2,}/g, ' ').trim()
}

function SectionHead({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow flex items-center gap-3 text-clay-300">
        <span className="inline-block w-8 h-px bg-clay-300/60" />
        {kicker}
      </p>
      <h2 className="display text-3xl sm:text-5xl font-light text-content mt-4">{title}</h2>
      {children && <p className="text-base text-content/80 mt-5 leading-relaxed">{children}</p>}
    </div>
  )
}

export function ImpactLandingBlock({ block, story }: { block: Block; story: ImpactStory }) {
  const b = block
  const t = story.totals
  const first = monthYear(t.firstNight)
  const last = monthYear(t.lastNight)
  const range = first && last ? `${first} — ${last}` : null
  const firstYear = story.yearly[0]
  const tonnes = Math.round(t.foodSavedKg / 1000)
  const guestShare = t.nonPayingPercent ?? null

  const vars = {
    meals: fmt(t.meals),
    firstYear: String(firstYear?.year ?? ''),
    nights: fmt(t.nights),
    range: range ? `(${range})` : '',
    perMeal: String(t.foodSavedKgPerMeal),
  }

  return (
    <div className="bg-surface">
      <div className="container-tight pt-16 sm:pt-24 pb-10">
        {/* Header */}
        <header className="animate-fade-up">
          <p className="eyebrow">
            {b.eyebrowPrefix}
            {range ? ` · ${fmt(t.nights)} service nights · ${range}` : ''}
          </p>
          <h1 className="display text-6xl sm:text-7xl font-light leading-[0.95] text-content mt-5">
            {renderRichText(b.heading)}
          </h1>
          <p className="text-lg text-content/80 mt-6 max-w-xl leading-relaxed">
            {fill(b.intro, vars)}
          </p>
        </header>

        <div className="mt-12">
          <HeadlineStats
            stats={[
              { value: `${fmt(t.meals)}`, label: b.statMealsLabel, accent: 'text-content' },
              { value: `${fmt(tonnes)}t`, label: b.statFoodLabel, accent: 'text-forest-400' },
              {
                value: `${fmt(t.newVolunteers)}`,
                label: b.statVolunteersLabel,
                accent: 'text-clay-300',
              },
              { value: money(t.koha), label: b.statKohaLabel, accent: 'text-content' },
            ]}
          />
        </div>
      </div>

      {/* Pay-as-you-feel — the communal table */}
      <section className="container-tight pb-4">
        <div className="max-w-2xl mb-9">
          <p className="eyebrow flex items-center gap-3 text-clay-300">
            <span className="inline-block w-8 h-px bg-clay-300/60" />
            {b.payEyebrow}
          </p>
          <h2 className="display text-3xl sm:text-5xl font-light text-content mt-4">
            {renderRichText(b.payHeading)}
          </h2>
          <p className="text-base text-content/80 mt-5 leading-relaxed">{b.payBody}</p>
        </div>
        <CommunalTable years={story.yearly} />
      </section>

      {/* Meals growing each year */}
      <section className="container-tight py-16 sm:py-24">
        <SectionHead kicker={b.growthEyebrow} title={renderRichText(b.growthHeading)}>
          {b.growthBody}
        </SectionHead>

        <div className="mt-10 bg-surface-2 border border-line/10 rounded-3xl p-5 sm:p-8">
          <MealsGrowth years={story.yearly} />
          <p className="text-xs text-muted/60 mt-3 px-1">{fill(b.growthCaption, vars)}</p>
        </div>
      </section>

      {/* Food rescued — sun panel */}
      <section className="container-wide pb-16 sm:pb-24">
        <div className="bg-sun-200 grain rounded-[2.5rem] sm:rounded-[3rem] text-forest-700 px-7 sm:px-14 py-14 sm:py-20 relative overflow-hidden">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center max-w-6xl mx-auto">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest-700/70">
                <span className="inline-block w-8 h-px bg-forest-700/40" />
                {b.rescuedEyebrow}
              </p>
              <h2 className="display text-3xl sm:text-5xl font-light mt-4">
                {renderRichText(b.rescuedHeading)}
              </h2>
              <p className="text-base text-forest-700/80 mt-5 leading-relaxed max-w-md">
                {b.rescuedBody}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              <div>
                <div className="display text-6xl sm:text-7xl font-light leading-none tabular-nums">
                  <CountUp value={fmt(tonnes)} />
                  <span className="text-3xl sm:text-4xl align-top ml-1">t</span>
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-forest-700/70 mt-3">
                  {b.rescuedTonnesLabel}
                </div>
              </div>
              <div>
                <div className="display text-6xl sm:text-7xl font-light leading-none tabular-nums">
                  <CountUp value={fmt(t.meals)} delay={120} />
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-forest-700/70 mt-3">
                  {b.rescuedMealsLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where we serve */}
      <section className="container-tight pb-16 sm:pb-24">
        <SectionHead kicker={b.venuesEyebrow} title={renderRichText(b.venuesHeading)}>
          {b.venuesBody}
        </SectionHead>
        <div className="mt-10">
          <VenueCards locations={story.locations} />
        </div>
      </section>

      {/* The people */}
      <section className="container-wide pb-20 sm:pb-28">
        <div className="bg-forest-700 grain rounded-[2.5rem] sm:rounded-[3rem] [clip-path:inset(0_round_2.5rem)] sm:[clip-path:inset(0_round_3rem)] text-cream-50 px-7 sm:px-14 py-16 sm:py-20 relative overflow-hidden">
          <div
            className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-sun-200/10 blur-3xl"
            aria-hidden
          />
          <DiningRoomMural className="absolute -bottom-12 -right-10 w-[34rem] sm:w-[46rem] aspect-[1280/759] text-cream-50/[0.06]" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <p className="eyebrow flex items-center gap-3 text-sun-200/90">
              <span className="inline-block w-8 h-px bg-sun-200/50" />
              {b.peopleEyebrow}
            </p>
            <h2 className="display text-3xl sm:text-5xl font-light mt-4 max-w-2xl">
              {renderRichText(b.peopleHeading)}
            </h2>

            <div className="mt-12">
              <HeadlineStats
                onDark
                stats={[
                  {
                    value: `${fmt(t.volunteers)}`,
                    label: b.peopleVolunteersLabel,
                    accent: 'text-cream-50',
                  },
                  {
                    value: `${fmt(t.volunteerHours)}`,
                    label: b.peopleHoursLabel,
                    accent: 'text-sun-200',
                  },
                  {
                    value: `${fmt(t.nights)}`,
                    label: b.peopleNightsLabel,
                    accent: 'text-cream-50',
                  },
                  ...(guestShare != null
                    ? [
                        {
                          value: `${guestShare}%`,
                          label: b.peopleGuestsLabel,
                          accent: 'text-clay-200',
                        },
                      ]
                    : []),
                ]}
              />
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="max-w-sm">
                <h3 className="display text-2xl font-light">{b.peopleSubheading}</h3>
                <p className="text-sm text-cream-50/75 mt-4 leading-relaxed">{b.peopleSubbody}</p>
              </div>
              <MilestoneLadder milestones={story.milestones} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight pb-20 sm:pb-28 text-center">
        <h2 className="display text-3xl sm:text-4xl font-light text-content">
          {renderRichText(b.ctaHeading)}
        </h2>
        <p className="text-content/75 mt-4 max-w-md mx-auto">{b.ctaBody}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link href="/dine-with-us" className="btn-primary">
            {b.ctaPrimaryLabel}
          </Link>
          <a
            href="https://volunteers.everybodyeats.nz"
            className="btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            {b.ctaSecondaryLabel}
          </a>
        </div>
      </section>

      {/* Reading notes */}
      <footer className="container-tight pb-20 border-t border-line/10 pt-8">
        <p className="text-xs text-muted/70 leading-relaxed max-w-3xl">{fill(b.footerNote, vars)}</p>
      </footer>
    </div>
  )
}
