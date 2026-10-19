import type { ActiveClosure } from '@/lib/closures'
import type { CafeBrand } from './cafe-booking-dialog'

/**
 * Temporary closure notice at the very top of a cafe page (/toast, /hopper),
 * above the header bar. The cafe's closure lists live in Site Settings →
 * Closures (src/lib/cafe-closures.ts) and the notice retires itself once the
 * last closed day has passed.
 *
 * It's the brand's two colours swapped - paper type on an ink band - which is
 * the loudest thing either palette can say, so it reads as news rather than
 * part of the page. Like the bar, every class is namespaced to the brand and
 * defined in that brand's own stylesheet.
 */
export function CafeClosureNotice({ brand, closure }: { brand: CafeBrand; closure: ActiveClosure }) {
  const singleDay = closure.start === closure.end
  const lead = closure.isToday
    ? singleDay
      ? 'Sorry, we’re closed today.'
      : `Sorry, we’re closed today, through to ${closure.endLabel}.`
    : `We’re closed ${singleDay ? 'on ' : ''}${closure.dateLabel}.`
  // Editors write a fragment ("due to staff shortages"); it follows the lead
  // as its own sentence, so capitalise it and close it off.
  const reason = closure.reason
    ? `${closure.reason.charAt(0).toUpperCase()}${closure.reason.slice(1)}${/[.!?]$/.test(closure.reason) ? '' : '.'}`
    : null

  return (
    <aside aria-label="Closure notice" className={`${brand}-closure`}>
      <p className="mx-auto max-w-6xl px-6 sm:px-10">
        {lead}
        {reason && <span className={`${brand}-closure-reason`}> {reason}</span>}
      </p>
    </aside>
  )
}
