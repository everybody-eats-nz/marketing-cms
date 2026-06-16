'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ImpactStoryYear } from '@/lib/impact-story'
import { fmt } from './format'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
    if (reducedMotion()) {
      curRef.current = to
      setDisplay(to)
      return
    }
    let raf = 0
    let start = 0
    const step = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
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
const TweenMoney = ({ value }: { value: number | null }) => {
  const v = useTween(value ?? 0)
  return <>{value == null ? '—' : '$' + v.toFixed(2)}</>
}

/**
 * The signature interactive: a typical 100-guest service night, drawn as 100
 * seats. Seats that "paid it forward" (left koha) glow sun-yellow; seats that
 * "ate as our guests" sit in warm clay. Scrub or play through the years and the
 * balance shifts — generosity holding while need rises.
 *
 * When the year changes, the seats that *flip* ripple across in a wave (a brief
 * scale pulse staggered along the changed band) and the figures tween, so it's
 * legible which neighbours moved between paying it forward and eating as guests.
 * All of it collapses to an instant swap under reduced-motion.
 */
export function CommunalTable({ years }: { years: ImpactStoryYear[] }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevPaidRef = useRef<number | null>(null)

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
  const diners = y.nights > 0 ? Math.round(y.customers / y.nights) : 0 // avg neighbours fed per night
  const seats = useMemo(() => Array.from({ length: 100 }, (_, i) => i < paid), [paid])

  // The band of seats that just flipped (read the ref during render so the colour
  // transition can stagger along the same wave the pulse animates below).
  const prevPaid = prevPaidRef.current ?? paid
  const bandLo = Math.min(prevPaid, paid)
  const bandHi = Math.max(prevPaid, paid)

  // Ripple the flipped seats with a staggered scale pulse so the change is visible.
  useEffect(() => {
    const prev = prevPaidRef.current
    prevPaidRef.current = paid
    if (prev == null || prev === paid || reducedMotion()) return
    const grid = gridRef.current
    if (!grid) return
    const lo = Math.min(prev, paid)
    const hi = Math.max(prev, paid)
    for (let i = lo; i < hi; i++) {
      const el = grid.children[i] as HTMLElement | undefined
      el?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
        { duration: 380, delay: (i - lo) * 7, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
      )
    }
  }, [paid])

  const play = () => {
    if (safeIdx >= years.length - 1) setIdx(0)
    setPlaying((p) => !p)
  }

  return (
    <div className="bg-forest-700 grain rounded-[2.5rem] text-cream-50 px-6 sm:px-10 py-9 sm:py-11 relative overflow-hidden">
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl" aria-hidden />

      <div className="relative z-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <div>
            <p className="eyebrow text-sun-200/90">A typical 100-guest night, by year</p>
            <h3 className="display text-2xl sm:text-3xl font-light mt-2">
              Tonight&rsquo;s table, {y.year}
              {y.partial && <span className="text-cream-50/40">*</span>}
            </h3>
          </div>
          <div className="font-mono text-xs sm:text-sm text-right leading-relaxed">
            <span className="text-sun-200">
              <TweenInt value={paid} /> paid it forward
            </span>
            <br />
            <span className="text-clay-200">
              <TweenInt value={guests} /> ate as our guests
            </span>
          </div>
        </div>

        {/* Seat grid */}
        <div
          ref={gridRef}
          role="img"
          aria-label={`In ${y.year}, ${paid} of every 100 diners left koha and ${guests} ate as our guests.`}
          className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[min(1.05vw,8px)] my-7"
        >
          {seats.map((didPay, i) => {
            const inBand = i >= bandLo && i < bandHi
            return (
              <span
                key={i}
                aria-hidden
                className="seat aspect-square rounded-full"
                style={{
                  background: didPay ? 'rgb(248 251 105)' : 'rgb(232 169 136)',
                  boxShadow: didPay ? '0 0 7px -1px rgb(248 251 105 / 0.5)' : 'none',
                  opacity: didPay ? 1 : 0.9,
                  // Flipped seats flow as a wave; the rest settle together.
                  transitionDelay: inBand ? `${(i - bandLo) * 7}ms` : '0ms',
                }}
              />
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex gap-8">
            <div>
              <div className="font-mono text-2xl sm:text-3xl text-cream-50 tabular-nums">
                <TweenInt value={diners} />
              </div>
              <div className="text-xs text-cream-50/60 mt-1">neighbours fed that night</div>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl text-sun-200 tabular-nums">
                <TweenMoney value={y.perHead} />
              </div>
              <div className="text-xs text-cream-50/60 mt-1">left in koha, on average</div>
            </div>
          </div>
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
