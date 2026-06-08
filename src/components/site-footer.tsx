import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHref, type LinkValue } from '@/lib/types'

export async function SiteFooter() {
  const payload = await getPayloadClient()
  const [footer, settings] = await Promise.all([
    payload.findGlobal({ slug: 'footer' }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ])

  const columns: Array<{ heading: string; links: Array<{ link: LinkValue }> }> = (footer as any)?.columns || []
  const legal: Array<{ link: LinkValue }> = (footer as any)?.legalLinks || []
  const tagline: string = (footer as any)?.tagline || 'Make a difference one plate at a time'
  const copyright: string = (footer as any)?.copyright || '© Everybody Eats'
  const charityNumber: string = (settings as any)?.charityNumber || ''
  const social: Array<{ platform: string; url: string }> = (settings as any)?.social || []
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-forest-700 text-cream-50 grain mt-32 overflow-hidden">
      <div className="relative container-wide pt-20 pb-12">
        <h2 className="display text-4xl sm:text-6xl lg:text-7xl font-light max-w-4xl leading-[1.02]">
          Make a difference{' '}
          <em className="text-sun-200">one plate</em>
          {' '}at a time
        </h2>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col, i) => (
            <div key={i}>
              <h6 className="eyebrow text-cream-50/60 mb-4">{col.heading}</h6>
              <ul className="space-y-2.5">
                {col.links?.map((item, j) => (
                  <li key={j}>
                    <Link
                      href={resolveHref(item.link)}
                      target={item.link.openInNewTab ? '_blank' : undefined}
                      rel={item.link.openInNewTab ? 'noreferrer' : undefined}
                      className="text-sm text-cream-50/80 hover:text-sun-200 transition-colors"
                    >
                      {item.link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-cream-50/15 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cream-50/70">
            {legal.map((item, i) => (
              <Link
                key={i}
                href={resolveHref(item.link)}
                className="hover:text-cream-50 underline-offset-4 hover:underline"
              >
                {item.link.label}
              </Link>
            ))}
            {charityNumber && (
              <a
                href={`https://register.charities.govt.nz/Charity/${charityNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-50/50 hover:text-cream-50 underline-offset-4 hover:underline"
              >
                Charity #{charityNumber}
              </a>
            )}
            <span className="text-cream-50/50">{copyright} {year}</span>
          </div>

          <div className="flex items-center gap-3">
            {social.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit our ${s.platform}`}
                className="w-9 h-9 grid place-items-center rounded-full border border-cream-50/20 text-cream-50/80 hover:bg-sun-200 hover:text-forest-700 hover:border-sun-200 transition-all"
              >
                <SocialIcon name={s.platform} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M13 22v-8h3l.5-4H13V7c0-1 .3-2 2-2h1.5V1.5c-.4 0-1.8-.2-3.3-.2-3 0-4.7 1.8-4.7 5v3.7H6v4h2.5V22H13z" />
      </svg>
    )
  }
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v12H.22V8zm7.44 0h4.36v1.64h.07c.6-1.13 2.08-2.32 4.28-2.32 4.58 0 5.43 3.02 5.43 6.95V20h-4.55v-5.27c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.79V20H7.66V8z" />
      </svg>
    )
  }
  return <span aria-hidden className="text-xs">{name[0]?.toUpperCase()}</span>
}
