import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHref, type LinkValue } from '@/lib/types'
import { ExternalLinkIcon } from './external-link-icon'
import { MobileMenu, type MenuAction } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

const isExternal = (href: string) => /^https?:\/\//.test(href)

export async function SiteHeader() {
  const payload = await getPayloadClient()
  const [nav, settings] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', depth: 2 }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
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

  const showVolunteer = ctas.showVolunteer !== false && Boolean(volunteerUrl)
  const showShop = Boolean(ctas.showShop && shopUrl && shopUrl !== '#')

  // All four actions, surfaced inside the overlay menu so they're reachable
  // at every breakpoint (the mobile header bar only fits Donate).
  const menuActions: MenuAction[] = [
    { label: ctas.bookLabel || 'Book', href: bookUrl, external: isExternal(bookUrl), variant: 'solid' },
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
          {isExternal(bookUrl) ? (
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
    </header>
  )
}
