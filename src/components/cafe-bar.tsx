import Link from 'next/link'
import { CafeBookingDialog, CafeBookingLink, type CafeBrand } from './cafe-booking-dialog'

/**
 * The action strip pinned to the top of the standalone cafe pages (/toast and
 * /hopper). Those route groups have no Everybody Eats header, so this bar is
 * the only Book / Donate affordance above the fold.
 *
 * It carries no styling of its own: every class is namespaced to the brand
 * (`toast-bar`, `hopper-btn`, …) and defined in that brand's own stylesheet, so
 * the two cafes stay visually independent and nothing leaks between them or
 * into the main site. Adding a third cafe means a new `<brand>-bar` block in
 * its stylesheet, not a change here.
 *
 * Book is omitted entirely when that cafe has no booking link in the CMS —
 * Hopper's bookings aren't live yet — leaving Donate as the sole action.
 */

const isExternal = (href: string) => /^https?:\/\//.test(href)

export type CafeBarProps = {
  brand: CafeBrand
  /** Blank until this cafe takes bookings; the Book button is dropped when so. */
  bookUrl?: string | null
  bookLabel?: string | null
  donateUrl: string
  donateLabel?: string | null
}

function CafeBarLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className: string
}) {
  if (!isExternal(href)) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      {/* The same ↗ the cafe pages use for their maps link, so "leaves this
          site" reads the same way everywhere in the brand. */}
      <span aria-hidden>↗</span>
      <span className="sr-only">(opens in new tab)</span>
    </a>
  )
}

export function CafeBar({ brand, bookUrl, bookLabel, donateUrl, donateLabel }: CafeBarProps) {
  const book = bookUrl?.trim()
  const pill = `${brand}-btn ${brand}-bar-btn`

  return (
    <div className={`${brand}-bar`}>
      {/* One header row on the page's own max-w-6xl / px-6 column: the Everybody
          Eats mark at the left, actions at the right, both landing on the same
          lines as the hero rule and the footer below. The logo lives here
          rather than in the hero block so it shares this row instead of
          stacking under a separate strip. */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-10">
        <Link
          href="/"
          aria-label="Everybody Eats"
          className={`${brand}-bar-logo`}
        >
          {/* Smaller on a phone: the row has to hold both pills at 375px. */}
          <span className={`${brand}-ee-logo h-6 aspect-[179/65] sm:h-8`} />
        </Link>
        <nav aria-label="Book or donate" className="flex items-center gap-2 sm:gap-3">
          {book && (
            // A real link to the booking site, upgraded to the in-page modal
            // once the dialog below has hydrated.
            <CafeBookingLink href={book} className={pill}>
              {bookLabel?.trim() || 'Book a table'}
            </CafeBookingLink>
          )}
          <CafeBarLink
            href={donateUrl}
            label={donateLabel?.trim() || 'Donate'}
            className={`${pill} ${brand}-btn--solid`}
          />
        </nav>
      </div>
      {book && <CafeBookingDialog brand={brand} bookingUrl={book} />}
    </div>
  )
}
