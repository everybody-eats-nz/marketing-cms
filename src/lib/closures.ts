// Temporary (unscheduled) restaurant closures — staff shortages, private
// events. Editors add entries to a location's `closures` array; everything on
// the site derives from that one list: the yellow site-wide banner, the notice
// in the menu slot on the location page, and the red "Closed tonight" badge on
// the night itself. Entries expire on their own once the last night has passed.
//
// "Tonight" is resolved on the Pacific/Auckland calendar, so it means tonight at
// the restaurants regardless of where the server runs. The dates the editor
// picked are read back in UTC instead - see pickedDay() for why.

export type ClosureEntry = {
  date?: string | null
  endDate?: string | null
  reason?: string | null
}

export type ActiveClosure = {
  /** First closed night, as a Pacific/Auckland YYYY-MM-DD string. */
  start: string
  /** Last closed night (same as `start` for a single night). */
  end: string
  reason: string | null
  /** True when tonight falls inside the closure — the restaurant is closed right now. */
  isTonight: boolean
  /** Human date(s), e.g. "Friday 18 July" or "Friday 18 July – Saturday 19 July". */
  dateLabel: string
}

const NZ_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' })
const PICKED_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' })
const NZ_LABEL = new Intl.DateTimeFormat('en-NZ', {
  timeZone: 'Pacific/Auckland',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

/** The Pacific/Auckland calendar date (YYYY-MM-DD) of an instant. */
function nzDay(iso: string | Date): string | null {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : NZ_DAY.format(d)
}

/**
 * The calendar date (YYYY-MM-DD) an editor picked in the admin. Payload's
 * `dayOnly` picker normalises to 12:00 UTC on the chosen day whatever timezone
 * the editor is in, so the day reads back in UTC. Don't reach for nzDay() here:
 * NZ is UTC+12/+13, so noon UTC is already tomorrow in Auckland and every
 * closure would land a night late.
 */
function pickedDay(iso: string | Date): string | null {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : PICKED_DAY.format(d)
}

/** "Friday 18 July" for a YYYY-MM-DD day string. */
function labelForDay(day: string): string {
  // Noon UTC is mid-day-ish everywhere and safely inside `day` in NZ.
  return NZ_LABEL.format(new Date(`${day}T12:00:00+12:00`))
}

/**
 * The current (or nearest upcoming) closure from a location's `closures`
 * array, or null when none is on the horizon. A closure is surfaced from the
 * moment it's entered in the CMS until its last night has passed.
 */
export function activeClosure(
  closures: ClosureEntry[] | null | undefined,
  now: Date = new Date(),
): ActiveClosure | null {
  if (!closures?.length) return null
  const today = nzDay(now)!

  const upcoming = closures
    .flatMap((entry) => {
      const start = entry.date ? pickedDay(entry.date) : null
      if (!start) return []
      const rawEnd = entry.endDate ? pickedDay(entry.endDate) : null
      // A range ending before it starts is a data-entry slip — treat as one night.
      const end = rawEnd && rawEnd >= start ? rawEnd : start
      if (end < today) return [] // already over
      return [{ start, end, reason: entry.reason?.trim() || null }]
    })
    .sort((a, b) => (a.start < b.start ? -1 : 1))

  const next = upcoming[0]
  if (!next) return null

  return {
    ...next,
    isTonight: next.start <= today && today <= next.end,
    dateLabel:
      next.start === next.end
        ? labelForDay(next.start)
        : `${labelForDay(next.start)} – ${labelForDay(next.end)}`,
  }
}
