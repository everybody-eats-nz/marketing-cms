'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'

// Slim site-wide promo strip that counts down to the Gala and links wherever the
// CMS points it. Copy, target date and link all come from Site Settings (Gala
// banner tab) via <SiteHeader>. Hides itself on the page it links to (the /gala
// hero has its own big countdown) and once the event has passed.

type GalaCountdownBarProps = {
  targetIso: string
  href: string
  external?: boolean
  ctaLabel: string
  eventName: string
  eventNameShort: string
  dateLabel?: string
}

type Remaining = { d: number; h: number; m: number }

function subscribeEvery30s(onTick: () => void) {
  const id = setInterval(onTick, 30_000)
  return () => clearInterval(id)
}

const serverSnapshot = () => null

export function GalaCountdownBar({
  targetIso,
  href,
  external = false,
  ctaLabel,
  eventName,
  eventNameShort,
  dateLabel,
}: GalaCountdownBarProps) {
  const pathname = usePathname()
  const target = new Date(targetIso).getTime()

  // Whole minutes until the gala, or -1 once it has passed. A primitive snapshot
  // keeps useSyncExternalStore re-rendering only when the clock actually moves.
  function getMinutesLeft(): number {
    if (Number.isNaN(target)) return -1
    const diff = target - Date.now()
    return diff <= 0 ? -1 : Math.floor(diff / 60_000)
  }

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

  // Redundant with the destination page's own hero countdown.
  if (!external && pathname === href) return null
  // Mounted and the date has passed — retire the strip.
  if (time === null) return null

  const clock =
    time === undefined
      ? ' '
      : `${time.d}d ${String(time.h).padStart(2, '0')}h ${String(time.m).padStart(2, '0')}m`

  const content = (
    <div className="container-wide flex items-center justify-center gap-x-3 sm:gap-x-4 py-2 text-xs sm:text-sm">
      <span className="font-medium tracking-tight whitespace-nowrap">
        <span className="text-sun-200" aria-hidden>
          ✦
        </span>{' '}
        <span className="sm:hidden">{eventNameShort}</span>
        <span className="hidden sm:inline">{eventName}</span>
      </span>
      {dateLabel && (
        <>
          <span className="hidden sm:inline text-cream-50/40" aria-hidden>
            ·
          </span>
          <span className="hidden sm:inline text-cream-50/70 whitespace-nowrap">{dateLabel}</span>
        </>
      )}
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
        {ctaLabel} <span aria-hidden>→</span>
      </span>
    </div>
  )

  const className =
    'group block bg-forest-700 text-cream-50 hover:bg-forest-600 transition-colors'

  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}
