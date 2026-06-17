'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { colors, fontSize, borderRadius } from '@/styles/brand-tokens'

/* -------------------------------------------------------------------------- */
/*  Colour maths — used by swatch labels and the live contrast checker.       */
/* -------------------------------------------------------------------------- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  )
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function relativeLuminance(hex: string): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** Pick legible text (cream or forest) to sit on a given background hex. */
function readableOn(hex: string): string {
  return relativeLuminance(hex) > 0.45 ? '#0E2A1C' : '#FDF8EF'
}

/* -------------------------------------------------------------------------- */
/*  Token data, derived from the shared brand-tokens module.                  */
/* -------------------------------------------------------------------------- */

const FAMILIES: Array<{ key: 'cream' | 'forest' | 'sun' | 'clay'; name: string; note: string }> = [
  { key: 'cream', name: 'Cream', note: 'Paper backgrounds. cream-50 is the page default.' },
  {
    key: 'forest',
    name: 'Forest',
    note: 'Brand primary. forest-500 is the action colour, forest-700 the dark panel & body text.',
  },
  { key: 'sun', name: 'Sun', note: 'Accent only — buttons, highlights, CTA panels. sun-200 is the workhorse.' },
  { key: 'clay', name: 'Clay', note: 'Tertiary accent for warmth — use sparingly.' },
]

type Swatch = { token: string; hex: string }

const palette: Array<{ key: string; name: string; note: string; swatches: Swatch[] }> = FAMILIES.map(
  (f) => ({
    ...f,
    swatches: Object.entries(colors[f.key] as Record<string, string>).map(([shade, hex]) => ({
      token: `${f.key}-${shade}`,
      hex,
    })),
  }),
)

const allSwatches: Swatch[] = [
  ...palette.flatMap((g) => g.swatches),
  { token: 'ink', hex: colors.ink as string },
]

const SEMANTIC: Array<{ varName: string; cls: string; role: string; lightHex: string; darkHex: string }> = [
  { varName: '--surface', cls: 'bg-surface', role: 'Page background', lightHex: '#FDF8EF', darkHex: '#0C1410' },
  { varName: '--surface-2', cls: 'bg-surface-2', role: 'Elevated cards / panels', lightHex: '#FAF2E4', darkHex: '#121C16' },
  { varName: '--surface-3', cls: 'bg-surface-3', role: 'Insets / dividers', lightHex: '#F5E9D2', darkHex: '#1A261F' },
  { varName: '--content', cls: 'text-content', role: 'Primary text', lightHex: '#0E2A1C', darkHex: '#F3EDE0' },
  { varName: '--muted', cls: 'text-muted', role: 'Secondary text', lightHex: '#1D5337', darkHex: '#A8C0AD' },
  { varName: '--line', cls: 'border-line', role: 'Borders (low opacity)', lightHex: '#1D5337', darkHex: '#C8D6C4' },
]

const DISPLAY_SIZES: Array<{ key: string; note: string }> = [
  { key: '8xl', note: 'hero — rarely' },
  { key: '7xl', note: 'hero default' },
  { key: '6xl', note: 'section heading' },
  { key: '5xl', note: 'sub-hero' },
  { key: '4xl', note: 'card title' },
  { key: '3xl', note: 'minor heading' },
  { key: '2xl', note: 'eyebrow heading' },
]

const BODY_SIZES: Array<{ key: string; note: string }> = [
  { key: 'xl', note: 'lead paragraph' },
  { key: 'lg', note: 'subheading' },
  { key: 'base', note: 'body' },
  { key: 'sm', note: 'meta' },
  { key: 'xs', note: 'fine print' },
]

const RADII: Array<{ label: string; cls: string; value: string }> = [
  { label: 'lg', cls: 'rounded-lg', value: '0.5rem' },
  { label: '2xl', cls: 'rounded-2xl', value: '1rem' },
  { label: '3xl', cls: 'rounded-3xl', value: '1.5rem' },
  { label: '4xl', cls: 'rounded-4xl', value: borderRadius['4xl'] },
  { label: '[3rem]', cls: 'rounded-[3rem]', value: '3rem' },
  { label: 'pill', cls: 'rounded-pill', value: borderRadius.pill },
]

const SECTIONS = [
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'components', label: 'Components' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'shape', label: 'Shape & shadow' },
  { id: 'motion', label: 'Motion & texture' },
]

/* -------------------------------------------------------------------------- */
/*  Copy-to-clipboard primitive.                                              */
/* -------------------------------------------------------------------------- */

function CopyChip({
  value,
  children,
  tone = 'light',
  className = '',
}: {
  value: string
  children?: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function copy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1100)
    })
  }

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), [])

  const base =
    tone === 'dark'
      ? 'text-sun-200 bg-cream-50/10 hover:bg-cream-50/20'
      : 'text-content bg-forest-500/8 hover:bg-forest-500/16'

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${value}`}
      className={`group/copy inline-flex items-center gap-1.5 font-mono text-[0.72rem] leading-none px-2 py-1 rounded-md transition-colors duration-150 ${base} ${className}`}
    >
      <span>{children ?? value}</span>
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-40 group-hover/copy:opacity-80 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  )
}

/* Convenience: inline code that is NOT clickable (for prose). */
function Code({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <code
      className={`font-mono text-[0.72rem] px-1.5 py-0.5 rounded ${
        tone === 'dark' ? 'text-sun-200 bg-cream-50/10' : 'text-content bg-forest-500/8'
      }`}
    >
      {children}
    </code>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section wrapper.                                                          */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 py-16 sm:py-20 border-t border-line/10">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display text-4xl sm:text-5xl font-light text-content">{title}</h2>
        {intro && <p className="mt-4 text-base text-content/75 leading-relaxed">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Live contrast checker.                                                    */
/* -------------------------------------------------------------------------- */

function ContrastChecker() {
  const [fg, setFg] = useState('forest-700')
  const [bg, setBg] = useState('cream-50')

  const fgHex = allSwatches.find((s) => s.token === fg)?.hex ?? '#0E2A1C'
  const bgHex = allSwatches.find((s) => s.token === bg)?.hex ?? '#FDF8EF'
  const ratio = contrastRatio(fgHex, bgHex)

  const checks = [
    { label: 'AA body', min: 4.5 },
    { label: 'AA large', min: 3 },
    { label: 'AAA body', min: 7 },
  ]

  return (
    <div className="rounded-3xl bg-surface-2 border border-line/10 overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Live preview */}
        <div
          className="p-8 sm:p-10 flex flex-col justify-center min-h-[14rem]"
          style={{ backgroundColor: bgHex, color: fgHex }}
        >
          <p className="font-mono text-[0.7rem] tracking-wider mb-3 opacity-80">
            {fg} on {bg}
          </p>
          <p className="display text-3xl sm:text-4xl font-light leading-tight">
            Everybody <em>eats</em>.
          </p>
          <p className="mt-3 text-sm leading-relaxed opacity-90 max-w-xs">
            Restaurant-quality meals from rescued ingredients, pay-as-you-feel.
          </p>
        </div>

        {/* Controls + verdict */}
        <div className="p-8 sm:p-10">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="eyebrow block mb-2">Foreground</span>
              <select
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-full rounded-xl border border-line/20 bg-surface px-3 py-2 text-sm font-mono text-content focus:outline-none focus:ring-2 focus:ring-sun-300"
              >
                {allSwatches.map((s) => (
                  <option key={s.token} value={s.token}>
                    {s.token}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow block mb-2">Background</span>
              <select
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-full rounded-xl border border-line/20 bg-surface px-3 py-2 text-sm font-mono text-content focus:outline-none focus:ring-2 focus:ring-sun-300"
              >
                {allSwatches.map((s) => (
                  <option key={s.token} value={s.token}>
                    {s.token}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="display text-5xl font-light text-content tabular-nums">
              {ratio.toFixed(2)}
            </span>
            <span className="text-sm text-content/60">: 1</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {checks.map((c) => {
              const pass = ratio >= c.min
              return (
                <span
                  key={c.label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    pass ? 'bg-forest-500/12 text-content' : 'bg-clay-300/15 text-content/55'
                  }`}
                >
                  <span aria-hidden>{pass ? '✓' : '✕'}</span>
                  {c.label}
                </span>
              )
            })}
          </div>
          <p className="mt-5 text-xs text-content/60 leading-relaxed">
            WCAG 2.1 ratio, computed live from the tokens. Aim for AA body (4.5:1) on anything
            people read.
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Type playground.                                                          */
/* -------------------------------------------------------------------------- */

function TypePlayground() {
  const [text, setText] = useState('Everybody eats')
  const [sizeKey, setSizeKey] = useState('6xl')
  const [light, setLight] = useState(true)
  const [italicLast, setItalicLast] = useState(true)

  const [size, leading] = (fontSize[sizeKey] as [string, { lineHeight: string; letterSpacing?: string }]) ?? [
    '3rem',
    { lineHeight: '1' },
  ]

  const words = text.trim().split(/\s+/)
  const last = words.pop() ?? ''

  return (
    <div className="rounded-3xl bg-surface-2 border border-line/10 p-6 sm:p-8">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 mb-6">
        <label className="flex-1 min-w-[16rem]">
          <span className="eyebrow block mb-2">Sample text</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-line/20 bg-surface px-4 py-2.5 text-sm text-content focus:outline-none focus:ring-2 focus:ring-sun-300"
          />
        </label>
        <div className="flex items-center gap-1 rounded-full bg-surface p-1 border border-line/15">
          <button
            type="button"
            onClick={() => setLight(true)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${light ? 'bg-forest-500 text-cream-50' : 'text-content/70'}`}
          >
            font-light
          </button>
          <button
            type="button"
            onClick={() => setLight(false)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${!light ? 'bg-forest-500 text-cream-50' : 'text-content/70'}`}
          >
            regular
          </button>
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-medium text-content/80 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={italicLast}
            onChange={(e) => setItalicLast(e.target.checked)}
            className="h-4 w-4 rounded accent-forest-500"
          />
          italic last word
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {DISPLAY_SIZES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSizeKey(s.key)}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
              sizeKey === s.key
                ? 'bg-content text-surface'
                : 'bg-forest-500/8 text-content/70 hover:bg-forest-500/16'
            }`}
          >
            {s.key}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface border border-line/10 p-6 sm:p-10 overflow-hidden">
        <p
          className="display text-content break-words"
          style={{
            fontSize: size,
            lineHeight: leading.lineHeight,
            letterSpacing: leading.letterSpacing,
            fontWeight: light ? 300 : 400,
          }}
        >
          {words.length > 0 && <>{words.join(' ')} </>}
          {italicLast ? <em>{last}</em> : last}
        </p>
      </div>
      <p className="mt-4 text-xs text-content/60">
        Rendering <Code>text-{sizeKey}</Code> · {size} / {leading.lineHeight} — pulled straight from{' '}
        <Code>brand-tokens.ts</Code>.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Theme preview segmented control + scroll-spy nav.                         */
/* -------------------------------------------------------------------------- */

function ThemeSegmented() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    setMounted(true)
  }, [])

  function set(next: boolean) {
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* private mode */
    }
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface-2 p-1 border border-line/15">
      <button
        type="button"
        onClick={() => set(false)}
        aria-pressed={mounted ? !dark : undefined}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${mounted && !dark ? 'bg-forest-500 text-cream-50' : 'text-content/70 hover:text-content'}`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => set(true)}
        aria-pressed={mounted ? dark : undefined}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${mounted && dark ? 'bg-forest-500 text-cream-50' : 'text-content/70 hover:text-content'}`}
      >
        Dark
      </button>
    </div>
  )
}

function SideNav({ active }: { active: string }) {
  return (
    <nav aria-label="Sections" className="hidden lg:block">
      <div className="sticky top-28 space-y-1">
        <p className="eyebrow mb-3 pl-3">On this page</p>
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              active === s.id
                ? 'bg-forest-500/10 text-content font-medium'
                : 'text-content/55 hover:text-content hover:bg-forest-500/5'
            }`}
          >
            <span className="font-mono text-[0.65rem] opacity-60">{String(i + 1).padStart(2, '0')}</span>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page.                                                                     */
/* -------------------------------------------------------------------------- */

export function StyleGuide() {
  const [active, setActive] = useState(SECTIONS[0].id)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const filteredPalette = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return palette
    return palette
      .map((g) => ({ ...g, swatches: g.swatches.filter((s) => s.token.includes(q) || s.hex.toLowerCase().includes(q)) }))
      .filter((g) => g.swatches.length > 0)
  }, [query])

  return (
    <>
      {/* Header */}
      <header className="container-wide pt-14 sm:pt-20 pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-forest-500/50" />
              Internal — living design system
            </p>
            <h1 className="display text-5xl sm:text-7xl font-light leading-[0.95] text-content">
              The <em>style</em> guide.
            </h1>
            <p className="mt-6 text-lg max-w-xl text-content/80 leading-relaxed">
              A live, interactive reference for the Everybody Eats marketing site. Every token here is
              read from <Code>src/styles/brand-tokens.ts</Code> — the same module Tailwind compiles —
              so it can never drift from production. Click any chip to copy it.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ThemeSegmented />
            <p className="text-xs text-content/55 max-w-[12rem] text-right leading-relaxed">
              Preview both themes — toggling here switches the whole site.
            </p>
          </div>
        </div>

        {/* Mobile chip nav */}
        <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2 lg:hidden">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="btn-ghost text-xs">
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="container-wide grid lg:grid-cols-[200px_1fr] lg:gap-12">
        <SideNav active={active} />

        <div>
          {/* Colour */}
          <Section
            id="colour"
            eyebrow="01 / Foundation"
            title="Colour"
            intro="Five families. Brand ramps are fixed hex; semantic tokens are CSS-variable backed and flip with the theme. Click a token to copy its Tailwind class, or the hex to copy the value."
          >
            <div className="mb-6 max-w-sm">
              <label className="relative block">
                <span className="sr-only">Filter colours</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter colours — e.g. forest, #F8FB69"
                  className="w-full rounded-pill border border-line/20 bg-surface-2 pl-4 pr-4 py-2.5 text-sm text-content placeholder:text-content/40 focus:outline-none focus:ring-2 focus:ring-sun-300"
                />
              </label>
            </div>

            <div className="space-y-10">
              {filteredPalette.map((group) => (
                <div key={group.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                    <h3 className="display text-2xl text-content">{group.name}</h3>
                    <p className="text-sm text-content/65 max-w-md">{group.note}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {group.swatches.map((sw) => {
                      const label = readableOn(sw.hex)
                      return (
                        <div
                          key={sw.token}
                          className="rounded-2xl h-32 flex flex-col justify-between p-3 border border-line/10"
                          style={{ backgroundColor: sw.hex }}
                        >
                          <span
                            className="font-mono text-[0.7rem] tracking-wider px-1"
                            style={{ color: label, opacity: 0.8 }}
                          >
                            {sw.token}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <CopyChip
                              value={`bg-${sw.token}`}
                              tone={label === '#FDF8EF' ? 'dark' : 'light'}
                            >
                              class
                            </CopyChip>
                            <CopyChip value={sw.hex} tone={label === '#FDF8EF' ? 'dark' : 'light'}>
                              {sw.hex}
                            </CopyChip>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {filteredPalette.length === 0 && (
                <p className="text-sm text-content/60">No colours match “{query}”.</p>
              )}
            </div>

            {/* Semantic tokens */}
            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                <h3 className="display text-2xl text-content">Semantic tokens</h3>
                <p className="text-sm text-content/65 max-w-md">
                  Theme-aware. These swatches update live as you toggle Light / Dark above.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SEMANTIC.map((t) => (
                  <div key={t.varName} className="rounded-2xl bg-surface-2 border border-line/10 p-4 flex items-center gap-4">
                    <div
                      className="h-14 w-14 shrink-0 rounded-xl border border-line/20"
                      style={{ background: `rgb(var(${t.varName}))` }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <CopyChip value={t.cls}>{t.cls}</CopyChip>
                      <p className="mt-1.5 text-xs text-content/70">{t.role}</p>
                      <p className="mt-1 font-mono text-[0.65rem] text-content/45">
                        {t.lightHex} / {t.darkHex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div className="mt-10 bg-surface-2 rounded-3xl p-8 border border-line/10">
              <h3 className="display text-2xl text-content mb-4">Common pairings</h3>
              <ul className="text-base text-content/85 space-y-2.5 leading-relaxed">
                <li>
                  <Code>bg-surface</Code> + <Code>text-content</Code> — default paper page.
                </li>
                <li>
                  <Code>bg-forest-700</Code> + <Code>text-cream-50</Code> — dark panels (stats, CTA),
                  often with a blurred <Code>sun-200/15</Code> glow.
                </li>
                <li>
                  <Code>bg-sun-200</Code> + <Code>text-forest-700</Code> — accent CTAs &amp; the hero
                  underline. Never the primary button on light pages.
                </li>
                <li>
                  <Code>border-line/10</Code> — hairline dividers (any <Code>/n</Code> tint).
                </li>
              </ul>
            </div>

            {/* Contrast checker */}
            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                <h3 className="display text-2xl text-content">Contrast checker</h3>
                <p className="text-sm text-content/65 max-w-md">
                  Pick any two tokens before you pair them on a new block.
                </p>
              </div>
              <ContrastChecker />
            </div>
          </Section>

          {/* Typography */}
          <Section
            id="type"
            eyebrow="02 / Foundation"
            title="Typography"
            intro="Fraunces for display, Plus Jakarta Sans for body, JetBrains Mono for micro-meta. Wrap a word in <em> (or *asterisks* in CMS textareas) for the editorial soft-wonk italic."
          >
            <div className="mb-12">
              <h3 className="display text-2xl text-content mb-4">Type playground</h3>
              <TypePlayground />
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="display text-2xl text-content mb-2">Display — Fraunces</h3>
                <p className="text-sm text-content/70 mb-8 max-w-md">
                  Self-hosted variable font (all four axes). Apply <Code>display</Code> or{' '}
                  <Code>font-display</Code> at <Code>font-light</Code>.
                </p>
                <div className="space-y-5">
                  {DISPLAY_SIZES.map((s) => {
                    const [size] = fontSize[s.key] as [string, { lineHeight: string }]
                    return (
                      <div key={s.key} className="border-b border-line/10 pb-4">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <span className="eyebrow">{s.note}</span>
                          <CopyChip value={`text-${s.key}`}>
                            text-{s.key} · {size}
                          </CopyChip>
                        </div>
                        <p
                          className="display font-light text-content"
                          style={{ fontSize: `min(${size}, 12vw)` }}
                        >
                          Everybody <em>eats</em>.
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="display text-2xl text-content mb-2">Body — Plus Jakarta Sans</h3>
                <p className="text-sm text-content/70 mb-8 max-w-md">
                  The default <Code>font-sans</Code>. Long-form copy sits at <Code>text-content/85</Code>.
                </p>
                <div className="space-y-5">
                  {BODY_SIZES.map((s) => {
                    const [size] = fontSize[s.key] as [string, { lineHeight: string }]
                    return (
                      <div key={s.key} className="border-b border-line/10 pb-4">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <span className="eyebrow">{s.note}</span>
                          <CopyChip value={`text-${s.key}`}>
                            text-{s.key} · {size}
                          </CopyChip>
                        </div>
                        <p className={`text-content/85 text-${s.key}`}>
                          Pay-as-you-feel, restaurant-quality meals from rescued ingredients.
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-10 space-y-6">
                  <div>
                    <CopyChip value="eyebrow">eyebrow</CopyChip>
                    <p className="eyebrow mt-3">A small label that sits above headings</p>
                    <p className="mt-2 text-xs text-content/60">
                      0.65rem, uppercase, 0.18em tracking, <Code>text-muted</Code>.
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow mb-2">Mono — JetBrains Mono</p>
                    <p className="font-mono text-sm text-content">// kickers · stat labels · code</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Buttons */}
          <Section
            id="buttons"
            eyebrow="03 / Components"
            title="Buttons & links"
            intro="Three pre-built classes in globals.css. Stick to them — the hover lift and pill radius are baked in."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="btn-primary">btn-primary</CopyChip>
                <div className="my-5">
                  <button className="btn-primary">Donate now</button>
                </div>
                <p className="text-xs text-content/70 leading-relaxed">Forest fill — the default action.</p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="btn-accent">btn-accent</CopyChip>
                <div className="my-5">
                  <button className="btn-accent">Book a table</button>
                </div>
                <p className="text-xs text-content/70 leading-relaxed">Sun-yellow — marketing CTAs.</p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="btn-ghost">btn-ghost</CopyChip>
                <div className="my-5">
                  <button className="btn-ghost">Learn more</button>
                </div>
                <p className="text-xs text-content/70 leading-relaxed">Outline, fills on hover — secondary.</p>
              </div>
              <div className="bg-forest-700 rounded-3xl p-8">
                <CopyChip value="btn-accent" tone="dark">
                  on forest → btn-accent
                </CopyChip>
                <div className="my-5">
                  <button className="btn-accent">Donate now</button>
                </div>
                <p className="text-xs text-cream-50/70 leading-relaxed">
                  On dark panels prefer accent, or invert ghost borders.
                </p>
              </div>
              <div className="bg-sun-200 rounded-3xl p-8">
                <CopyChip value="btn-primary">on sun → btn-primary</CopyChip>
                <div className="my-5">
                  <button className="btn-primary">Donate now</button>
                </div>
                <p className="text-xs text-forest-700/70 leading-relaxed">
                  Forest primary keeps contrast strongest on sun.
                </p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <p className="eyebrow mb-4">Inline arrow link</p>
                <a
                  href="#buttons"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:gap-3 transition-all"
                >
                  Read the story <span aria-hidden>→</span>
                </a>
                <p className="mt-4 text-xs text-content/70 leading-relaxed">
                  Arrow nudges right on hover via the gap change.
                </p>
              </div>
            </div>
          </Section>

          {/* Components */}
          <Section id="components" eyebrow="04 / Components" title="Building blocks">
            <div className="space-y-12">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="display text-2xl text-content">Cards</h3>
                  <CopyChip value="card-hover">card-hover</CopyChip>
                </div>
                <p className="text-sm text-content/70 mb-6 max-w-md">
                  Soft fill, <Code>rounded-3xl</Code>, lift on hover. Used by pillars, journal cards,
                  locations.
                </p>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card-hover bg-surface-2 rounded-3xl p-8 border border-line/10">
                      <div className="font-mono text-xs mb-6 tracking-[0.2em] text-muted/70">0{i}</div>
                      <h4 className="display text-2xl font-light text-content mb-3">Rescue food</h4>
                      <p className="text-sm text-content/80 leading-relaxed">
                        Hover to see the card lift — 300ms, −translate-y-1, shadow-xl.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="display text-2xl text-content mb-2">Sun underline highlight</h3>
                <p className="text-sm text-content/70 mb-6 max-w-md">
                  The signature hero treatment — a <Code>sun-200</Code> pill behind a keyword. Wired
                  via <Code>highlightWord</Code> in <Code>hero-block.tsx</Code>.
                </p>
                <h2 className="display text-4xl sm:text-6xl font-light text-content">
                  Restaurant-quality meals,{' '}
                  <span className="relative inline-block">
                    pay
                    <span
                      className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-sun-200 -z-10 rounded-full"
                      aria-hidden
                    />
                  </span>{' '}
                  what you can.
                </h2>
              </div>

              <div>
                <h3 className="display text-2xl text-content mb-2">Sun sticker</h3>
                <p className="text-sm text-content/70 mb-6 max-w-md">
                  The rotated yellow disc that overlaps hero imagery.
                </p>
                <div className="relative inline-block">
                  <div className="w-48 h-60 rounded-[3rem] bg-forest-300" />
                  <div
                    className="absolute -top-6 -right-6 w-32 h-32 grid place-items-center rounded-full bg-sun-200 text-forest-700 rotate-12 shadow-xl"
                    aria-hidden
                  >
                    <span className="display text-center text-sm leading-tight font-medium">
                      Pay what
                      <br />
                      <em>you can</em>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="display text-2xl text-content mb-2">Form inputs</h3>
                <p className="text-sm text-content/70 mb-6 max-w-md">
                  Pill inputs — transparent field inside a coloured wrapper. From the newsletter block.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <form className="flex items-center gap-2 bg-surface-2 rounded-pill p-1.5 border border-line/10">
                    <input
                      type="email"
                      placeholder="you@everybodyeats.nz"
                      className="flex-1 bg-transparent px-5 py-2 text-sm placeholder:text-content/40 text-content focus:outline-none"
                    />
                    <button type="button" className="btn-primary text-xs px-5 py-2">
                      Sign up
                    </button>
                  </form>
                  <form className="flex items-center gap-2 bg-forest-600 rounded-pill p-1.5">
                    <input
                      type="email"
                      placeholder="you@everybodyeats.nz"
                      className="flex-1 bg-transparent px-5 py-2 text-sm placeholder:text-cream-50/40 text-cream-50 focus:outline-none"
                    />
                    <button type="button" className="btn-accent text-xs px-5 py-2">
                      Sign up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Section>

          {/* Surfaces */}
          <Section
            id="surfaces"
            eyebrow="05 / Layout"
            title="Section surfaces"
            intro="Almost every section sits on one of three surfaces. Pick by mood: informational stays paper, marketing CTAs go sun, statements & numbers go forest."
          >
            <div className="space-y-6">
              <div className="rounded-3xl bg-surface-2 grain p-10 border border-line/10">
                <p className="eyebrow mb-3">Light section</p>
                <h3 className="display text-3xl sm:text-4xl text-content font-light max-w-2xl">
                  Default surface — paper page, elevated panel.
                </h3>
                <p className="mt-4 text-content/80 max-w-xl">
                  Stats, journal lists, locations, FAQs. Pair with <Code>grain</Code> for texture.
                </p>
              </div>

              <div className="rounded-3xl bg-sun-200 grain p-10">
                <p className="eyebrow mb-3 text-forest-700/70">Sun panel</p>
                <h3 className="display text-3xl sm:text-4xl text-forest-700 font-light max-w-2xl">
                  For marketing CTAs and joyful statements.
                </h3>
                <p className="mt-4 text-forest-700/80 max-w-xl">
                  Always pair with forest text. See the sun variant of <Code>cta-strip-block</Code>.
                </p>
              </div>

              <div className="rounded-3xl bg-forest-700 grain p-10 text-cream-50 relative overflow-hidden">
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl" aria-hidden />
                <div className="relative">
                  <p className="eyebrow text-cream-50/70 mb-3">Forest panel</p>
                  <h3 className="display text-3xl sm:text-4xl font-light max-w-2xl">
                    For statement headlines and big numbers.
                  </h3>
                  <p className="mt-4 text-cream-50/85 max-w-xl">
                    Stats <em>(dark)</em>, pillars, the forest CTA — layered with a blurred sun glow.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-surface-2 rounded-2xl p-6 border border-line/10">
                <p className="eyebrow mb-3">Containers</p>
                <p className="text-sm text-content/85 space-y-1">
                  <span className="block">
                    <CopyChip value="container-wide">container-wide</CopyChip> — 88rem, most sections.
                  </span>
                  <span className="block mt-2">
                    <CopyChip value="container-tight">container-tight</CopyChip> — long-form / article.
                  </span>
                </p>
              </div>
              <div className="bg-surface-2 rounded-2xl p-6 border border-line/10">
                <p className="eyebrow mb-3">Rhythm</p>
                <p className="text-sm text-content/85 leading-relaxed">
                  Sections <Code>py-20 sm:py-24</Code>, panels <Code>py-24 sm:py-32</Code>. Inside
                  panels <Code>p-10</Code> to <Code>p-16</Code>.
                </p>
              </div>
            </div>
          </Section>

          {/* Shape & shadow */}
          <Section
            id="shape"
            eyebrow="06 / Detail"
            title="Shape & shadow"
            intro="Cards round at 3xl, panels at [3rem], everything interactive is a pill. Shadows are soft and only appear on lift."
          >
            <div className="mb-10">
              <h3 className="display text-2xl text-content mb-5">Radius scale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {RADII.map((r) => (
                  <div key={r.cls} className="text-center">
                    <div className={`${r.cls} h-24 bg-forest-500/12 border border-line/15 mb-2`} />
                    <CopyChip value={r.cls}>{r.label}</CopyChip>
                    <p className="mt-1 font-mono text-[0.65rem] text-content/45">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="display text-2xl text-content mb-5">Elevation</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { cls: 'shadow-sm', label: 'shadow-sm' },
                  { cls: 'shadow-md', label: 'shadow-md' },
                  { cls: 'shadow-lg', label: 'shadow-lg' },
                  { cls: 'shadow-xl', label: 'shadow-xl' },
                ].map((s) => (
                  <div key={s.cls} className="text-center">
                    <div className={`${s.cls} h-24 rounded-2xl bg-surface-2 border border-line/10 mb-3`} />
                    <CopyChip value={s.cls}>{s.label}</CopyChip>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-content/60">
                Buttons settle on <Code>shadow-lg</Code> at rest-to-hover; cards lift to{' '}
                <Code>shadow-xl</Code>.
              </p>
            </div>
          </Section>

          {/* Motion & texture */}
          <Section
            id="motion"
            eyebrow="07 / Detail"
            title="Motion & texture"
            intro="High-impact, restrained. All non-essential motion is suppressed under prefers-reduced-motion — never put information in motion alone."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="grain">grain</CopyChip>
                <p className="mt-3 text-sm text-content/85 leading-relaxed">
                  Inline-SVG fractal noise, multiply-blended at 5%. Switches to screen on dark.
                </p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="card-hover">card-hover</CopyChip>
                <p className="mt-3 text-sm text-content/85 leading-relaxed">
                  300ms ease, −translate-y-1, shadow-xl.
                </p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="animate-fade-up">animate-fade-up</CopyChip>
                <p className="mt-3 text-sm text-content/85 leading-relaxed">
                  0.8s entrance, opacity + 20px slide. Feature reveals only.
                </p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10 overflow-hidden">
                <CopyChip value="marquee-track">marquee-track</CopyChip>
                <div className="mt-4 overflow-hidden">
                  <div className="marquee-track text-sm font-mono text-content/60">
                    <span>rescue · cook · serve · repeat ·&nbsp;</span>
                    <span>rescue · cook · serve · repeat ·&nbsp;</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="ease-in-out-soft">ease-in-out-soft</CopyChip>
                <p className="mt-3 text-sm text-content/85 leading-relaxed">
                  Default easing for everyday transitions.
                </p>
              </div>
              <div className="bg-surface-2 rounded-3xl p-8 border border-line/10">
                <CopyChip value="ease-expressive">ease-expressive</CopyChip>
                <p className="mt-3 text-sm text-content/85 leading-relaxed">
                  Cubic overshoot — delight moments, like the theme toggle.
                </p>
              </div>
            </div>

            <div className="mt-10 bg-forest-700 grain rounded-3xl p-8 text-cream-50">
              <p className="eyebrow text-cream-50/70 mb-3">Accessibility</p>
              <p className="text-base text-cream-50/85 max-w-2xl leading-relaxed">
                The reduced-motion contract is wired globally in <Code tone="dark">globals.css</Code>.
                Honour it — collapse animations to their final state, never gate meaning on movement.
              </p>
            </div>
          </Section>

          {/* Footer */}
          <footer className="py-16 border-t border-line/10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-sm text-content/70 max-w-2xl leading-relaxed">
                Prose reference for adding blocks &amp; pages lives in <Code>STYLEGUIDE.md</Code>; the
                tokens themselves live in <Code>src/styles/brand-tokens.ts</Code>. Change a value there
                and this page updates with it.
              </p>
              <Link href="/" className="btn-ghost text-xs">
                Back to site
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
