import type { ActiveClosure } from '@/lib/closures'
import type { CafeBrand } from './cafe-booking-dialog'

/**
 * Temporary closure notices on a cafe page (/toast, /hopper). The cafes'
 * closure lists live in Site Settings → Closures (src/lib/cafe-closures.ts),
 * and every notice retires itself once the last closed day has passed.
 *
 * Three pieces, mirroring what a restaurant page shows for its closures:
 * - <CafeClosureNotice>: a band above the header bar, rendered by the layout
 *   (the cafe pages' stand-in for the main site's yellow closure strip).
 * - <CafeClosedBadge>: a "Closed today" pill in the hero, on the day itself.
 * - <CafeClosureCard>: the large notice straight after the hero.
 *
 * All of them swap the brand's two colours - paper type on ink - which is the
 * loudest thing either palette can say, so they read as news rather than part
 * of the page. Like the header bar, every class is namespaced to the brand and
 * defined in that brand's own stylesheet.
 */

/** Editors write the reason as a fragment ("due to staff shortages"); it
 *  follows the headline as its own sentence, so capitalise and close it off. */
function reasonSentence(reason: string | null): string | null {
  if (!reason) return null
  return `${reason.charAt(0).toUpperCase()}${reason.slice(1)}${/[.!?]$/.test(reason) ? '' : '.'}`
}

export function CafeClosureNotice({ brand, closure }: { brand: CafeBrand; closure: ActiveClosure }) {
  const singleDay = closure.start === closure.end
  const lead = closure.isToday
    ? singleDay
      ? 'Sorry, we’re closed today.'
      : `Sorry, we’re closed today, through to ${closure.endLabel}.`
    : `We’re closed ${singleDay ? 'on ' : ''}${closure.dateLabel}.`
  const reason = reasonSentence(closure.reason)

  return (
    <aside aria-label="Closure notice" className={`${brand}-closure`}>
      <p className="mx-auto max-w-6xl px-6 sm:px-10">
        {lead}
        {reason && <span className={`${brand}-closure-reason`}> {reason}</span>}
      </p>
    </aside>
  )
}

export function CafeClosedBadge({ brand }: { brand: CafeBrand }) {
  return (
    <p className={`${brand}-closed-badge`}>
      <span aria-hidden className={`${brand}-closed-badge-dot`} />
      Closed today
    </p>
  )
}

export function CafeClosureCard({ brand, closure }: { brand: CafeBrand; closure: ActiveClosure }) {
  const singleDay = closure.start === closure.end
  const reason = reasonSentence(closure.reason)

  return (
    <section aria-label="Temporary closure" className={`${brand}-scope`}>
      <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <div className={`${brand}-closure-card mx-auto max-w-3xl text-center`}>
          <p className={`${brand}-label opacity-70`}>Temporary closure</p>
          <h2 className={`${brand}-closure-card-heading mt-6`}>
            {closure.isToday
              ? 'Sorry, we’re closed today.'
              : `We’re closed ${singleDay ? 'on ' : ''}${closure.dateLabel}.`}
          </h2>
          {closure.isToday && (
            <p className="mt-5 text-base font-bold sm:text-lg">
              {singleDay ? closure.dateLabel : `Closed through to ${closure.endLabel}`}
            </p>
          )}
          {reason && <p className="mt-3 text-base opacity-80 sm:text-lg">{reason}</p>}
          <p className="mt-10 text-sm opacity-70">We look forward to welcoming you back soon.</p>
        </div>
      </div>
    </section>
  )
}
