'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Animates a stat value by counting up to it when it scrolls into view.
 *
 * The value is a display string like "279,550+" or "1,400". We parse out the
 * leading number, animate from 0 → target with a monotonic ease-out (no
 * overshoot — a counter must never tick past its target), and re-apply the
 * original grouping + any prefix/suffix each frame. Values with no parseable
 * number (or when the user prefers reduced motion) render as-is, unanimated.
 */

type Parsed = { target: number; decimals: number; prefix: string; suffix: string }

function parse(value: string): Parsed | null {
  const match = value.match(/\d[\d,]*(\.\d+)?/)
  if (!match) return null
  const numStr = match[0]
  const target = parseFloat(numStr.replace(/,/g, ''))
  if (!Number.isFinite(target)) return null
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return {
    target,
    decimals,
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index! + numStr.length),
  }
}

const format = (n: number, decimals: number) =>
  n.toLocaleString('en-NZ', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!parsed || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const { target, decimals, prefix, suffix } = parsed
    const render = (n: number) => setDisplay(`${prefix}${format(n, decimals)}${suffix}`)
    // Start from zero before first paint so above-the-fold stats never flash the final value.
    render(0)

    let raf = 0
    let timer: ReturnType<typeof setTimeout>
    let started = false
    const duration = 1800

    const run = () => {
      let startTs = 0
      const tick = (now: number) => {
        if (!startTs) startTs = now
        const t = Math.min(1, (now - startTs) / duration)
        const eased = 1 - Math.pow(1 - t, 4) // easeOutQuart
        if (t < 1) {
          render(target * eased)
          raf = requestAnimationFrame(tick)
        } else {
          setDisplay(value) // land exactly on the original string
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          io.disconnect()
          timer = setTimeout(run, delay)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [value, delay])

  return (
    <span ref={ref} aria-label={value}>
      {display}
    </span>
  )
}
