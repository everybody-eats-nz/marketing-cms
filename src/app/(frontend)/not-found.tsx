import type { Metadata } from 'next'
import Link from 'next/link'
import { PlatesSymbol } from '@/components/plates-symbol'
import { ScrollToTopOnMount } from '@/components/scroll-to-top-on-mount'
import { NOT_FOUND_METADATA } from '@/lib/seo'

// Branded 404 for the marketing site. Rendered inside the (frontend) layout,
// so the site header and footer stay put. Next serves it with a 404 status for
// unmatched URLs and for any page that calls notFound().
export const metadata: Metadata = NOT_FOUND_METADATA

const DESTINATIONS = [
  { href: '/', label: 'Home', blurb: 'Start again from the front page.' },
  { href: '/dine-with-us', label: 'Dine with us', blurb: 'Find a restaurant and book a table.' },
  { href: '/get-involved', label: 'Get involved', blurb: 'Volunteer, donate or cook with your team.' },
  { href: '/contact', label: 'Contact', blurb: 'Ask us anything, or tell us about the broken link.' },
]

export default function NotFound() {
  return (
    <section className="relative overflow-hidden grain pt-10 sm:pt-16 lg:pt-20 pb-20 sm:pb-28">
      <ScrollToTopOnMount />
      <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Art first in the DOM so the 404 sticker leads on phones; on desktop
            it moves to the right-hand column. */}
        <div className="lg:col-span-5 lg:order-2 relative z-10">
          <div className="relative w-44 sm:w-64 lg:w-full max-w-md lg:mx-auto">
            <PlatesSymbol className="w-full h-auto text-forest-500 dark:text-forest-300" />
            <p className="absolute -top-4 -right-10 sm:-top-6 sm:-right-14 lg:-top-8 lg:right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 grid place-content-center gap-1 rounded-full bg-sun-200 text-forest-700 text-center rotate-12 shadow-xl">
              <span className="display block text-3xl sm:text-4xl lg:text-5xl font-light leading-none">
                404
              </span>
              <span className="block text-[0.65rem] sm:text-xs font-medium leading-tight">
                Page not found
              </span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:order-1 relative z-10">
          <h1 className="display text-5xl sm:text-7xl lg:text-[6rem] font-light leading-[0.95] text-content">
            This page is <em className="whitespace-nowrap">off the menu</em>.
          </h1>
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl max-w-xl text-content/85 leading-relaxed">
            The link may be out of date, or the page has moved. Try one of these instead.
          </p>

          <nav aria-label="Suggested pages" className="mt-8 sm:mt-10 max-w-2xl">
            <ul className="border-t border-line/15">
              {DESTINATIONS.map((d) => (
                <li key={d.href} className="border-b border-line/15">
                  <Link
                    href={d.href}
                    className="group flex items-center justify-between gap-6 py-4 sm:py-5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 dark:focus-visible:ring-sun-200 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                  >
                    <span className="min-w-0">
                      <span className="display block text-2xl sm:text-3xl font-light text-content">
                        {d.label}
                      </span>
                      <span className="mt-1 block text-sm sm:text-base text-content/70">
                        {d.blurb}
                      </span>
                    </span>
                    <span
                      className="shrink-0 grid place-items-center h-11 w-11 rounded-full border border-line/25 text-content transition-colors duration-200 ease-in-out-soft group-hover:bg-forest-500 group-hover:border-forest-500 group-hover:text-cream-50 dark:group-hover:bg-sun-200 dark:group-hover:border-sun-200 dark:group-hover:text-forest-700"
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4 transition-transform duration-200 ease-in-out-soft group-hover:translate-x-0.5"
                      >
                        <path
                          d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
