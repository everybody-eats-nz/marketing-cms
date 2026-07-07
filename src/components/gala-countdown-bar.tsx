'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'

// Slim site-wide promo strip that counts down to the Gala and links to /gala.
// Hides itself on the /gala page (the hero there has its own big countdown) and
// once the event has passed. Kept in sync with the hero countdown target.
const TARGET = new Date('2026-10-30T18:30:00+13:00').getTime()

type Remaining = { d: number; h: number; m: number }

// Whole minutes until the gala, or -1 once it has passed. A primitive snapshot
// keeps useSyncExternalStore re-rendering only when the clock actually moves.
function getMinutesLeft(): number {
  const diff = TARGET - Date.now()
  return diff <= 0 ? -1 : Math.floor(diff / 60_000)
}

function subscribeEvery30s(onTick: () => void) {
  const id = setInterval(onTick, 30_000)
  return () => clearInterval(id)
}

const serverSnapshot = () => null

export function GalaCountdownBar() {
  const pathname = usePathname()
  // The server snapshot is null, so `time` is `undefined` = not yet mounted
  // (server + first client render match on a non-breaking-space placeholder,
  // avoiding a hydration mismatch on the clock) and `null` = event passed.
  const minutesLeft = useSyncExternalStore<number | null>(
    subscribeEvery30s,
    getMinutesLeft,
    serverSnapshot,
  )
  const time: Remaining | null | undefined =
    minutesLeft === null
      ? undefined
      : minutesLeft < 0
        ? null
        : {
            d: Math.floor(minutesLeft / 1_440),
            h: Math.floor(minutesLeft / 60) % 24,
            m: minutesLeft % 60,
          }

  // Redundant with the hero countdown on the Gala page itself.
  if (pathname === '/gala') return null
  // Mounted and the date has passed — retire the strip.
  if (time === null) return null

  const clock =
    time === undefined
      ? ' '
      : `${time.d}d ${String(time.h).padStart(2, '0')}h ${String(time.m).padStart(2, '0')}m`

  return (
    <Link
      href="/gala"
      className="group block bg-forest-700 text-cream-50 hover:bg-forest-600 transition-colors"
    >
      <div className="container-wide flex items-center justify-center gap-x-3 sm:gap-x-4 py-2 text-xs sm:text-sm">
        <span className="font-medium tracking-tight whitespace-nowrap">
          <span className="text-sun-200" aria-hidden>
            ✦
          </span>{' '}
          <span className="sm:hidden">EE Gala</span>
          <span className="hidden sm:inline">The Everybody Eats Gala</span>
        </span>
        <span className="hidden sm:inline text-cream-50/40" aria-hidden>
          ·
        </span>
        <span className="hidden sm:inline text-cream-50/70 whitespace-nowrap">
          Fri 30 Oct 2026
        </span>
        <span className="text-cream-50/40" aria-hidden>
          ·
        </span>
        <span
          className="font-mono tabular-nums text-sun-200 whitespace-nowrap"
          suppressHydrationWarning
        >
          {clock}
        </span>
        <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap group-hover:gap-2 transition-all">
          Book <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
