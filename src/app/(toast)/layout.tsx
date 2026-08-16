import type { Metadata } from 'next'
import Link from 'next/link'
import { CafeBar } from '@/components/cafe-bar'
import { loadCafeBarData } from '@/lib/cafe-bar-data'
import { SITE_URL, SITE_NOINDEX } from '@/lib/seo'
import { toastMono } from '@/lib/toast-fonts'
import '../(frontend)/globals.css'
import '@/components/blocks/toast/toast.css'

// Toast is its own brand, so this route group has its own root layout: no
// Everybody Eats header/footer, no theme toggle (the brand is fixed yellow
// paper), and its own typeface. The page content itself still comes from the
// Pages collection (slug `toast`) via the shared blocks pipeline.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...(SITE_NOINDEX ? { robots: { index: false, follow: false } } : {}),
}

export default async function ToastLayout({ children }: { children: React.ReactNode }) {
  const bar = await loadCafeBarData('toast')

  return (
    <html lang="en" className={toastMono.variable}>
      <body className={`toast-scope min-h-svh${bar.show ? ' has-toast-bar' : ''}`}>
        {bar.show && (
          <CafeBar
            brand="toast"
            bookUrl={bar.bookUrl}
            bookLabel={bar.bookLabel}
            donateUrl={bar.donateUrl}
            donateLabel={bar.donateLabel}
          />
        )}
        <main>{children}</main>
        <footer className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="toast-rule mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 border-t py-10 text-center sm:flex-row sm:text-left">
            <p className="toast-label">Toast</p>
            <Link href="/" className="toast-label no-underline hover:underline underline-offset-4">
              an Everybody Eats project →
            </Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
