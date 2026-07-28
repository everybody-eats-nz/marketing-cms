'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Site-wide unscheduled-closure strip: bright sun-yellow, scrolling marquee.
// Shown at the top of every page (in place of the gala countdown strip) while
// any restaurant has a closure entered in the CMS, and gone the morning after
// the last closed night. Messages are built in <SiteHeader> from each
// location's `closures` array via activeClosure().
//
// The moving track is decorative duplication, so it's aria-hidden with an
// sr-only copy of the message alongside; the global reduced-motion rule in
// globals.css freezes the animation for users who ask for that.

/**
 * Scroll speed (px/second) when Site Settings leaves it blank. 125 is what the
 * old fixed 35s loop worked out to for a typical set of closure messages, so
 * leaving the field alone keeps the strip moving exactly as it always has.
 */
export const DEFAULT_CLOSURE_BANNER_SPEED = 125

type ClosureBannerProps = {
  messages: string[]
  href: string
  /** Scroll speed in pixels per second - Site Settings → Closure banner. */
  speed?: number | null
}

export function ClosureBanner({ messages, href, speed }: ClosureBannerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState<string>()

  // Guard a blank or nonsensical CMS value rather than dividing by it.
  const pxPerSecond = speed && speed > 0 ? speed : DEFAULT_CLOSURE_BANNER_SPEED
  // `messages` is a fresh array every render, so key the effect on its content.
  const messageKey = messages.join('|')

  // A px/second speed only means something against the track's real width, and
  // that shifts with the message text, the viewport, and whether Plus Jakarta
  // has loaded yet, so measure rather than estimate. The track is two
  // identical blocks and the keyframe slides it -50%, so one loop travels half
  // of it. ResizeObserver covers the font swap and later viewport changes.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => setDuration(`${track.scrollWidth / 2 / pxPerSecond}s`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [pxPerSecond, messageKey])

  if (!messages.length) return null

  // One "block" repeats the message set until it's comfortably wider than any
  // viewport; the track renders two identical blocks and slides -50%. Each
  // message carries its own trailing gap (pr-10) instead of the track spacing
  // them, so a block is exactly half the track - that's what makes -50% land
  // seamlessly and the measurement above exact. Hovering pauses it (see
  // .marquee-track in globals.css).
  const perBlock = Math.max(1, Math.ceil(8 / messages.length))
  const block = Array.from({ length: perBlock }, () => messages).flat()
  const doubled = [...block, ...block]

  return (
    <Link
      href={href}
      className="group block bg-sun-200 text-forest-700 hover:bg-sun-300 transition-colors"
    >
      <span className="sr-only">{messages.join(' ')} Read more.</span>
      <div aria-hidden className="overflow-hidden py-2">
        <div
          ref={trackRef}
          className="marquee-track !gap-0"
          style={{ '--marquee-duration': duration } as React.CSSProperties}
        >
          {doubled.map((message, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-10 pr-10 text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap"
            >
              <span>{message}</span>
              <span className="text-forest-700/50 text-[0.6em]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
