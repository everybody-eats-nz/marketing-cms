'use client'

import { useRef } from 'react'

/*
 * Dock-style magnification for the wordmark: the letter under the pointer
 * swells and its neighbours rise with it on a gaussian falloff, like macOS
 * Dock icons. Scale rides the --hopper-mag custom property (registered in
 * hopper.css with a transition) so smoothing happens in CSS, and the pop-in
 * keyframe shares the same transform so the two never fight.
 */

const BOOST = 0.24 // peak extra scale directly under the pointer
const REACH = 1.5 // falloff width, in letter-widths
const PUSH = 0.5 // how far neighbours slide away from the pointer, in em

type Props = {
  word: string
  ariaLabel: string
}

export function HopperWordmark({ word, ariaLabel }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  const magnify = (clientX: number | null) => {
    const h1 = ref.current
    if (!h1) return
    if (clientX !== null && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // offsetLeft/offsetWidth are layout values, unaffected by the scale
    // transform itself — no feedback loop the way getBoundingClientRect
    // per letter would have. h1 is position:relative so they're h1-local.
    const originLeft = h1.getBoundingClientRect().left
    for (const child of Array.from(h1.children)) {
      const span = child as HTMLElement
      if (clientX === null) {
        span.style.removeProperty('--hopper-mag')
        span.style.removeProperty('--hopper-push')
        continue
      }
      const dist = clientX - (originLeft + span.offsetLeft + span.offsetWidth / 2)
      const sigma = span.offsetWidth * REACH
      const falloff = Math.exp(-(dist * dist) / (2 * sigma * sigma))
      // Neighbours slide away from the pointer so the swollen letter has room —
      // the dock's displacement, not just its bulge. sign(dist) picks the side.
      const push = Math.sign(dist) * -PUSH * falloff * (1 - falloff)
      span.style.setProperty('--hopper-mag', (1 + BOOST * falloff).toFixed(3))
      span.style.setProperty('--hopper-push', `${push.toFixed(3)}em`)
    }
  }

  return (
    <h1
      ref={ref}
      aria-label={ariaLabel}
      className="hopper-display hopper-wordmark relative leading-none tracking-[-0.12em] text-[clamp(4rem,24vw,21rem)]"
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse') magnify(e.clientX)
      }}
      onPointerLeave={() => magnify(null)}
    >
      {[...word].map((letter, i) => (
        <span key={i} aria-hidden style={{ '--i': i } as React.CSSProperties}>
          {letter}
        </span>
      ))}
    </h1>
  )
}
