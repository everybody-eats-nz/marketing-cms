'use client'

import { useEffect, useState } from 'react'
import { GALA_TARGET_ISO } from '@/lib/gala'

// The gala kicks off the evening of Friday 30 October 2026.
const TARGET = new Date(GALA_TARGET_ISO).getTime()

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function remaining(): Remaining {
  const diff = Math.max(0, TARGET - Date.now())
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

export function GalaCountdown() {
  // Render nothing on the server / first paint so the client clock is the only
  // source of truth (avoids a hydration mismatch on the ticking values).
  const [time, setTime] = useState<Remaining | null>(null)

  useEffect(() => {
    setTime(remaining())
    const id = setInterval(() => setTime(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

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
