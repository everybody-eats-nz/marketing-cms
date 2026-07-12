'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

// Matches the LAST run of digits (with optional , . separators) in a figure
// string, so "1 in 3" animates the 3, "$25,000" the 25,000, "1.22m" the 1.22.
const LAST_NUMBER = /([\d][\d,.]*)(?!.*\d)/

/**
 * Animated stat numeral for CMS-entered figures. Takes an arbitrary string
 * ("1 in 3", "332,234+", "49%", "1.22m"), finds its final numeric run and
 * counts that part up from zero the first time it scrolls into view — the
 * surrounding text is preserved verbatim. Strings with no digits render
 * unchanged. Server render shows the finished figure, so it works without JS.
 */
export function StatFigure({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  // The in-flight animation frame, tagged with the value it was computed from
  // so a CMS edit (e.g. in live preview) discards stale frames without needing
  // a synchronous state reset.
  const [frame, setFrame] = useState<{ of: string; text: string } | null>(null)

  useEffect(() => {
    if (!inView || reduce) return

    const match = value.match(LAST_NUMBER)
    if (!match || match.index === undefined) return

    const raw = match[1]
    const target = Number(raw.replace(/,/g, ''))
    if (!Number.isFinite(target)) return

    const decimals = raw.includes('.') ? (raw.split('.')[1]?.length ?? 0) : 0
    const grouped = raw.includes(',')
    const before = value.slice(0, match.index)
    const after = value.slice(match.index + raw.length)
    const format = new Intl.NumberFormat('en-NZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouped,
    })

    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setFrame({ of: value, text: `${before}${format.format(v)}${after}` }),
    })
    return () => controls.stop()
  }, [inView, reduce, value])

  return (
    <span ref={ref} className={className}>
      {frame?.of === value ? frame.text : value}
    </span>
  )
}
