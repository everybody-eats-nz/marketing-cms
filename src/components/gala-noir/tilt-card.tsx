'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * 3D-tilt wrapper for the performer portraits. Follows a fine pointer with a
 * gentle spring; inert on touch devices and under reduced motion.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 160, damping: 20 })
  const sy = useSpring(py, { stiffness: 160, damping: 20 })
  const rotateY = useTransform(sx, [0, 1], [-7, 7])
  const rotateX = useTransform(sy, [0, 1], [6, -6])

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    px.set(x)
    py.set(y)
    ref.current.style.setProperty('--mx', `${x * 100}%`)
    ref.current.style.setProperty('--my', `${y * 100}%`)
  }

  function onPointerLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div style={{ perspective: '1100px' }} className={className}>
      <motion.div
        ref={ref}
        className="gn-portrait-card"
        style={reduce ? undefined : { rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
        <div className="gn-portrait-sheen" />
      </motion.div>
    </div>
  )
}
