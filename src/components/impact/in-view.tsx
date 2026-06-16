'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Sets `data-inview="true"` on its wrapper the first time it scrolls into view,
 * so descendant `.reveal-*` utilities animate in. One-shot (disconnects after
 * firing). Children stay server-rendered — only this thin wrapper is a client
 * component.
 */
export function InView({
  children,
  className,
  threshold = 0.25,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  as?: 'div' | 'figure'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])

  return (
    <Tag ref={ref as never} data-inview={seen} className={className}>
      {children}
    </Tag>
  )
}
