// Event dates are instants (the Events `date` field stores day AND time), so
// the day they fall on depends on the timezone they're read in. The server runs
// in UTC, where any event before ~1pm in Auckland is still the previous day -
// a 10am Saturday garage sale would show as Friday. Always read event dates on
// the Pacific/Auckland calendar, which is where the events actually happen.

const NZ_TIME_ZONE = 'Pacific/Auckland'

/**
 * Format an event's date on the Pacific/Auckland calendar, e.g.
 * `formatEventDate(ev.date, { weekday: 'short', day: 'numeric', month: 'short' })`
 * → "Sat 17 Oct". Returns null for a missing or unparseable date.
 */
export function formatEventDate(
  iso: string | Date | null | undefined,
  options: Omit<Intl.DateTimeFormatOptions, 'timeZone'>,
): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-NZ', { ...options, timeZone: NZ_TIME_ZONE })
}
