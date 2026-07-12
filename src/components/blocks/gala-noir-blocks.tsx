import React from 'react'
import { FillImage } from '@/components/media-with-fallback'
import { GalaCountdown } from '@/components/gala-countdown'
import { renderRichText } from './render-text'
import { Reveal } from '@/components/gala-noir/reveal'
import { StatFigure } from '@/components/gala-noir/stat-figure'
import { GalaMarquee } from '@/components/gala-noir/marquee'
import { TiltCard } from '@/components/gala-noir/tilt-card'
import { SeatCalculator } from '@/components/gala-noir/seat-calculator'
import { HeroWord } from '@/components/gala-noir/hero-word'
import './gala-noir.css'

// ─────────────────────────────────────────────────────────────────────────────
// Renderers for the gala-noir section blocks (src/blocks/GalaNoir.ts) — the
// 2026 sponsorship-kit art direction. Every section is its own block so the
// page can be reordered in the admin; each renderer therefore carries the
// `gala-noir` scope class itself so sections stack seamlessly on the noir
// ground in any order. Copy and photos come from the block; the theatrics
// (gradient letterforms, count-ups, marquees, the seat calculator) stay fixed
// here.
// ─────────────────────────────────────────────────────────────────────────────

type Block = Record<string, any>

const mailto = (email: string, subject: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`

// Static fallbacks — used when an editor hasn't uploaded a replacement image.
const IMG = {
  hero: '/images/gala/peacock.jpg',
  problem: '/images/gala/plate-bw.jpg',
  night: '/images/gala/performers.jpg',
  performersBg: '/images/gala/iridescent.jpg',
  chefsBg: '/images/gala/silk.jpg',
  table: '/images/gala/table.jpg',
  auction: '/images/gala/auction.jpg',
  quotes: '/images/gala/venue.jpg',
  closing: '/images/gala/volunteers.jpg',
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

const EMAIL_RE = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi

/**
 * Renders a note that may contain `*em*` markers and email addresses, turning
 * any email into a mailto link. `{galaEmail}` / `{majorGiftsEmail}` tokens are
 * substituted first so the addresses stay in one place.
 */
function renderNote(text: string | undefined, subject: string, vars: Record<string, string>) {
  if (!text) return null
  const resolved = text.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
  return resolved.split(EMAIL_RE).map((part, i) => {
    if (EMAIL_RE.test(part)) {
      EMAIL_RE.lastIndex = 0
      return (
        <a
          key={i}
          href={mailto(part, subject)}
          className="underline decoration-[rgba(245,238,223,0.4)] underline-offset-4 transition hover:text-[var(--ivory)]"
        >
          {part}
        </a>
      )
    }
    return <React.Fragment key={i}>{renderRichText(part)}</React.Fragment>
  })
}

// ── shared furniture ─────────────────────────────────────────────────────────

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  if (!children) return null
  return <p className={`gn-label gn-label--magenta mb-4 ${className}`}>{children}</p>
}

function Heading({
  text,
  as: Tag = 'h2',
  className = '',
}: {
  text?: string
  as?: 'h2' | 'h3'
  className?: string
}) {
  if (!text) return null
  return (
    <Tag className={`gn-display text-[clamp(2.4rem,5.6vw,4.3rem)] leading-[1.04] ${className}`}>
      {renderRichText(text)}
    </Tag>
  )
}

function CheckIcon() {
  return (
    <svg
      className="mt-1 h-4 w-4 flex-none text-[var(--grad-gold)]"
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
  )
}

function MailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

/** Full-bleed background photo with a top+bottom fade into the noir ground. */
function SectionBackdrop({
  media,
  fallback,
  opacity,
  position,
}: {
  media?: any
  fallback: string
  opacity: string
  position?: string
}) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <FillImage
        media={media}
        fallback={fallback}
        alt=""
        sizes="100vw"
        size="hero"
        className={`object-cover ${opacity} ${position ?? ''}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--noir)] via-transparent to-[var(--noir)]" />
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

export function GalaNoirHeroBlock({
  block,
  pageBlockTypes,
}: {
  block: Block
  pageBlockTypes?: Set<string>
}) {
  const b = block
  const word: string = (b.word || 'GALA').trim()
  const ribbon: { item: string }[] = b.ribbon || []
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'

  // The CTAs scroll to the Tiers (#sponsor) and Table (#table) sections, which
  // are independently droppable blocks. When a target section isn't on the
  // page, fall back to a mailto so the button never becomes a dead anchor.
  // Without page context (pageBlockTypes undefined) keep the anchors — the
  // seeded page ships with both sections.
  const primaryHref =
    !pageBlockTypes || pageBlockTypes.has('galaNoirTiers')
      ? '#sponsor'
      : mailto(galaEmail, 'Sponsorship — Everybody Eats Gala')
  const secondaryHref =
    !pageBlockTypes || pageBlockTypes.has('galaNoirTable')
      ? '#table'
      : mailto(galaEmail, 'Host a table — Everybody Eats Gala')

  return (
    <div className="gala-noir">
      <header className="gn-grain relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="absolute inset-0">
          <FillImage
            media={b.image}
            fallback={IMG.hero}
            alt="Iridescent peacock feathers in deep teal, blue and gold"
            priority
            sizes="100vw"
            size="hero"
            className="gn-hero-photo object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_35%,rgba(11,9,16,0.55)_78%,rgba(11,9,16,0.92)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--noir)] to-transparent" />
        </div>

        {/* Top kicker row — mirrors the deck's cover furniture */}
        <div className="relative z-10 flex items-start justify-between gap-4 px-6 pt-7 sm:px-10">
          <p className="gn-label gn-hero-kicker">{b.eyebrow}</p>
          {b.kitLine ? (
            <p className="gn-italic gn-hero-kicker hidden text-lg sm:block">
              {renderRichText(b.kitLine)}
            </p>
          ) : null}
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <HeroBody b={b} word={word} primaryHref={primaryHref} secondaryHref={secondaryHref} />
        </div>
      </header>

      {ribbon.length > 0 && (
        <div className="border-y border-[rgba(245,238,223,0.14)] bg-[var(--magenta-deep)] py-3 text-white">
          <GalaMarquee speed="36s">
            {ribbon.map(({ item }) => (
              <span
                key={item}
                className="flex items-center gap-6 pr-6 text-[0.8rem] font-semibold uppercase tracking-[0.2em]"
              >
                {item}
                <span aria-hidden="true" className="text-base normal-case tracking-normal">
                  ✦
                </span>
              </span>
            ))}
          </GalaMarquee>
        </div>
      )}
    </div>
  )
}

// Client HeroWord carries the pointer-parallax letters; script line above,
// intro + countdown + CTAs below.
function HeroBody({
  b,
  word,
  primaryHref,
  secondaryHref,
}: {
  b: Block
  word: string
  primaryHref: string
  secondaryHref: string
}) {
  const ariaLabel = [b.scriptLine, word].filter(Boolean).join(' ')
  return (
    <HeroWord
      word={word}
      ariaLabel={ariaLabel}
      above={
        b.scriptLine ? (
          <p className="gn-italic gn-hero-kicker mb-2 text-xl text-[var(--ivory)] sm:text-2xl">
            {b.scriptLine}
          </p>
        ) : null
      }
      below={
        <>
          {b.intro ? (
            <p className="gn-hero-kicker mt-6 max-w-xl text-center text-base leading-relaxed text-[rgba(245,238,223,0.85)] sm:text-lg">
              {b.intro}
            </p>
          ) : null}
          {b.showCountdown ? (
            <div className="mt-8">
              <GalaCountdown target={b.galaDateTime} />
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {b.primaryCtaLabel ? (
              <a href={primaryHref} className="gn-btn gn-btn--gradient">
                {b.primaryCtaLabel}
              </a>
            ) : null}
            {b.secondaryCtaLabel ? (
              <a href={secondaryHref} className="gn-btn gn-btn--ghost">
                {b.secondaryCtaLabel}
              </a>
            ) : null}
          </div>
          <svg
            className="gn-scrollcue mt-10 h-5 w-5 text-[rgba(245,238,223,0.7)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
          </svg>
        </>
      }
    />
  )
}

// ── The problem ──────────────────────────────────────────────────────────────

export function GalaNoirProblemBlock({ block }: { block: Block }) {
  const b = block
  const stats: { figure: string; body: string }[] = b.stats || []
  return (
    <div className="gala-noir">
      <section className="gn-section gn-grain overflow-hidden">
        <SectionBackdrop media={b.image} fallback={IMG.problem} opacity="opacity-[0.16]" />
        <div className="gn-container relative">
          <Reveal>
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <Heading text={b.heading} />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="gn-stat-figure">
                  <StatFigure value={stat.figure} />
                </p>
                <hr className="gn-rule my-4 w-12" />
                <p className="gn-body">{stat.body}</p>
              </Reveal>
            ))}
          </div>
          {b.pullQuote ? (
            <Reveal className="mt-20">
              <blockquote className="gn-display mx-auto max-w-3xl text-center text-[clamp(1.4rem,3vw,2.1rem)] leading-snug [&_em]:text-[var(--magenta-bright)]">
                {renderRichText(b.pullQuote)}
              </blockquote>
            </Reveal>
          ) : null}
          {b.sources ? (
            <p className="mt-8 text-center text-xs text-[var(--ivory-faint)]">{b.sources}</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}

// ── About Everybody Eats (magenta) ───────────────────────────────────────────

export function GalaNoirAboutBlock({ block }: { block: Block }) {
  const b = block
  const impactStats: { value: string; label: string }[] = b.impactStats || []
  return (
    <div className="gala-noir">
      <section className="gn-section gn-grain overflow-hidden bg-[var(--magenta-deep)] text-white">
        <div className="gn-container relative">
          <Reveal>
            <Heading text={b.heading} />
            {b.tagline ? (
              <p className="gn-italic mt-4 text-xl text-white/85">{b.tagline}</p>
            ) : null}
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <Reveal delay={0.05}>
              <p className="text-base leading-relaxed text-white/90">{b.bodyLeft}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-base leading-relaxed text-white/90">{b.bodyRight}</p>
              {b.linkLabel && b.linkUrl ? (
                <a
                  href={b.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                >
                  {b.linkLabel}
                  <ArrowUpRightIcon />
                </a>
              ) : null}
            </Reveal>
          </div>
          {impactStats.length > 0 && (
            <div className="mt-16 grid gap-10 border-t border-white/25 pt-12 sm:grid-cols-3">
              {impactStats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.1}>
                  <p className="gn-impact-figure">
                    <StatFigure value={stat.value} />
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                    {stat.label}
                  </p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ── The night ────────────────────────────────────────────────────────────────

export function GalaNoirNightBlock({ block }: { block: Block }) {
  const b = block
  const features: { item: string }[] = b.features || []
  return (
    <div className="gala-noir">
      <section className="gn-section">
        <div className="gn-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <FillImage
                  media={b.image}
                  fallback={IMG.night}
                  alt="Drag performers in full glamour at a gala dinner table"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  size="feature"
                  className="object-cover"
                />
              </div>
              {b.imageCaption ? (
                <p className="mt-3 text-xs text-[var(--ivory-faint)]">{b.imageCaption}</p>
              ) : null}
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <Heading text={b.heading} />
                {b.body ? <p className="gn-body mt-6 max-w-xl text-base">{b.body}</p> : null}
              </Reveal>
              {features.length > 0 && (
                <Reveal delay={0.1} className="mt-8">
                  <ul>
                    {features.map(({ item }) => (
                      <li key={item} className="gn-feature-line">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              {b.dresscode ? (
                <Reveal delay={0.15} className="mt-8">
                  <p className="text-sm text-[var(--ivory-dim)]">
                    <span className="font-semibold text-[var(--magenta-bright)]">Dresscode:</span>{' '}
                    {b.dresscode}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Performers ───────────────────────────────────────────────────────────────

export function GalaNoirPerformersBlock({ block }: { block: Block }) {
  const b = block
  const performers: { name: string; role: string; bio: string; image?: any }[] = b.performers || []
  return (
    <div className="gala-noir">
      <section className="gn-section gn-grain overflow-hidden">
        <SectionBackdrop media={b.image} fallback={IMG.performersBg} opacity="opacity-40" />
        <div className="gn-container relative">
          <Reveal className="text-center">
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <Heading text={b.heading} />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {performers.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <TiltCard>
                  <div className="relative aspect-[2/3]">
                    <FillImage
                      media={p.image}
                      fallback={PERFORMER_FALLBACK[i % PERFORMER_FALLBACK.length]}
                      alt={`${p.name} — ${p.role}`}
                      sizes="(min-width: 768px) 30vw, 100vw"
                      size="card"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(11,9,16,0.92)] to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="gn-display text-2xl tracking-wide">{p.name}</h3>
                      <p className="gn-label gn-label--magenta mt-1">{p.role}</p>
                    </div>
                  </div>
                </TiltCard>
                <p className="gn-body mt-4 text-sm">{p.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Chefs ────────────────────────────────────────────────────────────────────

export function GalaNoirChefsBlock({ block }: { block: Block }) {
  const b = block
  const chefs: { name: string; role: string; bio: string; image?: any }[] = b.chefs || []
  return (
    <div className="gala-noir">
      <section className="gn-section gn-grain overflow-hidden">
        <SectionBackdrop media={b.image} fallback={IMG.chefsBg} opacity="opacity-55" />
        <div className="gn-container relative">
          <Reveal className="text-center">
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <Heading text={b.heading} />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {chefs.map((chef, i) => (
              <Reveal key={chef.name} delay={i * 0.1} className="gn-chef-card">
                <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                  <FillImage
                    media={chef.image}
                    fallback={CHEF_FALLBACK[i % CHEF_FALLBACK.length]}
                    alt={`${chef.name} — ${chef.role}`}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    size="card"
                    className="gn-chef-photo object-cover"
                  />
                </div>
                <h3 className="gn-display mt-5 text-2xl">{chef.name}</h3>
                <p className="gn-label gn-label--magenta mt-1">{chef.role}</p>
                <p className="gn-body mt-3 text-sm">{chef.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Why fundraise + seat calculator ──────────────────────────────────────────

export function GalaNoirCalculatorBlock({ block }: { block: Block }) {
  const b = block
  return (
    <div className="gala-noir">
      <section className="gn-section">
        <div className="gn-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <Eyebrow>{b.eyebrow}</Eyebrow>
              <Heading text={b.heading} />
            </Reveal>
            <Reveal delay={0.08}>
              {b.body ? (
                <p className="gn-body max-w-xl text-base [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--ivory)]">
                  {renderRichText(b.body)}
                </p>
              ) : null}
            </Reveal>
          </div>
          <Reveal className="mt-16 rounded-lg border border-[rgba(245,238,223,0.14)] bg-[var(--noir-raised)] p-6 sm:p-10">
            <SeatCalculator
              roomSeats={b.roomSeats || 200}
              seatPrice={b.seatPrice || 330}
              tablePrice={b.tablePrice || 3000}
              annualCost={b.annualCost || 300_000}
              roomLabel={b.roomLabel}
              sliderLabel={b.sliderLabel}
              footnote={b.footnote}
            />
          </Reveal>
        </div>
      </section>
    </div>
  )
}

// ── Sponsorship tiers ────────────────────────────────────────────────────────

export function GalaNoirTiersBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  const tiers: {
    tier: string
    badge: string
    title: string
    price: string
    featured?: boolean
    perks?: { item: string }[]
  }[] = b.tiers || []

  return (
    <div className="gala-noir">
      <section id="sponsor" className="gn-section gn-grain overflow-hidden">
        <SectionBackdrop
          media={undefined}
          fallback={IMG.chefsBg}
          opacity="opacity-45"
          position="object-bottom"
        />
        <div className="gn-container relative">
          <Reveal className="text-center">
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <Heading text={b.heading} />
            {b.body ? <p className="gn-body mx-auto mt-5 max-w-xl">{b.body}</p> : null}
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.tier} delay={i * 0.1} className="h-full">
                <article className={`gn-tier h-full ${tier.featured ? 'gn-tier--gold' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`gn-italic text-3xl ${
                        tier.featured ? 'gn-gradient-text' : 'text-[var(--magenta-bright)]'
                      }`}
                    >
                      {tier.tier}
                    </h3>
                    <span className="gn-scarcity">{tier.badge}</span>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ivory)]">
                    {tier.title}
                  </p>
                  <p className="gn-tier-price">{tier.price}</p>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {(tier.perks || []).map(({ item }) => (
                      <li key={item} className="flex gap-2.5 text-sm text-[var(--ivory-dim)]">
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={mailto(
                      galaEmail,
                      `${tier.tier} sponsorship — Everybody Eats Gala`,
                    )}
                    className={`gn-btn ${tier.featured ? 'gn-btn--gradient' : 'gn-btn--ghost'}`}
                  >
                    <MailIcon />
                    Enquire about {tier.tier}
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Host a table ─────────────────────────────────────────────────────────────

export function GalaNoirTableBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  const includes: { item: string }[] = b.includes || []
  return (
    <div className="gala-noir">
      <section id="table" className="gn-section">
        <div className="gn-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <Heading text={b.heading} />
              </Reveal>
              {includes.length > 0 && (
                <Reveal delay={0.08} className="mt-8">
                  <ul>
                    {includes.map(({ item }) => (
                      <li key={item} className="gn-feature-line">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              <Reveal delay={0.14} className="mt-8">
                <p className="gn-display text-3xl">
                  <span className="text-[var(--magenta-bright)]">{b.price}</span>
                  {b.priceLabel ? (
                    <span className="gn-body ml-3 text-sm">{b.priceLabel}</span>
                  ) : null}
                </p>
                {b.seatNote ? <p className="gn-body mt-2 text-sm">{b.seatNote}</p> : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  {b.ctaLabel ? (
                    <a
                      href={mailto(galaEmail, 'Host a table — Everybody Eats Gala')}
                      className="gn-btn gn-btn--primary"
                    >
                      <MailIcon />
                      {b.ctaLabel}
                    </a>
                  ) : null}
                  {b.secondaryCtaLabel ? (
                    <a
                      href={mailto(galaEmail, 'Individual tickets — Everybody Eats Gala')}
                      className="gn-btn gn-btn--ghost"
                    >
                      <MailIcon />
                      {b.secondaryCtaLabel}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <FillImage
                  media={b.image}
                  fallback={IMG.table}
                  alt="A gala place setting with an Everybody Eats auction programme"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  size="feature"
                  className="object-cover"
                />
              </div>
              {b.imageCaption ? (
                <p className="mt-3 text-xs text-[var(--ivory-faint)]">{b.imageCaption}</p>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Auction ──────────────────────────────────────────────────────────────────

export function GalaNoirAuctionBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  const options: { label: string; title: string; body: string }[] = b.options || []
  return (
    <div className="gala-noir">
      <section id="auction" className="gn-section gn-grain overflow-hidden">
        <SectionBackdrop media={undefined} fallback={IMG.chefsBg} opacity="opacity-45" />
        <div className="gn-container relative">
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <Heading text={b.heading} />
                {b.body ? <p className="gn-body mt-6 max-w-xl">{b.body}</p> : null}
              </Reveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {options.map((option, i) => (
                  <Reveal key={option.title} delay={0.08 + i * 0.06}>
                    <div className="h-full rounded-md border border-[rgba(245,238,223,0.14)] p-6">
                      <p className="gn-label gn-label--magenta">{option.label}</p>
                      <h3 className="gn-display mt-2 text-2xl">{option.title}</h3>
                      <p className="gn-body mt-3 text-sm">{option.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              {b.note ? (
                <Reveal delay={0.18} className="mt-8">
                  <p className="rounded-md border border-[rgba(243,206,111,0.35)] bg-[rgba(243,206,111,0.07)] p-4 text-sm text-[var(--ivory-dim)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--grad-gold)]">
                    {renderNote(b.note, 'Auction item donation', { galaEmail })}
                  </p>
                </Reveal>
              ) : null}
            </div>
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <FillImage
                  media={b.image}
                  fallback={IMG.auction}
                  alt="An auctioneer reading lots from the stage"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  size="feature"
                  className="object-cover"
                />
              </div>
              {b.imageCaption ? (
                <p className="mt-3 text-xs text-[var(--ivory-faint)]">{b.imageCaption}</p>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── In-kind donations ────────────────────────────────────────────────────────

export function GalaNoirInKindBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  const majorGiftsEmail: string = b.majorGiftsEmail || 'amy@everybodyeats.nz'
  const benefits: { item: string }[] = b.benefits || []
  return (
    <div className="gala-noir">
      <section className="gn-section">
        <div className="gn-container">
          <Reveal>
            <Heading text={b.heading} className="!text-[clamp(1.9rem,4vw,3rem)]" as="h3" />
            {b.body ? <p className="gn-body mt-5 max-w-2xl">{b.body}</p> : null}
          </Reveal>
          {benefits.length > 0 && (
            <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-[rgba(245,238,223,0.14)] bg-[rgba(245,238,223,0.14)] sm:grid-cols-2 lg:grid-cols-5">
              {benefits.map((benefit, i) => (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <div className="h-full bg-[var(--noir)] p-5">
                    <span className="gn-display text-xl text-[var(--magenta-bright)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="gn-body mt-3 text-sm">{benefit.item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          {b.note ? (
            <Reveal className="mt-8">
              <p className="gn-body text-sm">
                {renderNote(b.note, 'Everybody Eats Gala — giving directly', {
                  galaEmail,
                  majorGiftsEmail,
                })}
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>
    </div>
  )
}

// ── Testimonials (duotone) ───────────────────────────────────────────────────

export function GalaNoirQuotesBlock({ block }: { block: Block }) {
  const b = block
  const quotes: { quote: string; name: string; place?: string }[] = b.quotes || []
  const mid = Math.ceil(quotes.length / 2)
  const rows = [quotes.slice(0, mid), quotes.slice(mid)].filter((row) => row.length > 0)

  return (
    <div className="gala-noir">
      <section className="relative overflow-hidden">
        <div className="gn-duotone absolute inset-0" aria-hidden="true">
          <FillImage
            media={b.image}
            fallback={IMG.quotes}
            alt=""
            sizes="100vw"
            size="hero"
            className="object-cover"
          />
        </div>
        <div className="relative py-24 sm:py-32">
          <Reveal className="gn-container text-center text-white">
            {b.eyebrow ? <p className="gn-label mb-4 !text-white/80">{b.eyebrow}</p> : null}
            {b.capsTitle ? (
              <h2 className="gn-display mx-auto max-w-4xl text-[clamp(2.8rem,7vw,6rem)] uppercase leading-[0.95] tracking-[0.04em]">
                {b.capsTitle}
              </h2>
            ) : null}
          </Reveal>
          <div className="mt-16 space-y-4">
            {rows.map((row, r) => (
              <GalaMarquee key={r} speed={r % 2 ? '46s' : '52s'} reverse={r % 2 === 1}>
                {row.map((q) => (
                  <figure key={q.name} className="gn-quote-card mr-4">
                    <blockquote className="text-sm leading-relaxed text-[var(--ivory)]">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>
                    <figcaption className="gn-label gn-label--magenta mt-4">
                      {[q.name, q.place].filter(Boolean).join(', ')}
                    </figcaption>
                  </figure>
                ))}
              </GalaMarquee>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Closing call to action ───────────────────────────────────────────────────

export function GalaNoirClosingBlock({ block }: { block: Block }) {
  const b = block
  const galaEmail: string = b.galaEmail || 'gala@everybodyeats.nz'
  return (
    // -mb-32 cancels the SiteFooter's `mt-32` margin, which would otherwise
    // expose the cream body background as a gap between this dark page and the
    // (also dark) footer.
    <div className="gala-noir -mb-32">
      <section id="contact" className="gn-section gn-grain overflow-hidden !pb-0">
        <div className="gn-container">
          <Reveal className="text-center">
            <Heading text={b.heading} />
            {b.body ? (
              <p className="gn-body mx-auto mt-6 max-w-md text-base">{b.body}</p>
            ) : null}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={mailto(galaEmail, 'Everybody Eats Gala')}
                className="gn-btn gn-btn--gradient !min-h-12 !px-8 !text-base"
              >
                <MailIcon className="h-5 w-5" />
                {galaEmail}
              </a>
              {b.secondaryCtaLabel && b.secondaryCtaUrl ? (
                <a
                  href={b.secondaryCtaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="gn-btn gn-btn--ghost !min-h-12 !px-8 !text-base"
                >
                  {b.secondaryCtaLabel}
                  <ArrowUpRightIcon />
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
        <Reveal className="relative mt-16" y={0}>
          <div className="relative h-[52vh] min-h-80">
            <FillImage
              media={b.image}
              fallback={IMG.closing}
              alt="Everybody Eats volunteers gathered at the gala"
              sizes="100vw"
              size="hero"
              className="object-cover object-[center_62%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--noir)] via-transparent to-[rgba(11,9,16,0.7)]" />
          </div>
        </Reveal>
        {/* sunset strip — the deck's closing gradient */}
        <footer className="bg-[linear-gradient(100deg,#c9b7e6,#f2b8c6_30%,#f8ce9a_65%,#f3ce6f)] py-5 text-[#33203a]">
          <div className="gn-container flex flex-col items-center justify-between gap-2 text-center text-xs font-semibold sm:flex-row sm:text-left">
            {b.footerLeft ? <p>{b.footerLeft}</p> : null}
            {b.footerRight ? <p>{b.footerRight}</p> : null}
          </div>
        </footer>
      </section>
    </div>
  )
}
