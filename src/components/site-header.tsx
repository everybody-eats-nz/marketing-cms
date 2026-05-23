import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHref, type LinkValue } from '@/lib/types'
import { MobileMenu } from './mobile-menu'

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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream-50/85 border-b border-forest-500/10">
      <div className="container-wide flex items-center justify-between h-16 sm:h-20">
        <Link
          href="/"
          aria-label="Everybody Eats — home"
          className="text-forest-600 hover:text-forest-700 transition-colors"
        >
          <Image
            src="/everybody-eats-logo.svg"
            alt="Everybody Eats"
            width={179}
            height={65}
            priority
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {primary.map((item, i) => (
            <Link
              key={i}
              href={resolveHref(item.link)}
              className="px-4 py-2 text-sm font-medium text-forest-600/85 hover:text-forest-700 hover:bg-forest-500/5 rounded-full transition-colors"
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
          <Link href={donateUrl} className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5">
            {ctas.donateLabel || 'Donate'}
          </Link>
          <MobileMenu primary={primary as any} secondary={secondary} />
        </div>
      </div>
    </header>
  )
}
