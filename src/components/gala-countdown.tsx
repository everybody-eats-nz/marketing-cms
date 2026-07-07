'use client'

import { useEffect, useState } from 'react'

// The gala kicks off the evening of Friday 30 October 2026. NZ is on daylight
// time (UTC+13) in late October. The target is editable via the Gala block, so
// it's passed in; this constant is the fallback when none is set.
const DEFAULT_TARGET = '2026-10-30T18:30:00+13:00'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function remaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const UNITS: Array<[keyof Remaining, string]> = [
  ['days', 'Days'],
  ['hours', 'Hrs'],
  ['minutes', 'Min'],
  ['seconds', 'Sec'],
]

export function GalaCountdown({ target }: { target?: string | null }) {
  const parsed = new Date(target || DEFAULT_TARGET).getTime()
  const targetMs = Number.isNaN(parsed) ? new Date(DEFAULT_TARGET).getTime() : parsed

  // Render nothing on the server / first paint so the client clock is the only
  // source of truth (avoids a hydration mismatch on the ticking values).
  const [time, setTime] = useState<Remaining | null>(null)

  useEffect(() => {
    setTime(remaining(targetMs))
    const id = setInterval(() => setTime(remaining(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

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
