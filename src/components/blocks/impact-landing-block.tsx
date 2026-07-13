import Link from 'next/link'
import { FOOD_KG_PER_MEAL, type ImpactStory } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { fmt } from '@/components/impact/format'
import { CommunalTable } from '@/components/impact/communal-table'
import { MealsGrowth } from '@/components/impact/meals-growth'
import { VenueCards } from '@/components/impact/venue-cards'
import { MilestoneLadder } from '@/components/impact/milestone-ladder'
import { HeadlineStats } from '@/components/impact/headline-stats'
import { DiningRoomMural } from '@/components/dining-room-mural'
import { PayloadImage } from '@/components/payload-image'
import { renderRichText } from './render-text'

// Renders the `/impact` data story from CMS copy + LIVE portal figures. The
// numbers and charts come from `story` (fetched in page-body.tsx); this block
// only owns the prose around them. See src/blocks/ImpactLanding.ts.
//
// Exception: the food-rescued weight and the CO₂ saved from it are derived from
// the live meal count × FOOD_KG_PER_MEAL (Everybody Eats' agreed estimate), not
// the portal's own foodSavedKg/foodSavedKgPerMeal — see the constant's doc.

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

export function ImpactLandingBlock({
  block,
  story,
  cmsLocations = [],
}: {
  block: Block
  story: ImpactStory
  /** Published CMS locations flagged "show in main grids" — our permanent
   *  restaurants. Used to split the venue cards from pop-ups. */
  cmsLocations?: any[]
}) {
  const b = block
  const t = story.totals
  const first = monthYear(t.firstNight)
  const last = monthYear(t.lastNight)
  const range = first && last ? `${first} — ${last}` : null
  const firstYear = story.yearly[0]
  // Food rescued = live meals × the agreed per-meal estimate (see FOOD_KG_PER_MEAL),
  // so the story stays consistent whether the data is live or the fallback.
  const foodSavedKg = Math.round(t.meals * FOOD_KG_PER_MEAL)
  const tonnes = Math.round(foodSavedKg / 1000)
  // CO₂ emissions avoided by diverting that surplus food from landfill. Each kg of
  // rescued food ≈ 1 / 1.28458781 kg of CO₂ saved (Everybody Eats' agreed factor).
  const co2Kg = Math.round(foodSavedKg / 1.28458781)

  // Editor-controlled exclusions: each entry is matched against the live portal
  // venue name as a case-insensitive regex, so a partial name survives a rename
  // (e.g. "Glen Innes" hides "Glen Innes Community"). An entry that isn't valid
  // regex falls back to a literal case-insensitive substring match, so a stray
  // character can never crash the page. Only affects the venue cards below.
  const excludeMatchers = (Array.isArray(b.excludedVenues) ? b.excludedVenues : [])
    .map((raw: any) => String(raw ?? '').trim())
    .filter(Boolean)
    .map((pattern: string) => {
      try {
        return new RegExp(pattern, 'i')
      } catch {
        const literal = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return new RegExp(literal, 'i')
      }
    })
  const visibleLocations = story.locations.filter(
    (v) => !excludeMatchers.some((re: RegExp) => re.test(v.name || '')),
  )

  // Permanent restaurants vs. pop-ups. A venue is "permanent" when its portal
  // name matches a CMS location flagged showInMainGrids, keyed the same way the
  // tonight's-menu lookup is (menuLocationName || name) so a display-name change
  // can't misclassify it. If either group is empty (e.g. only permanent venues,
  // or the flag isn't set) we fall back to one ungrouped grid.
  const permanentNames = new Set(
    cmsLocations.map((l) => (l?.menuLocationName || l?.name || '').toLowerCase()).filter(Boolean),
  )
  const permanentVenues = visibleLocations.filter((v) => permanentNames.has(v.name?.toLowerCase()))
  const popupVenues = visibleLocations.filter((v) => !permanentNames.has(v.name?.toLowerCase()))
  const groupVenues = permanentVenues.length > 0 && popupVenues.length > 0

  const vars = {
    meals: fmt(t.meals),
    firstYear: String(firstYear?.year ?? ''),
    nights: fmt(t.nights),
    range: range ? `(${range})` : '',
    perMeal: String(FOOD_KG_PER_MEAL),
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
                value: `${fmt(co2Kg)}`,
                label: b.statCo2Label,
                accent: 'text-clay-300',
              },
            ]}
          />
        </div>
      </div>

      {/* Impact stories — optional featured cards just under the header */}
      {Array.isArray(b.stories) && b.stories.length > 0 && (
        <section className="container-tight pb-16 sm:pb-20">
          <div className="space-y-5">
            {b.stories.map((s: Block, i: number) => {
              const card = (
                <article className="group grid overflow-hidden rounded-[1.75rem] border border-line/10 bg-surface-2 card-hover sm:grid-cols-[minmax(0,0.8fr)_1fr]">
                  <div className="relative aspect-[4/3] bg-surface-3 sm:aspect-auto sm:min-h-[15rem]">
                    <PayloadImage
                      media={s.image}
                      fill
                      size="card"
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-9">
                    {s.kicker && <p className="eyebrow text-clay-300">{s.kicker}</p>}
                    <h3 className="display text-2xl sm:text-3xl font-light text-content mt-3">
                      {renderRichText(s.heading)}
                    </h3>
                    {s.body && <p className="text-base text-content/75 mt-3 leading-relaxed">{s.body}</p>}
                    {s.href && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-content">
                        {s.ctaLabel || 'Read the story'}
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          &rarr;
                        </span>
                      </span>
                    )}
                  </div>
                </article>
              )
              return s.href ? (
                <Link key={i} href={s.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={i}>{card}</div>
              )
            })}
          </div>
        </section>
      )}

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

      {/* Pay-as-you-feel — the communal table */}
      {!b.hidePayTable && (
        <section className="container-tight pb-16 sm:pb-24">
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
      )}

      {/* Where we serve */}
      <section className="container-tight pb-16 sm:pb-24">
        <SectionHead kicker={b.venuesEyebrow} title={renderRichText(b.venuesHeading)}>
          {b.venuesBody}
        </SectionHead>
        {groupVenues ? (
          <div className="mt-10 space-y-10">
            <div>
              <p className="eyebrow text-clay-300 mb-5">Permanent restaurants</p>
              <VenueCards locations={permanentVenues} />
            </div>
            <div className="border-t border-line/10 pt-10">
              <p className="eyebrow text-muted/70 mb-5">Pop-ups</p>
              <VenueCards locations={popupVenues} />
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <VenueCards locations={visibleLocations} />
          </div>
        )}
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
