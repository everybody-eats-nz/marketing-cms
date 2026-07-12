'use client'

import { useMemo, useState, type CSSProperties } from 'react'

const nzd = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  maximumFractionDigits: 0,
})

/* pink → gold across the room, matching the GALA gradient */
function dotColor(i: number, total: number) {
  const t = i / Math.max(1, total - 1)
  const from = [240, 111, 164]
  const to = [243, 206, 111]
  const c = from.map((f, k) => Math.round(f + (to[k] - f) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function describeDays(days: number) {
  if (days < 0.75) return 'half a day'
  if (days < 1.5) return 'a full day'
  if (days >= 7) {
    const weeks = days / 7
    return `${weeks >= 2 ? Math.round(weeks) : weeks.toFixed(1)} weeks`
  }
  return `${days.toFixed(1).replace(/\.0$/, '')} days`
}

/**
 * The "keep the doors open" seat calculator. Every number is CMS-driven (see
 * the galaNoirCalculator block): drag the slider and the room of dots lights
 * up while dollars convert into days of one restaurant staying open.
 */
export function SeatCalculator({
  roomSeats = 200,
  seatPrice = 330,
  tablePrice = 3000,
  annualCost = 300_000,
  roomLabel,
  sliderLabel,
  footnote,
}: {
  roomSeats?: number
  seatPrice?: number
  tablePrice?: number
  annualCost?: number
  roomLabel?: string
  sliderLabel?: string
  footnote?: string
}) {
  const [seats, setSeats] = useState(10)
  const costPerDay = annualCost / 365

  const presets = useMemo(
    () => [
      { label: '1 seat', seats: 1 },
      { label: '1 table', seats: 10 },
      { label: '3 tables', seats: 30 },
      { label: 'The whole room', seats: roomSeats },
    ],
    [roomSeats],
  )

  const { money, days, breakdown } = useMemo(() => {
    const tables = Math.floor(seats / 10)
    const spare = seats % 10
    const money = tables * tablePrice + spare * seatPrice
    const parts = [
      tables > 0 && `${tables} table${tables > 1 ? 's' : ''} of ten`,
      spare > 0 && `${spare} seat${spare > 1 ? 's' : ''}`,
    ]
    return {
      money,
      days: money / costPerDay,
      breakdown: parts.filter(Boolean).join(' + '),
    }
  }, [seats, seatPrice, tablePrice, costPerDay])

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
      {/* The room, one dot per seat */}
      <div>
        <p className="gn-label mb-4">{roomLabel}</p>
        <div className="gn-room-grid" aria-hidden="true">
          {Array.from({ length: roomSeats }, (_, i) => (
            <span
              key={i}
              className={`gn-room-dot ${i < seats ? 'gn-room-dot--lit' : ''}`}
              style={
                i < seats
                  ? ({ '--dot-color': dotColor(i, roomSeats) } as CSSProperties)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="gala-noir-seats" className="gn-label block">
          {sliderLabel}
        </label>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="gn-stat-figure gn-gradient-text">{seats}</span>
          <span className="gn-body">
            seat{seats > 1 ? 's' : ''}
            {breakdown && seats >= 10 ? ` — ${breakdown}` : ''}
          </span>
        </div>
        <input
          id="gala-noir-seats"
          type="range"
          min={1}
          max={roomSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="gn-range mt-6"
          style={{ '--fill': `${(seats / roomSeats) * 100}%` } as CSSProperties}
          aria-valuetext={`${seats} seats, ${nzd.format(money)}`}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSeats(p.seats)}
              className={`gn-chip ${seats === p.seats ? 'gn-chip--active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-8 border-t border-[var(--hairline)] pt-6">
          <p className="gn-impact-figure text-[var(--magenta-bright)]">{nzd.format(money)}</p>
          <p className="gn-body mt-3 max-w-md">
            keeps an Everybody Eats restaurant&rsquo;s doors open for{' '}
            <strong className="text-[var(--ivory)]">{describeDays(days)}</strong> — three-course
            meals, cooked from rescued food, served with dignity to anyone who walks in.
          </p>
          {footnote ? <p className="mt-4 text-xs text-[var(--ivory-faint)]">{footnote}</p> : null}
        </div>
      </div>
    </div>
  )
}
