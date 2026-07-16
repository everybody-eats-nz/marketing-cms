import type { ActiveClosure } from '@/lib/closures'

// Unmissable closure notice on a location page, sitting where tonight's menu
// normally does (replacing it on the closed night itself, above it while the
// closure is still ahead). Same card geometry as the menu, flipped to the
// brand's sun-yellow accent panel so it can't be read as just another menu.

export function ClosureNotice({ closure }: { closure: ActiveClosure }) {
  const singleNight = closure.start === closure.end
  const reason = closure.reason
    ? closure.reason.charAt(0).toUpperCase() + closure.reason.slice(1)
    : null

  return (
    <section className="container-tight pt-24">
      <div className="rounded-[2.5rem] bg-sun-200 px-8 py-14 sm:px-16 text-center text-forest-700">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-forest-700/70 mb-4">
          Temporary closure
        </p>
        {closure.isTonight ? (
          <>
            <p className="display text-4xl sm:text-5xl font-light leading-tight">
              Sorry, we&rsquo;re closed <em>tonight</em>.
            </p>
            <p className="mt-4 text-lg font-medium">
              {singleNight ? closure.dateLabel : `Closed ${closure.dateLabel}`}
            </p>
          </>
        ) : (
          <p className="display text-4xl sm:text-5xl font-light leading-tight">
            We&rsquo;re closed{singleNight ? ' on ' : ' '}
            <em>{closure.dateLabel}</em>.
          </p>
        )}
        {reason && <p className="mt-3 text-lg text-forest-700/85">{reason}</p>}
        <p className="mt-8 text-sm text-forest-700/75">
          We look forward to welcoming you back soon.
        </p>
      </div>
    </section>
  )
}
