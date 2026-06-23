import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchImpactStory, MOCK_IMPACT_STORY, type ImpactStory } from '@/lib/impact-story'
import { CountUp } from '@/components/count-up'
import { fmt, money } from '@/components/impact/format'
import { CommunalTable } from '@/components/impact/communal-table'
import { MealsGrowth } from '@/components/impact/meals-growth'
import { VenueCards } from '@/components/impact/venue-cards'
import { MilestoneLadder } from '@/components/impact/milestone-ladder'
import { HeadlineStats } from '@/components/impact/headline-stats'
import { DiningRoomMural } from '@/components/dining-room-mural'

// Fetches the live impact story from the volunteer portal each request (with
// Next data-cache revalidation inside the fetch). Inherits force-dynamic from
// the frontend layout.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our impact',
  description:
    'Six years of pay-as-you-feel dinners, in numbers — meals served from rescued food, neighbours welcomed, and the volunteers who make every night happen.',
  alternates: { canonical: '/impact' },
}

/** "2020-06-28" → "Jun 2020". */
function monthYear(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
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

export default async function ImpactPage() {
  const story: ImpactStory = (await fetchImpactStory()) ?? MOCK_IMPACT_STORY
  const t = story.totals
  const first = monthYear(t.firstNight)
  const last = monthYear(t.lastNight)
  const range = first && last ? `${first} — ${last}` : null
  const firstYear = story.yearly[0]
  const lastFullYear =
    [...story.yearly].reverse().find((y) => !y.partial) ?? story.yearly[story.yearly.length - 1]
  const tonnes = Math.round(t.foodSavedKg / 1000)
  const guestShare = t.nonPayingPercent ?? null

  return (
    <main className="bg-surface">
      <div className="container-tight pt-16 sm:pt-24 pb-10">
        {/* Header */}
        <header className="animate-fade-up">
          <p className="eyebrow">
            Everybody Eats{range ? ` · ${fmt(t.nights)} service nights · ${range}` : ''}
          </p>
          <h1 className="display text-6xl sm:text-7xl font-light leading-[0.95] text-content mt-5">
            Everybody got <em>a seat.</em>
          </h1>
          <p className="text-lg text-content/80 mt-6 max-w-xl leading-relaxed">
            {`Six years ago we set one long table and asked people to pay what they feel. Since then, ${fmt(
              t.meals,
            )} dinners have been served from rescued food — no one turned away, everyone welcome. Here’s the story in numbers.`}
          </p>
        </header>

        <div className="mt-12">
          <HeadlineStats
            stats={[
              { value: `${fmt(t.meals)}`, label: 'meals served', accent: 'text-content' },
              { value: `${fmt(tonnes)}t`, label: 'food rescued', accent: 'text-forest-400' },
              ...(guestShare != null
                ? [{ value: `${guestShare}%`, label: 'ate as our guests', accent: 'text-clay-300' }]
                : []),
              { value: money(t.koha), label: 'given back in koha', accent: 'text-content' },
            ]}
          />
        </div>
      </div>

      {/* Pay-as-you-feel — the communal table */}
      <section className="container-tight pb-4">
        <div className="max-w-2xl mb-9">
          <p className="eyebrow flex items-center gap-3 text-clay-300">
            <span className="inline-block w-8 h-px bg-clay-300/60" />
            Pay as you feel
          </p>
          <h2 className="display text-3xl sm:text-5xl font-light text-content mt-4">
            Everyone eats. <em>However</em> much you can give.
          </h2>
          <p className="text-base text-content/80 mt-5 leading-relaxed">
            There&rsquo;s no price on the menu. Some pay it forward so the next person can eat; some
            sit down as our guests — no questions asked. Drag through the years and watch a typical
            table of 100 change: each season, more neighbours arrive who need us, and the koha left
            on each plate is stretching thinner. The welcome holds — but it&rsquo;s needed more than
            ever.
          </p>
        </div>
        {/* Pre-2020 was the pop-up era — too few, atypical nights that skew the
            pay-it-forward split — so the table starts from 2020. */}
        <CommunalTable years={story.yearly.filter((y) => y.year >= 2020)} />
      </section>

      {/* Meals growing each year */}
      <section className="container-tight py-16 sm:py-24">
        <SectionHead
          kicker="More neighbours, every year"
          title={<>A table that keeps <em>growing.</em></>}
        >
          From a single pop-up dinner to a standing welcome across three cities — the number of meals
          served has climbed year on year as more neighbours find a seat.
        </SectionHead>

        <div className="mt-10 bg-surface-2 border border-line/10 rounded-3xl p-5 sm:p-8">
          <MealsGrowth years={story.yearly} />
          <p className="text-xs text-muted/60 mt-3 px-1">
            Meals served per year. {firstYear.year} and the current year are partial (marked *).
          </p>
        </div>
      </section>

      {/* Food rescued — sun panel */}
      <section className="container-wide pb-16 sm:pb-24">
        <div className="bg-sun-200 grain rounded-[2.5rem] sm:rounded-[3rem] text-forest-700 px-7 sm:px-14 py-14 sm:py-20 relative overflow-hidden">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center max-w-6xl mx-auto">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest-700/70">
                <span className="inline-block w-8 h-px bg-forest-700/40" />
                Good food, not landfill
              </p>
              <h2 className="display text-3xl sm:text-5xl font-light mt-4">
                Every plate starts as <em>rescued</em> food.
              </h2>
              <p className="text-base text-forest-700/80 mt-5 leading-relaxed max-w-md">
                Our kitchens take surplus ingredients that would otherwise be thrown away and turn
                them into restaurant-quality meals. Good food finds a plate instead of a bin.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              <div>
                <div className="display text-6xl sm:text-7xl font-light leading-none tabular-nums">
                  <CountUp value={fmt(tonnes)} />
                  <span className="text-3xl sm:text-4xl align-top ml-1">t</span>
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-forest-700/70 mt-3">
                  of food rescued from landfill
                </div>
              </div>
              <div>
                <div className="display text-6xl sm:text-7xl font-light leading-none tabular-nums">
                  <CountUp value={fmt(t.meals)} delay={120} />
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-forest-700/70 mt-3">
                  meals cooked from that surplus
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where we serve */}
      <section className="container-tight pb-16 sm:pb-24">
        <SectionHead
          kicker="Where we serve"
          title={<>Three cities, one <em>open</em> table.</>}
        >
          From Onehunga to Wellington, every location runs the same welcome — a warm room, a good
          meal, and a seat for whoever walks in.
        </SectionHead>
        <div className="mt-10">
          {/* Just the three flagship venues — the live feed also carries small
              pop-up/one-off sites; rank by meals served and keep the top three. */}
          <VenueCards
            locations={[...story.locations].sort((a, b) => b.customers - a.customers).slice(0, 3)}
          />
        </div>
      </section>

      {/* The people */}
      <section className="container-wide pb-20 sm:pb-28">
        <div className="bg-forest-700 grain rounded-[2.5rem] sm:rounded-[3rem] [clip-path:inset(0_round_2.5rem)] sm:[clip-path:inset(0_round_3rem)] text-cream-50 px-7 sm:px-14 py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-sun-200/10 blur-3xl" aria-hidden />
          {/* The dining-room mural literally depicts the people this section is
              about — a faint cream watermark bled off the bottom-right. */}
          <DiningRoomMural className="absolute -bottom-12 -right-10 w-[34rem] sm:w-[46rem] aspect-[1280/759] text-cream-50/[0.06]" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <p className="eyebrow flex items-center gap-3 text-sun-200/90">
              <span className="inline-block w-8 h-px bg-sun-200/50" />
              The people who show up
            </p>
            <h2 className="display text-3xl sm:text-5xl font-light mt-4 max-w-2xl">
              Every plate is carried by a <em>volunteer.</em>
            </h2>

            <div className="mt-12">
              <HeadlineStats
                onDark
                stats={[
                  { value: `${fmt(t.volunteers)}`, label: 'volunteers in the door', accent: 'text-cream-50' },
                  { value: `${fmt(t.volunteerHours)}`, label: 'hours given', accent: 'text-sun-200' },
                  { value: `${fmt(t.nights)}`, label: 'nights cooked & served', accent: 'text-cream-50' },
                ]}
              />
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="max-w-sm">
                <h3 className="display text-2xl font-light">The regulars who keep coming back.</h3>
                <p className="text-sm text-cream-50/75 mt-4 leading-relaxed">
                  Most volunteers start with a single shift — and then they keep showing up. Here&rsquo;s
                  how many have served each milestone of nights.
                </p>
              </div>
              <MilestoneLadder milestones={story.milestones} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight pb-20 sm:pb-28 text-center">
        <h2 className="display text-3xl sm:text-4xl font-light text-content">
          Pull up <em>a chair.</em>
        </h2>
        <p className="text-content/75 mt-4 max-w-md mx-auto">
          Come for dinner and pay what you feel — or join the team that makes every night happen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link href="/dine-with-us" className="btn-primary">
            Find a dinner
          </Link>
          <a
            href="https://volunteers.everybodyeats.nz"
            className="btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Volunteer with us
          </a>
        </div>
      </section>

      {/* Reading notes */}
      <footer className="container-tight pb-20 border-t border-line/10 pt-8">
        <p className="text-xs text-muted/70 leading-relaxed max-w-3xl">
          Figures are drawn from Everybody Eats&rsquo; service records across {fmt(t.nights)} dinners
          {range ? ` (${range})` : ''} and refresh automatically. Food rescued is estimated at{' '}
          {t.foodSavedKgPerMeal} kg per meal served. The opening and current years are partial.
          &ldquo;Paid it forward&rdquo; and &ldquo;ate as our guests&rdquo; reflect how many diners
          chose to leave koha on a typical night — everyone is welcome either way.
        </p>
      </footer>
    </main>
  )
}
