'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ImpactStoryYear } from '@/lib/impact-story'
import { fmt } from './format'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SUN = 'rgb(248 251 105)' // sun-200 — paid it forward
const CLAY = 'rgb(232 169 136)' // clay-200 — ate as our guests

/**
 * Eases a number toward `value` whenever it changes, so figures roll rather than
 * jump as the year advances. Lives in its own tiny component so the per-frame
 * re-render stays local — the 100-seat grid never re-renders mid-tween.
 */
function useTween(value: number, duration = 460) {
  const [display, setDisplay] = useState(value)
  // Tracks the live displayed value so an interrupted tween (year changed
  // mid-roll during fast play) continues from where it was, never jumps.
  const curRef = useRef(value)
  useEffect(() => {
    const from = curRef.current
    const to = value
    if (from === to) return
    // Under reduced motion the roll collapses to an instant swap — the same
    // rAF path, just with zero duration so the first frame lands on `to`.
    const ms = reducedMotion() ? 0 : duration
    let raf = 0
    let start = 0
    const step = (now: number) => {
      if (!start) start = now
      const t = ms > 0 ? Math.min(1, (now - start) / ms) : 1
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (to - from) * eased
      curRef.current = v
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(step)
      else curRef.current = to
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return display
}

const TweenInt = ({ value }: { value: number }) => <>{fmt(Math.round(useTween(value)))}</>

/**
 * One diner at the table, drawn as a place setting: a plate flanked by a fork
 * and knife. Seats that "paid it forward" glow sun-yellow and carry a koha coin
 * left on the plate; seats that "ate as our guests" sit in warm clay with no
 * coin. The coin is a colour-independent cue — paying vs. guest reads even in
 * greyscale, where the colours alone wouldn't. `delayMs` staggers the colour
 * crossfade so a year change ripples across the band of seats that flipped.
 */
function PlaceSetting({ paid, delayMs = 0 }: { paid: boolean; delayMs?: number }) {
  const color = paid ? SUN : CLAY
  const fade = { transition: 'fill 420ms, stroke 420ms', transitionDelay: `${delayMs}ms` }
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible" aria-hidden focusable="false">
      {/* fork + knife flanking the plate */}
      <g
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
        style={fade}
      >
        <path d="M5 5.5V8.6M6.4 5.5V8.6M7.8 5.5V8.6" />
        <path d="M6.4 8.6V18.5" />
        <path d="M18 5.5C18 5.5 19 7 19 9C19 10.4 18 10.6 18 10.6V18.5" />
      </g>
      {/* plate */}
      <circle cx="12.2" cy="12.4" r="4.4" fill={color} style={fade} />
      {/* koha coin, left on the plate */}
      {paid && (
        <circle
          cx="14.6"
          cy="9.4"
          r="2.4"
          fill="rgb(254 255 232)"
          stroke="rgb(14 42 28)"
          strokeWidth="0.8"
        />
      )}
    </svg>
  )
}

/**
 * The signature interactive: a typical 100-guest service night, drawn as 100
 * place settings. Scrub or play through the years and the balance shifts — more
 * neighbours arriving who eat as our guests, fewer leaving koha on the plate.
 *
 * When the year changes, the seats that *flip* ripple across in a wave (a brief
 * scale pulse staggered along the changed band) and the figures tween. All of it
 * collapses to an instant swap under reduced-motion.
 */
export function CommunalTable({ years }: { years: ImpactStoryYear[] }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Clamp once if the dataset is shorter than a stale index.
  const safeIdx = Math.min(idx, years.length - 1)
  const y = years[safeIdx]

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setIdx((i) => {
        if (i >= years.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, 720)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, years.length])

  const guests = Math.round(y.nonPayingPercent ?? 0) // seats out of 100 who ate as guests
  const paid = 100 - guests // seats that paid it forward
  const seats = useMemo(() => Array.from({ length: 100 }, (_, i) => i < paid), [paid])

  // The band of seats that just flipped. The previous `paid` is tracked in
  // state, adjusted during render, so the colour transition can stagger along
  // the same wave the pulse animates below.
  const [paidHistory, setPaidHistory] = useState({ prev: paid, cur: paid })
  if (paidHistory.cur !== paid) {
    setPaidHistory({ prev: paidHistory.cur, cur: paid })
  }
  const prevPaid = paidHistory.cur === paid ? paidHistory.prev : paidHistory.cur
  const bandLo = Math.min(prevPaid, paid)
  const bandHi = Math.max(prevPaid, paid)

  // Ripple the flipped seats with a staggered scale pulse so the change is visible.
  useEffect(() => {
    if (prevPaid === paid || reducedMotion()) return
    const grid = gridRef.current
    if (!grid) return
    for (let i = bandLo; i < bandHi; i++) {
      const el = grid.children[i] as HTMLElement | undefined
      el?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
        { duration: 380, delay: (i - bandLo) * 7, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
      )
    }
  }, [paid, prevPaid, bandLo, bandHi])

  const play = () => {
    if (safeIdx >= years.length - 1) setIdx(0)
    setPlaying((p) => !p)
  }

  return (
    <div className="bg-forest-700 grain rounded-[2.5rem] [clip-path:inset(0_round_2.5rem)] text-cream-50 px-6 sm:px-10 py-9 sm:py-11 relative overflow-hidden">
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl" aria-hidden />

      <div className="relative z-10">
        <div>
          <p className="eyebrow text-sun-200/90">A typical 100-guest night, by year</p>
          <h3 className="display text-2xl sm:text-3xl font-light mt-2">
            Tonight&rsquo;s table, {y.year}
            {y.partial && <span className="text-cream-50/40">*</span>}
          </h3>
        </div>

        {/* Legend — maps each place setting to its meaning, with the live counts */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 mt-5">
          <div className="flex items-center gap-2.5 rounded-pill bg-sun-200/10 ring-1 ring-sun-200/30 pl-2 pr-4 py-1.5">
            <span className="w-6 h-6 shrink-0">
              <PlaceSetting paid />
            </span>
            <span className="text-sm leading-tight">
              <span className="font-mono text-sun-200 text-base">
                <TweenInt value={paid} />
              </span>{' '}
              left a koha
              <span className="block text-xs text-cream-50/55">paid it forward</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-pill bg-clay-200/10 ring-1 ring-clay-200/30 pl-2 pr-4 py-1.5">
            <span className="w-6 h-6 shrink-0">
              <PlaceSetting paid={false} />
            </span>
            <span className="text-sm leading-tight">
              <span className="font-mono text-clay-200 text-base">
                <TweenInt value={guests} />
              </span>{' '}
              needed a koha
              <span className="block text-xs text-cream-50/55">no charge, no questions</span>
            </span>
          </div>
        </div>

        {/* Seat grid — 10 across on mobile so each place setting stays legible */}
        <div
          ref={gridRef}
          role="img"
          aria-label={`In ${y.year}, ${paid} of every 100 diners left a koha and ${guests} needed a koha.`}
          className="grid [grid-template-columns:repeat(10,minmax(0,1fr))] sm:[grid-template-columns:repeat(20,minmax(0,1fr))] gap-[min(1.4vw,9px)] my-7"
        >
          {seats.map((didPay, i) => {
            const inBand = i >= bandLo && i < bandHi
            return (
              <span key={i} aria-hidden className="block aspect-square">
                <PlaceSetting paid={didPay} delayMs={inBand ? (i - bandLo) * 7 : 0} />
              </span>
            )
          })}
        </div>

        <div className="flex items-center justify-end mt-6">
          <button
            type="button"
            onClick={play}
            className="font-mono text-xs uppercase tracking-[0.12em] rounded-pill px-5 py-2.5
                       border border-cream-50/25 text-cream-50 transition-colors duration-200
                       hover:border-sun-200 hover:bg-cream-50/5 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-sun-200 focus-visible:ring-offset-2
                       focus-visible:ring-offset-forest-700"
            aria-label={playing ? 'Pause' : 'Play through the years'}
          >
            {playing
              ? '❚❚ Pause'
              : safeIdx >= years.length - 1
                ? '↺ Replay'
                : `▶ Play ${years[0].year}–${years[years.length - 1].year}`}
          </button>
        </div>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={years.length - 1}
          value={safeIdx}
          onChange={(e) => {
            setPlaying(false)
            setIdx(+e.target.value)
          }}
          aria-label="Scrub through the years"
          className="impact-scrub w-full mt-8"
        />
        <div className="flex justify-between mt-2">
          {years.map((yr, i) => (
            <button
              key={yr.year}
              type="button"
              onClick={() => {
                setPlaying(false)
                setIdx(i)
              }}
              aria-pressed={i === safeIdx}
              aria-label={`Show ${yr.year}`}
              className={`font-mono text-[11px] px-1 py-1 transition-colors duration-200 ${
                i === safeIdx ? 'text-sun-200' : 'text-cream-50/45 hover:text-cream-50/80'
              }`}
            >
              &rsquo;{String(yr.year).slice(2)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
