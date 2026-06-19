import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHref, type LinkValue } from '@/lib/types'
import { BookingDialog, BookingDialogTrigger, type BookingLocation } from './booking/booking-dialog'
import { ExternalLinkIcon } from './external-link-icon'
import { GalaCountdownBar } from './gala-countdown-bar'
import { MobileMenu, type MenuAction } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

const isExternal = (href: string) => /^https?:\/\//.test(href)

export async function SiteHeader() {
  const payload = await getPayloadClient()
  const [nav, settings, locationsRes] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', depth: 2 }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
    payload
      .find({ collection: 'locations', limit: 12, sort: 'name', depth: 0 })
      .catch(() => ({ docs: [] as any[] })),
  ])

  const primary: Array<{ link: LinkValue; previewImage?: unknown }> = (nav as any)?.primary || []
  const secondary: Array<{ link: LinkValue }> = (nav as any)?.secondary || []
  const ctas = (nav as any)?.ctas || {}
  // Ignore legacy Webflow anchors like '#bookingModal' — fall back to the
  // locations page, where each restaurant has its own booking link.
  const rawBookUrl: string = (settings as any)?.bookingUrl || ''
  const bookUrl = rawBookUrl && !rawBookUrl.startsWith('#') ? rawBookUrl : '/dine-with-us'
  const donateUrl = (settings as any)?.donateUrl || '/get-involved/donate'
  const shopUrl = (settings as any)?.shopUrl || '#'
  const volunteerUrl = (settings as any)?.volunteerUrl || 'https://volunteers.everybodyeats.nz'

  // Gala banner (Site Settings → Gala banner tab). Format the date server-side
  // so the client component doesn't risk a timezone-driven hydration mismatch.
  const galaBanner = (settings as any)?.galaBanner || {}
  const galaEventIso: string | undefined = galaBanner.eventDate || undefined
  const galaDateLabel = galaEventIso
    ? (() => {
        const d = new Date(galaEventIso)
        const part = (opts: Intl.DateTimeFormatOptions) =>
          new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', ...opts }).format(d)
        return `${part({ weekday: 'short' })} ${part({ day: 'numeric' })} ${part({ month: 'short' })} ${part({ year: 'numeric' })}`
      })()
    : 'Fri 30 Oct 2026'

  const showVolunteer = ctas.showVolunteer !== false && Boolean(volunteerUrl)
  const showShop = Boolean(ctas.showShop && shopUrl && shopUrl !== '#')

  // Booking dialog: pick a restaurant, then the (re-themed) Now Book It
  // widget loads in place. Only when Book isn't overridden to an external
  // URL in site-settings, and at least one open restaurant takes bookings.
  const bookingLocations: BookingLocation[] = (locationsRes.docs as any[])
    .filter((l) => l.openStatus !== 'closed')
    .map((l) => ({
      name: l.name,
      slug: l.slug,
      city: l.city || null,
      hoursSummary: l.hours?.length
        ? [l.hours[0].label, l.hours[0].times].filter(Boolean).join(' · ')
        : null,
      bookingUrl: l.bookingUrl || null,
      comingSoon: l.openStatus === 'coming-soon',
    }))
  const bookViaDialog =
    !isExternal(bookUrl) && bookingLocations.some((l) => l.bookingUrl && !l.comingSoon)

  // All four actions, surfaced inside the overlay menu so they're reachable
  // at every breakpoint (the mobile header bar only fits Donate).
  const menuActions: MenuAction[] = [
    {
      label: ctas.bookLabel || 'Book',
      href: bookUrl,
      external: isExternal(bookUrl),
      variant: 'solid',
      opensBooking: bookViaDialog,
    },
    { label: ctas.donateLabel || 'Donate', href: donateUrl, external: isExternal(donateUrl), variant: 'accent' },
    ...(showVolunteer
      ? [{ label: ctas.volunteerLabel || 'Volunteer', href: volunteerUrl, external: isExternal(volunteerUrl), variant: 'outline' as const }]
      : []),
    ...(showShop
      ? [{ label: ctas.shopLabel || 'Shop', href: shopUrl, external: isExternal(shopUrl), variant: 'outline' as const }]
      : []),
  ]

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-surface/85 border-b border-line/10">
      <GalaCountdownBar
        enabled={galaBanner.enabled}
        label={galaBanner.label}
        dateLabel={galaDateLabel}
        eventDateIso={galaEventIso}
        ctaLabel={galaBanner.ctaLabel}
      />
      <div className="container-wide flex items-center justify-between h-16 sm:h-20">
        <Link
          href="/"
          aria-label="Everybody Eats — home"
          className="text-content/80 hover:text-content transition-colors"
        >
          <Image
            src="/everybody-eats-logo.svg"
            alt="Everybody Eats"
            width={179}
            height={65}
            priority
            className="h-8 sm:h-10 w-auto dark:[filter:brightness(0)_invert(0.93)_sepia(0.08)]"
          />
        </Link>

        {/* One link group: CMS pages, then the external Volunteer / Shop links */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {primary.map((item, i) => (
            <Link
              key={i}
              href={resolveHref(item.link)}
              className="px-4 py-2 text-sm font-medium text-content/75 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            >
              {item.link.label}
            </Link>
          ))}
          {showVolunteer && (
            <a
              href={volunteerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-content/75 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            >
              {ctas.volunteerLabel || 'Volunteer'}
              <ExternalLinkIcon className="h-2.5 w-2.5 opacity-60" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
          {showShop && (
            <a
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-content/75 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            >
              {ctas.shopLabel || 'Shop'}
              <ExternalLinkIcon className="h-2.5 w-2.5 opacity-60" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </nav>

        {/* CTA pair, then utilities (theme + menu) at the edge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {bookViaDialog ? (
            <BookingDialogTrigger className="hidden sm:inline-flex btn-ghost text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5">
              {ctas.bookLabel || 'Book'}
            </BookingDialogTrigger>
          ) : isExternal(bookUrl) ? (
            <a
              href={bookUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex btn-ghost text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5"
            >
              {ctas.bookLabel || 'Book'}
            </a>
          ) : (
            <Link
              href={bookUrl}
              className="hidden sm:inline-flex btn-ghost text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5"
            >
              {ctas.bookLabel || 'Book'}
            </Link>
          )}
          <Link href={donateUrl} className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5">
            {ctas.donateLabel || 'Donate'}
          </Link>
          <ThemeToggle />
          <MobileMenu primary={primary as any} secondary={secondary} actions={menuActions} />
        </div>
      </div>
      {bookViaDialog && <BookingDialog locations={bookingLocations} />}
    </header>
  )
}
