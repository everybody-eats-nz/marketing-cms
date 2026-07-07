import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NOINDEX } from '@/lib/seo'
import { hopperDisplay, hopperMono } from '@/lib/hopper-fonts'
import '../(frontend)/globals.css'
import '@/components/blocks/hopper/hopper.css'

// Hopper Cafe is its own brand, so this route group has its own root layout:
// no Everybody Eats header/footer, no theme toggle (the brand is fixed lilac),
// and its own typefaces. The page content itself still comes from the Pages
// collection (slug `hopper`) via the shared blocks pipeline.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...(SITE_NOINDEX ? { robots: { index: false, follow: false } } : {}),
}

export default function HopperLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hopperDisplay.variable} ${hopperMono.variable}`}>
      <body className="hopper-scope min-h-svh">
        <main>{children}</main>
        <footer className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="hopper-rule mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 border-t py-10 text-center sm:flex-row sm:text-left">
            <p className="hopper-label">Hopper Cafe</p>
            <Link href="/" className="hopper-label no-underline hover:underline underline-offset-4">
              an Everybody Eats project →
            </Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
