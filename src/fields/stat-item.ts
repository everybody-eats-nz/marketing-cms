import type { Field } from 'payload'

/** Live metrics that can be pulled from the volunteer portal's public stats API. */
export const LIVE_METRICS = ['peopleServed', 'volunteerHours', 'foodSavedKg'] as const
export type LiveMetric = (typeof LIVE_METRICS)[number]

/**
 * Shared fields for a single impact stat — reused by the Stats block's custom
 * items and the Site Settings global impact stats.
 *
 * A stat can either be fully manual (just `value` + `label`) or bound to a live
 * metric from the volunteer portal. When `liveMetric` is set, the renderer shows
 * the live figure (formatted, with optional `suffix`) and falls back to the
 * manual `value` if the live data can't be fetched.
 */
export const statItemFields: Field[] = [
  {
    name: 'value',
    type: 'text',
    required: true,
    admin: { description: 'e.g. "350,000". Used as a fallback when a live metric is set but unavailable.' },
  },
  { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "meals served"' } },
  {
    name: 'liveMetric',
    type: 'select',
    defaultValue: 'none',
    admin: {
      description: 'Pull this number live from the volunteer portal. Leave as "None" for a fixed value.',
    },
    options: [
      { label: 'None (use fixed value above)', value: 'none' },
      { label: 'People served', value: 'peopleServed' },
      { label: 'Volunteer hours', value: 'volunteerHours' },
      { label: 'Food saved (kg)', value: 'foodSavedKg' },
    ],
  },
  {
    name: 'suffix',
    type: 'text',
    admin: {
      description: 'Optional, appended to the value — e.g. "+" or " kg". Only applied to live values.',
    },
  },
]
