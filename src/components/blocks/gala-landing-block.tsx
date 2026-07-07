import React from 'react'
import Image from 'next/image'
import { KawakawaPattern } from '@/components/kawakawa-pattern'
import { DiningRoomMural } from '@/components/dining-room-mural'
import { GalaCountdown } from '@/components/gala-countdown'
import { FillImage } from '@/components/media-with-fallback'
import { renderRichText } from './render-text'

// Renders the bespoke Gala landing page from CMS content. The layout is a
// faithful port of the original hardcoded page — only the copy, lists, prices
// and photos come from the block; the theatrical structure stays fixed here.
// See src/blocks/GalaLanding.ts for the editable fields.

type Block = Record<string, any>

const mailto = (email: string, subject: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`

// Static fallbacks — used when an editor hasn't uploaded a replacement image.
const IMG = {
  hero: '/images/gala/venue.jpg',
  night: '/images/gala/performers.jpg',
  table: '/images/gala/table.jpg',
  stage: '/images/gala/stage.jpg',
  volunteers: '/images/gala/volunteers.jpg',
}
const PERFORMER_FALLBACK = [
  '/images/gala/performer-hugo.jpg',
  '/images/gala/performer-slay.jpg',
  '/images/gala/performer-altra.jpg',
]
const CHEF_FALLBACK = [
  '/images/gala/chef-archana.jpg',
  '/images/gala/chef-urisha.jpg',
  '/images/gala/chef-harri.png',
]
// Brand line-art for the three "where the money goes" cards, mapped by index.
const MONEY_ILLO = [
  { src: '/images/gala/illustration-meal.png', width: 217, height: 273 },
  { src: '/images/gala/illustration-herbs.png', width: 173, height: 214 },
  { src: '/images/gala/illustration-coins-ink.png', width: 465, height: 359 },
]

const EMAIL_RE = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi

/**
 * Renders a note that may contain `*em*` markers and email addresses, turning any
 * email into a mailto link. `{galaEmail}` / `{majorGiftsEmail}` tokens are
 * substituted first so the addresses stay in one place.
 */
function renderNote(
  text: string | undefined,
  subject: string,
  linkClass: string,
  vars: Record<string, string>,
) {
  if (!text) return null
  const resolved = text.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
  return resolved.split(EMAIL_RE).map((part, i) => {
    if (EMAIL_RE.test(part)) {
      EMAIL_RE.lastIndex = 0
      return (
        <a key={i} href={mailto(part, subject)} className={linkClass}>
          {part}
        </a>
      )
    }
    return <React.Fragment key={i}>{renderRichText(part)}</React.Fragment>
  })
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.22em] font-medium ${className}`}
    >
      <span className="inline-block w-8 h-px bg-current opacity-50" />
      {children}
    </p>
  )
}

function CheckItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <li className="flex items-start gap-3">
      <svg
        className={`mt-1 h-4 w-4 flex-none ${className}`}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 10.5l4 4 8-9" />
      </svg>
      <span>{children}</span>
    </li>
  )
}

export function GalaLandingBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  const majorGiftsEmail: string = b.majorGiftsEmail || 'amy@everybodyeats.nz'
  const emailVars = { galaEmail, majorGiftsEmail }

  const nightList: { item: string }[] = b.nightList || []
  const problemStats: { figure: string; body: string }[] = b.problemStats || []
  const impactStats: { value: string; label: string }[] = b.impactStats || []
  const performers: { name: string; role: string; bio: string; image?: any }[] = b.performers || []
  const chefs: { name: string; location: string; bio: string; image?: any }[] = b.chefs || []
  const tiers: {
    eyebrow: string
    badge: string
    title: string
    price: string
    includes?: { item: string }[]
  }[] = b.tiers || []
  const tableList: { item: string }[] = b.tableList || []
  const auctionOptions: { label: string; title: string; body: string }[] = b.auctionOptions || []
  const partnership: { item: string }[] = b.partnership || []
  const quotes: { quote: string; name: string; place?: string }[] = b.quotes || []
  const moneyCards: { value: string; body: string }[] = b.moneyCards || []

  return (
    // -mb-32 cancels the SiteFooter's `mt-32` margin, which would otherwise
    // expose the cream body background as a gap between this dark page and the
    // (also dark) footer.
    <div className="bg-forest-700 text-cream-50 -mb-32">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <FillImage
          media={b.heroImage}
          fallback={IMG.hero}
          alt="The Everybody Eats Gala in full swing inside St Matthew-in-the-City, Auckland"
          priority
          sizes="100vw"
          size="hero"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-700 via-forest-700/85 to-forest-700/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-700/80 to-transparent" />

        <div className="relative container-wide pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">{b.heroEyebrow}</Eyebrow>
            <h1 className="mt-6 display text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.92]">
              {b.heroHeadingBefore}
              <span className="relative inline-block">
                <em>{b.heroHeadingHighlight}</em>
                <span
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-sun-200/90 -z-10 rounded-full"
                  aria-hidden
                />
              </span>
              {b.heroHeadingAfter}
            </h1>
            <p className="mt-7 text-lg sm:text-2xl text-cream-50/90 leading-snug font-display font-light">
              {b.heroIntro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base text-cream-50/85">
              <span className="flex items-center gap-2">
                <span className="text-sun-200">●</span> {b.heroDate}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sun-200">●</span> {b.heroLocation}
              </span>
            </div>

            <div className="mt-10">
              <GalaCountdown target={b.galaDateTime} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={mailto(galaEmail, 'Hosting a table at the Everybody Eats Gala')}
                className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 text-base px-7 py-3.5"
              >
                {b.heroPrimaryCtaLabel}
              </a>
              <a
                href="#sponsor"
                className="btn border border-cream-50/35 text-cream-50 hover:bg-cream-50 hover:text-forest-700 hover:border-cream-50"
              >
                {b.heroSecondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The night ────────────────────────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <Eyebrow className="text-sun-200">{b.nightEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.nightHeading)}
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">{b.nightBody}</p>
            <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-cream-50/90">
              {nightList.map((n) => (
                <CheckItem key={n.item} className="text-sun-200">
                  {n.item}
                </CheckItem>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <FillImage
                media={b.nightImage}
                fallback={IMG.night}
                alt="Drag performers in elaborate costume at the Everybody Eats Gala table"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem ──────────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">{b.problemEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.problemHeading)}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line/15 rounded-3xl overflow-hidden">
            {problemStats.map((p) => (
              <div key={p.figure} className="bg-surface px-7 py-9">
                <div className="display text-5xl sm:text-6xl font-light text-content tracking-tight">
                  {p.figure}
                </div>
                <p className="mt-4 text-sm text-content/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-base text-content/80 leading-relaxed">
            {b.problemFootnote}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-content/50">
            {b.problemSources}
          </p>
        </div>
      </section>

      {/* ── Who we are + impact ──────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide pb-20 sm:pb-28">
          <div className="rounded-[3rem] [clip-path:inset(0_round_3rem)] bg-forest-700 grain text-cream-50 px-8 sm:px-14 py-16 sm:py-20 relative overflow-hidden">
            <div
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl"
              aria-hidden
            />
            <DiningRoomMural className="absolute -bottom-10 -right-8 w-[32rem] sm:w-[44rem] aspect-[1280/759] text-cream-50/[0.07]" />
            <div className="relative z-10">
              <Eyebrow className="text-sun-200">{b.whoEyebrow}</Eyebrow>
              <h2 className="mt-6 display text-3xl sm:text-5xl font-light leading-tight max-w-4xl">
                {renderRichText(b.whoHeading)}
              </h2>
              <p className="mt-6 max-w-3xl text-cream-50/85 leading-relaxed">{b.whoBody}</p>
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
                {impactStats.map((s) => (
                  <div key={s.label}>
                    <div className="display text-4xl sm:text-5xl font-light text-cream-50 tabular-nums">
                      {s.value}
                    </div>
                    <div className="mt-2 text-sm uppercase tracking-[0.15em] text-cream-50/70">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the performers ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-sun-200/10 blur-3xl"
          aria-hidden
        />
        <div className="relative container-wide">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">{b.performersEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.performersHeading)}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {performers.map((p, i) => (
              <article key={p.name} className="group">
                <div className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden bg-forest-600 shadow-xl ring-1 ring-cream-50/10">
                  <FillImage
                    media={p.image}
                    fallback={PERFORMER_FALLBACK[i] ?? PERFORMER_FALLBACK[0]}
                    alt={`${p.name}, ${p.role} at the Everybody Eats Gala`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-700/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="display text-2xl font-medium">{p.name}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-sun-200 mt-1">{p.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-cream-50/75 leading-relaxed">{p.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the chefs ───────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">{b.chefsEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.chefsHeading)}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {chefs.map((c, i) => (
              <article key={c.name} className="group">
                <div className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden bg-surface-3 mb-5">
                  <FillImage
                    media={c.image}
                    fallback={CHEF_FALLBACK[i] ?? CHEF_FALLBACK[0]}
                    alt={`${c.name}, Everybody Eats chef in ${c.location}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="display text-2xl font-medium text-content">{c.name}</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-muted mt-1">{c.location}</p>
                <p className="mt-4 text-sm text-content/75 leading-relaxed">{c.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Headline the Gala (sponsorship) ──────────────────────────────── */}
      <section id="sponsor" className="scroll-mt-24 py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sun-200/10 blur-3xl"
          aria-hidden
        />
        <KawakawaPattern className="top-0 -right-10 w-72 sm:w-[28rem]" />
        <div className="relative container-wide">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">{b.sponsorEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.sponsorHeading)}
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">{b.sponsorBody}</p>
          </div>
          <div className="mt-14 grid lg:grid-cols-2 gap-6">
            {tiers.map((t) => (
              <div
                key={t.eyebrow}
                className="rounded-[2rem] bg-forest-600/60 ring-1 ring-cream-50/15 p-8 sm:p-10 flex flex-col"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cream-50/70">{t.eyebrow}</p>
                  <span className="rounded-full bg-sun-200 text-forest-700 text-[0.65rem] font-semibold uppercase tracking-[0.12em] px-3 py-1">
                    {t.badge}
                  </span>
                </div>
                <h3 className="mt-5 display text-2xl sm:text-3xl font-light leading-snug">
                  {t.title}
                </h3>
                <div className="mt-5 display text-5xl font-light text-sun-200">{t.price}</div>
                <ul className="mt-7 space-y-3 text-sm text-cream-50/85 flex-1">
                  {(t.includes || []).map((inc) => (
                    <CheckItem key={inc.item} className="text-sun-200">
                      {inc.item}
                    </CheckItem>
                  ))}
                </ul>
                <a
                  href={mailto(galaEmail, `Gala ${t.eyebrow} (${t.price})`)}
                  className="mt-8 btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 self-start"
                >
                  Enquire about this tier
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Host a table ─────────────────────────────────────────────────── */}
      <section className="container-wide pb-20 sm:pb-28">
        <div className="rounded-[3rem] overflow-hidden grid lg:grid-cols-2 bg-forest-600/50 ring-1 ring-cream-50/15">
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <Eyebrow className="text-sun-200">{b.tableEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              {renderRichText(b.tableHeading)}
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">{b.tableBody}</p>
            <ul className="mt-8 space-y-3 text-sm text-cream-50/85">
              {tableList.map((t) => (
                <CheckItem key={t.item} className="text-sun-200">
                  {t.item}
                </CheckItem>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <div className="display text-4xl font-light text-sun-200">{b.tablePrice}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-cream-50/60 mt-1">
                  {b.tablePriceLabel}
                </div>
              </div>
              <div>
                <div className="display text-4xl font-light text-cream-50">{b.seatPrice}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-cream-50/60 mt-1">
                  {b.seatPriceLabel}
                </div>
              </div>
            </div>
            <a
              href={mailto(galaEmail, 'Booking a table / seats at the Everybody Eats Gala')}
              className="mt-9 btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 self-start px-7 py-3.5"
            >
              {b.tableCtaLabel}
            </a>
          </div>
          <div className="relative min-h-[20rem] lg:min-h-full">
            <FillImage
              media={b.tableImage}
              fallback={IMG.table}
              alt="A set table at the Everybody Eats Gala with a live auction card"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Auction + in-kind ────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">{b.auctionEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.auctionHeading)}
            </h2>
            <p className="mt-6 text-lg text-content/80 leading-relaxed">{b.auctionBody}</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {auctionOptions.map((a) => (
              <div
                key={a.label}
                className="rounded-[2rem] bg-surface-2 border border-line/10 p-8 sm:p-10"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-muted/70 uppercase">
                  {a.label}
                </p>
                <h3 className="mt-4 display text-2xl sm:text-3xl font-light text-content leading-snug">
                  {a.title}
                </h3>
                <p className="mt-4 text-sm text-content/80 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>

          {/* In-kind */}
          <div className="mt-6 rounded-[2rem] [clip-path:inset(0_round_2rem)] bg-forest-700 grain text-cream-50 p-8 sm:p-12 relative overflow-hidden">
            <div
              className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-sun-200/15 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <Eyebrow className="text-sun-200">{b.inKindEyebrow}</Eyebrow>
                <h3 className="mt-5 display text-2xl sm:text-3xl font-light leading-snug">
                  {renderRichText(b.inKindHeading)}
                </h3>
                <p className="mt-4 text-cream-50/85 leading-relaxed max-w-2xl">{b.inKindBody}</p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <a
                  href={mailto(galaEmail, 'In-kind donation for the Everybody Eats Gala')}
                  className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  {b.inKindCtaLabel}
                </a>
              </div>
            </div>
            <p className="relative z-10 mt-8 text-sm text-cream-50/70 leading-relaxed border-t border-cream-50/15 pt-6">
              {renderNote(
                b.majorGiftsNote,
                'Major gift / event underwriting for the Gala',
                'text-sun-200 underline underline-offset-4 hover:text-sun-300',
                emailVars,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── What partnership gives you ───────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-sun-200">{b.partnershipEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              {renderRichText(b.partnershipHeading)}
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">{b.partnershipBody}</p>
            <p className="mt-6 text-sm text-cream-50/70 leading-relaxed">
              {renderNote(
                b.partnershipNote,
                'Gala auction item donation',
                'text-sun-200 underline underline-offset-4 hover:text-sun-300',
                emailVars,
              )}
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {partnership.map((bnf, i) => (
                <li
                  key={i}
                  className="flex items-start gap-5 rounded-2xl bg-forest-600/50 ring-1 ring-cream-50/10 p-6"
                >
                  <span className="font-mono text-sm text-sun-200/80 tabular-nums mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-cream-50/90 leading-relaxed">{bnf.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl mb-12">
            <Eyebrow className="text-muted">{b.quotesEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.quotesHeading)}
            </h2>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
            {quotes.map((q, i) => (
              <figure
                key={i}
                className="break-inside-avoid mb-6 bg-surface-2 grain rounded-[2rem] p-8 border border-line/10"
              >
                <span
                  className="display block text-6xl leading-[0.6] text-sun-300 select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="mt-4 display text-lg sm:text-xl font-light leading-snug text-content">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted/80">
                  {q.name}
                  {q.place ? ` · ${q.place}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where the money goes ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <FillImage
          media={b.moneyImage}
          fallback={IMG.stage}
          alt="The stage at St Matthew-in-the-City lit for the Everybody Eats Gala"
          sizes="100vw"
          size="hero"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-forest-700/85" />
        <div className="relative container-wide py-24 sm:py-32">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">{b.moneyEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              {renderRichText(b.moneyHeading)}
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">{b.moneyBody}</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {moneyCards.map((card, i) => {
              const illo = MONEY_ILLO[i] ?? MONEY_ILLO[0]
              const highlight = i === 2
              return (
                <div
                  key={i}
                  className={`group rounded-[2rem] p-8 ${
                    highlight
                      ? 'bg-sun-200 text-forest-700'
                      : 'bg-cream-50/10 ring-1 ring-cream-50/15'
                  }`}
                >
                  <Image
                    src={illo.src}
                    alt=""
                    aria-hidden
                    width={illo.width}
                    height={illo.height}
                    className="h-16 w-auto mb-6 object-contain object-left transition-transform duration-500 group-hover:-rotate-2"
                  />
                  <div
                    className={`display text-3xl font-light ${
                      highlight ? '' : 'text-sun-200'
                    }`}
                  >
                    {card.value}
                  </div>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      highlight ? 'text-forest-700/85' : 'text-cream-50/80'
                    }`}
                  >
                    {card.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="rounded-[3rem] overflow-hidden grid lg:grid-cols-2 bg-forest-600/50 ring-1 ring-cream-50/15">
          <div className="relative min-h-[18rem] lg:min-h-full order-last lg:order-first">
            <FillImage
              media={b.closingImage}
              fallback={IMG.volunteers}
              alt="Everybody Eats volunteers gathered inside the venue"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <Eyebrow className="text-sun-200">{b.closingEyebrow}</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              {renderRichText(b.closingHeading)}
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">{b.closingBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={mailto(galaEmail, 'The Everybody Eats Gala')}
                className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 px-7 py-3.5"
              >
                {galaEmail}
              </a>
              <a
                href="https://everybodyeats.nz"
                className="btn border border-cream-50/35 text-cream-50 hover:bg-cream-50 hover:text-forest-700 hover:border-cream-50"
              >
                {b.closingSecondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
