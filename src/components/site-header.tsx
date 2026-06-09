import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHref, type LinkValue } from '@/lib/types'
import { MobileMenu } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

export async function SiteHeader() {
  const payload = await getPayloadClient()
  const [nav, settings] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', depth: 2 }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ])

  const primary: Array<{ link: LinkValue; previewImage?: unknown }> = (nav as any)?.primary || []
  const secondary: Array<{ link: LinkValue }> = (nav as any)?.secondary || []
  const ctas = (nav as any)?.ctas || {}
  const donateUrl = (settings as any)?.donateUrl || '/get-involved/donate'
  const shopUrl = (settings as any)?.shopUrl || '#'
  const volunteerUrl = (settings as any)?.volunteerUrl || 'https://volunteers.everybodyeats.nz'

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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {ctas.showVolunteer !== false && volunteerUrl && (
            <a
              href={volunteerUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex btn-ghost text-xs px-4 py-2"
            >
              {ctas.volunteerLabel || 'Volunteer'}
            </a>
          )}
          {ctas.showShop && shopUrl && (
            <a
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex btn-ghost text-xs px-4 py-2"
            >
              {ctas.shopLabel || 'Shop'}
            </a>
          )}
          <ThemeToggle />
          <Link href={donateUrl} className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5">
            {ctas.donateLabel || 'Donate'}
          </Link>
          <MobileMenu primary={primary as any} secondary={secondary} />
        </div>
      </div>
    </header>
  )
}
