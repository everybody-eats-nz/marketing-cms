import type { ArrayField } from 'payload'

/**
 * A list of temporary (unscheduled) closures - staff shortages, private events.
 * Read on the frontend by activeClosure() in src/lib/closures.ts, which drives
 * every closure notice on the site, so all closure lists share this one shape.
 *
 * Used for the restaurants (Locations → Temporary closures) and the cafes,
 * which have no Location of their own (Site Settings → Closures). Only the
 * editor-facing copy differs: a restaurant closes for a night, a cafe for a day.
 */
export function closuresField({
  name,
  label,
  description,
  dateDescription,
  endDateDescription,
}: {
  name: string
  label: string
  description: string
  dateDescription: string
  endDateDescription: string
}): ArrayField {
  return {
    name,
    label,
    type: 'array',
    labels: { singular: 'Closure', plural: 'Closures' },
    admin: { description },
    fields: [
      {
        name: 'date',
        label: 'Closed on',
        type: 'date',
        required: true,
        // Anchored to Pacific/Auckland (see admin.timezones in payload.config).
        // Without this Payload writes 12:00 UTC for a day-only pick and then
        // redisplays that raw instant in the browser's timezone - which in NZ
        // (UTC+12/+13) is midnight the NEXT day, so the field showed a
        // different date than the one the editor clicked.
        timezone: true,
        admin: {
          date: { pickerAppearance: 'dayOnly' },
          description: dateDescription,
        },
      },
      {
        name: 'endDate',
        label: 'Until (optional)',
        type: 'date',
        timezone: true,
        admin: {
          date: { pickerAppearance: 'dayOnly' },
          description: endDateDescription,
        },
      },
      {
        name: 'reason',
        type: 'text',
        admin: {
          description:
            'Shown to visitors, e.g. "due to staff shortages" or "for a private event". Leave blank to show no reason.',
        },
      },
    ],
  }
}
