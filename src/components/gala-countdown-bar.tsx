'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GALA_TARGET_ISO } from '@/lib/gala'

// Slim site-wide promo strip that counts down to the Gala and links to /gala.
// Visibility + copy are driven from Site Settings (the `galaBanner` group). It
// also hides itself on the /gala page (the hero there has its own big countdown)
// and once the event has passed.
type Props = {
  /** From Site Settings. Treated as ON unless explicitly false, so the banner
   *  keeps showing for records saved before this field existed. */
  enabled?: boolean | null
  label?: string | null
  /** Preformatted display date, e.g. "Fri 30 Oct 2026". */
  dateLabel?: string | null
  /** ISO target the live countdown ticks toward. */
  eventDateIso?: string | null
  ctaLabel?: string | null
}

type Remaining = { d: number; h: number; m: number }

function remaining(target: number): Remaining | null {
  const diff = target - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
  }
}

export function GalaCountdownBar({
  enabled,
  label,
  dateLabel,
  eventDateIso,
  ctaLabel,
}: Props) {
  const pathname = usePathname()
  const target = new Date(eventDateIso || GALA_TARGET_ISO).getTime()
  // `undefined` = not yet mounted (server + first client render match on a
  // non-breaking-space placeholder, avoiding a hydration mismatch on the clock).
  const [time, setTime] = useState<Remaining | null | undefined>(undefined)

  useEffect(() => {
    setTime(remaining(target))
    const id = setInterval(() => setTime(remaining(target)), 30_000)
    return () => clearInterval(id)
  }, [target])

  // Switched off in Site Settings.
  if (enabled === false) return null
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
        <span className="font-medium tracking-tight truncate min-w-0">
          <span className="text-sun-200" aria-hidden>
            ✦
          </span>{' '}
          {label || 'The Everybody Eats Gala'}
        </span>
        {dateLabel && (
          <>
            <span className="hidden sm:inline shrink-0 text-cream-50/40" aria-hidden>
              ·
            </span>
            <span className="hidden sm:inline shrink-0 text-cream-50/70 whitespace-nowrap">
              {dateLabel}
            </span>
          </>
        )}
        <span className="shrink-0 text-cream-50/40" aria-hidden>
          ·
        </span>
        <span
          className="shrink-0 font-mono tabular-nums text-sun-200 whitespace-nowrap"
          suppressHydrationWarning
        >
          {clock}
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 font-medium whitespace-nowrap group-hover:gap-2 transition-all">
          {ctaLabel || 'Book'} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
