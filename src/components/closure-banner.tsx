import Link from 'next/link'

// Site-wide unscheduled-closure strip: bright sun-yellow, scrolling marquee.
// Shown at the top of every page (in place of the gala countdown strip) while
// any restaurant has a closure entered in the CMS, and gone the morning after
// the last closed night. Messages are built in <SiteHeader> from each
// location's `closures` array via activeClosure().
//
// The moving track is decorative duplication, so it's aria-hidden with an
// sr-only copy of the message alongside; the global reduced-motion rule in
// globals.css freezes the animation for users who ask for that.

type ClosureBannerProps = {
  messages: string[]
  href: string
}

export function ClosureBanner({ messages, href }: ClosureBannerProps) {
  if (!messages.length) return null

  // One "block" repeats the message set until it's comfortably wider than any
  // viewport; the track renders two identical blocks and slides -50%, so the
  // loop is seamless. Hovering pauses it (see .marquee-track in globals.css).
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
        <div className="marquee-track !gap-10">
          {doubled.map((message, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-10 text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap"
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
