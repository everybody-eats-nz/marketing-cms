'use client'

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

// Depth/drift cycle so each letter of the word feathers apart as the cursor
// moves — the deck's staggered GALA, brought to life. Repeats for longer words.
const MOTION = [
  { depth: 1.5, drift: -14 },
  { depth: 0.9, drift: 10 },
  { depth: 1.2, drift: -8 },
  { depth: 0.7, drift: 12 },
]

function HeroLetter({
  char,
  index,
  count,
  mx,
  my,
  reduce,
}: {
  char: string
  index: number
  count: number
  mx: MotionValue<number>
  my: MotionValue<number>
  reduce: boolean
}) {
  const { depth, drift } = MOTION[index % MOTION.length]
  const x = useTransform(mx, [-0.5, 0.5], [-16 * depth, 16 * depth])
  const y = useTransform(my, [-0.5, 0.5], [-10 * depth, 10 * depth])

  return (
    <motion.span
      aria-hidden="true"
      className="gn-hero-letter"
      style={{
        backgroundPosition: `${(index / Math.max(1, count - 1)) * 100}% 0%`,
        x: reduce ? undefined : x,
        y: reduce ? undefined : y,
      }}
      initial={reduce ? false : { opacity: 0, y: 90 + drift, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.15, delay: 0.35 + index * 0.14, ease }}
    >
      {char}
    </motion.span>
  )
}

/**
 * The hero's giant gradient word plus its entrance choreography. Wraps the
 * whole hero content area so the pointer parallax covers the full viewport;
 * children render above the word (script line) and below it (intro, CTAs).
 */
export function HeroWord({
  word,
  ariaLabel,
  above,
  below,
}: {
  word: string
  ariaLabel: string
  above?: ReactNode
  below?: ReactNode
}) {
  const reduce = useReducedMotion() ?? false
  const letters = Array.from(word.trim())

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const mx = useSpring(pointerX, { stiffness: 50, damping: 18 })
  const my = useSpring(pointerY, { stiffness: 50, damping: 18 })

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    pointerX.set(e.clientX / window.innerWidth - 0.5)
    pointerY.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-4"
      onPointerMove={onPointerMove}
    >
      {above ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15, ease }}
        >
          {above}
        </motion.div>
      ) : null}
      <h1 className="gn-hero-word" aria-label={ariaLabel}>
        {letters.map((char, i) => (
          <HeroLetter
            key={`${char}-${i}`}
            char={char}
            index={i}
            count={letters.length}
            mx={mx}
            my={my}
            reduce={reduce}
          />
        ))}
      </h1>
      {below ? (
        <motion.div
          className="flex flex-col items-center"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4, ease }}
        >
          {below}
        </motion.div>
      ) : null}
    </div>
  )
}
