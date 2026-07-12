import type { CSSProperties, ReactNode } from 'react'

/**
 * Infinite horizontal ribbon. Pure CSS animation — content is duplicated once
 * (aria-hidden) so the loop is seamless. Pauses on hover; falls back to static
 * wrapped content under prefers-reduced-motion (see gala-noir.css).
 */
export function GalaMarquee({
  children,
  speed = '30s',
  reverse = false,
  className,
}: {
  children: ReactNode
  speed?: string
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={`gn-marquee ${className ?? ''}`}>
      <div
        className="gn-marquee-track"
        style={
          {
            '--marquee-speed': speed,
            animationDirection: reverse ? 'reverse' : undefined,
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
