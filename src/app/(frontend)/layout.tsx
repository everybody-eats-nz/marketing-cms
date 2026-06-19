import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { getSiteSettings, SITE_URL, SITE_NOINDEX } from '@/lib/seo'
import { JsonLd, buildOrganization } from '@/components/structured-data'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ThemeScript } from '@/components/theme-script'
import './globals.css'

// Layout fetches site-wide CMS data (settings, nav, footer) on every request.
// Forcing dynamic rendering means we don't need a DB connection at build time
// (the Docker build runs without one) and content edits in Payload appear
// without a redeploy.
export const dynamic = 'force-dynamic'

// Self-hosted Fraunces variable font (same TTFs used by the original Webflow site)
// with all four axes: SOFT, WONK, opsz, wght.
const fraunces = localFont({
  variable: '--font-fraunces',
  display: 'swap',
  src: [
    {
      path: '../../../public/fonts/Fraunces-VariableFont.ttf',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: '../../../public/fonts/Fraunces-Italic-VariableFont.ttf',
      style: 'italic',
      weight: '100 900',
    },
  ],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Proves domain ownership to Meta Business (Brand Safety → Domains) so we keep
// control of link-preview editing and ad attribution for everybodyeats.nz after
// cutover. Bound to the domain, not the platform — the live Webflow site carries
// the same tag, so emitting it here keeps the domain verified through the
// migration. Override via FB_DOMAIN_VERIFICATION if the token is ever rotated.
const FB_DOMAIN_VERIFICATION =
  process.env.FB_DOMAIN_VERIFICATION || '6z6uw8wg97xmw4w0vekim8867qwn6a'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.siteName || 'Everybody Eats'
  const tagline = settings?.tagline || 'Making a difference one plate at a time'
  return {
    title: {
      template: `%s — ${siteName}`,
      default: `${siteName} — ${tagline}`,
    },
    description:
      settings?.description ||
      'Restaurant-quality meals from rescued ingredients, served on a pay-as-you-feel basis. A New Zealand registered charity.',
    metadataBase: new URL(SITE_URL),
    // NB: deliberately no `alternates.canonical` here. Next inherits canonical
    // into every child route that doesn't set its own, so a default of '/' would
    // make standalone routes (events, journal, impact, gala, pay/*) all declare
    // the home page as their canonical and drop themselves from the index. The
    // home page sets its own canonical in page.tsx; routes through pageMetadata()
    // set theirs from the doc path; bare-metadata routes self-canonicalise.
    openGraph: {
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    other: { 'facebook-domain-verification': FB_DOMAIN_VERIFICATION },
    // On the pre-launch preview deployment (SITE_NOINDEX set) keep the whole
    // site out of search indexes so it doesn't compete with the live www host.
    ...(SITE_NOINDEX ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <JsonLd data={buildOrganization(settings)} />
      </head>
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
