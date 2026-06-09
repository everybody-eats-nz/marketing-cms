import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { getPayloadClient } from '@/lib/payload'
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

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      siteName,
      type: 'website',
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
