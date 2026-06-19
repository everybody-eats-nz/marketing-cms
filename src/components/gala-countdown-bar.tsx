'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Slim site-wide promo strip that counts down to the Gala and links to /gala.
// Hides itself on the /gala page (the hero there has its own big countdown) and
// once the event has passed. Kept in sync with the hero countdown target.
const TARGET = new Date('2026-10-30T18:30:00+13:00').getTime()

type Remaining = { d: number; h: number; m: number }

function remaining(): Remaining | null {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
  }
}

export function GalaCountdownBar() {
  const pathname = usePathname()
  // `undefined` = not yet mounted (server + first client render match on a
  // non-breaking-space placeholder, avoiding a hydration mismatch on the clock).
  const [time, setTime] = useState<Remaining | null | undefined>(undefined)

  useEffect(() => {
    setTime(remaining())
    const id = setInterval(() => setTime(remaining()), 30_000)
    return () => clearInterval(id)
  }, [])

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
