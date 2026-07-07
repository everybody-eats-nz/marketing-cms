'use client'

import { useCallback, useSyncExternalStore } from 'react'

// The gala kicks off the evening of Friday 30 October 2026. NZ is on daylight
// time (UTC+13) in late October. The target is editable via the Gala block, so
// it's passed in; this constant is the fallback when none is set.
const DEFAULT_TARGET = '2026-10-30T18:30:00+13:00'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function remaining(secondsLeft: number): Remaining {
  return {
    days: Math.floor(secondsLeft / 86_400),
    hours: Math.floor(secondsLeft / 3_600) % 24,
    minutes: Math.floor(secondsLeft / 60) % 60,
    seconds: secondsLeft % 60,
  }
}

function subscribeEachSecond(onTick: () => void) {
  const id = setInterval(onTick, 1000)
  return () => clearInterval(id)
}

const serverSnapshot = () => null

const UNITS: Array<[keyof Remaining, string]> = [
  ['days', 'Days'],
  ['hours', 'Hrs'],
  ['minutes', 'Min'],
  ['seconds', 'Sec'],
]

export function GalaCountdown({ target }: { target?: string | null }) {
  const parsed = new Date(target || DEFAULT_TARGET).getTime()
  const targetMs = Number.isNaN(parsed) ? new Date(DEFAULT_TARGET).getTime() : parsed

  // Whole seconds until the gala, ticking via subscription. The snapshot is a
  // primitive so re-renders only happen when the clock actually advances. The
  // server snapshot is null: nothing renders on the server / first paint, so
  // the client clock is the only source of truth (avoids a hydration mismatch
  // on the ticking values).
  const secondsLeft = useSyncExternalStore<number | null>(
    subscribeEachSecond,
    useCallback(() => Math.max(0, Math.floor((targetMs - Date.now()) / 1000)), [targetMs]),
    serverSnapshot,
  )
  const time = secondsLeft == null ? null : remaining(secondsLeft)

  return (
    <div
      className="flex items-stretch gap-2 sm:gap-3"
      role="timer"
      aria-label="Countdown to the Everybody Eats Gala"
    >
      {UNITS.map(([key, label]) => (
        <div
          key={key}
          className="min-w-[3.75rem] sm:min-w-[4.5rem] rounded-2xl bg-cream-50/10 border border-cream-50/15 backdrop-blur-sm px-3 py-2.5 text-center"
        >
          <div className="display text-2xl sm:text-3xl font-light tabular-nums text-sun-200 leading-none">
            {time ? String(time[key]).padStart(2, '0') : '––'}
          </div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-cream-50/55">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
