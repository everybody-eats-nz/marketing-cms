'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { resolveHref, type LinkValue, type Media } from '@/lib/types'
import { openBookingDialog } from './booking/booking-dialog'
import { ExternalLinkIcon } from './external-link-icon'
import { PayloadImage } from './payload-image'

type PrimaryItem = { link: LinkValue; previewImage?: Media | string | number | null }

export type MenuAction = {
  label: string
  href: string
  external?: boolean
  variant: 'solid' | 'accent' | 'outline'
  /** Open the booking dialog instead of navigating to href. */
  opensBooking?: boolean
}

type Props = {
  primary: PrimaryItem[]
  secondary: Array<{ link: LinkValue }>
  actions?: MenuAction[]
}

// On the forest overlay: solid cream for Book, sun accent for Donate,
// inverted ghost for the rest (per STYLEGUIDE's dark-panel pairings).
const actionClasses: Record<MenuAction['variant'], string> = {
  solid:
    'bg-cream-50 text-forest-700 hover:bg-sun-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  accent:
    'bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  outline: 'border border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-forest-700',
}

export function MobileMenu({ primary, secondary, actions = [] }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [open])

  // Find the first primary item that has a preview image — use it as the default
  // shown on the right pane until the user hovers something else.
  useEffect(() => {
    if (!open) return
    const firstWithImage = primary.findIndex(
      (p) => p.previewImage && typeof p.previewImage === 'object',
    )
    setActiveIndex(firstWithImage >= 0 ? firstWithImage : 0)
  }, [open, primary])

  const overlay = (
    <div
      className={`fixed inset-0 z-[100] bg-forest-600 text-cream-50 transition-all duration-500 ease-in-out-soft grain ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-hidden={!open}
    >
      {/* Right — full-height image pane (desktop only) */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        {primary.map((item, i) => {
          const media = item.previewImage
          if (!media || typeof media !== 'object') return null
          const isActive = activeIndex === i
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out-soft ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <PayloadImage
                media={media}
                fill
                size="hero"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                alt={item.link.label || ''}
              />
            </div>
          )
        })}
      </div>

      {/* Top bar — same container as the site header so the logo and close
          button sit exactly where the header logo and burger were. */}
      <div className="container-wide flex items-center justify-between h-16 sm:h-20 relative z-20">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Everybody Eats — home"
          className="inline-flex items-center"
        >
          <Image
            src="/everybody-eats-logo.svg"
            alt="Everybody Eats"
            width={179}
            height={65}
            className="h-8 sm:h-10 w-auto brightness-0 invert"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="relative w-10 h-10 grid place-items-center rounded-full border border-cream-50/30 hover:bg-cream-50/10 backdrop-blur-sm"
        >
          <span className="absolute inset-x-2 top-1/2 h-[1.5px] bg-cream-50 rotate-45" />
          <span className="absolute inset-x-2 top-1/2 h-[1.5px] bg-cream-50 -rotate-45" />
        </button>
      </div>

      {/* Left — nav links. Same container as the top bar so the links align
          with the logo; content constrained to the left half on lg+ (the
          right half is the image pane). */}
      <div className="relative z-10 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] overflow-y-auto">
        <div className="container-wide min-h-full pt-6 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 flex flex-col">
          <div className="lg:w-1/2 lg:pr-10 flex-1 flex flex-col justify-between gap-12">
            <nav aria-label="Primary mobile" className="flex flex-col gap-4 sm:gap-6 lg:gap-3">
              {primary.map((item, i) => {
                const isActive = activeIndex === i
                return (
                  <Link
                    key={i}
                    href={resolveHref(item.link)}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    className={`font-display italic leading-[0.95] text-5xl sm:text-7xl lg:text-7xl xl:text-8xl transition-colors duration-300 ${
                      isActive ? 'text-sun-200' : 'text-cream-50 hover:text-sun-200'
                    }`}
                    style={{
                      fontWeight: 230,
                      fontFeatureSettings: 'normal',
                      transitionDelay: open ? `${i * 60}ms` : '0ms',
                      transform: open ? 'translateY(0)' : 'translateY(20px)',
                      opacity: open ? 1 : 0,
                      transitionProperty: 'transform, opacity, color',
                      transitionDuration: '500ms',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {item.link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex flex-col gap-10">
              {actions.length > 0 && (
                <nav
                  aria-label="Quick actions"
                  className="grid grid-cols-2 gap-3 max-w-md"
                  style={{
                    transitionDelay: open ? `${primary.length * 60 + 80}ms` : '0ms',
                    transform: open ? 'translateY(0)' : 'translateY(20px)',
                    opacity: open ? 1 : 0,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {actions.map((action) => {
                    const className = `inline-flex items-center justify-center gap-1.5 rounded-pill px-5 py-3 text-sm font-medium transition-all duration-200 ease-in-out-soft ${actionClasses[action.variant]}`
                    if (action.opensBooking) {
                      return (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => {
                            setOpen(false)
                            openBookingDialog()
                          }}
                          className={className}
                        >
                          {action.label}
                        </button>
                      )
                    }
                    return action.external ? (
                      <a
                        key={action.label}
                        href={action.href}
                        target="_blank"
                        rel="noreferrer"
                        className={className}
                      >
                        {action.label}
                        <ExternalLinkIcon className="h-2.5 w-2.5 opacity-70" />
                        <span className="sr-only">(opens in new tab)</span>
                      </a>
                    ) : (
                      <Link
                        key={action.label}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        className={className}
                      >
                        {action.label}
                      </Link>
                    )
                  })}
                </nav>
              )}

              {secondary.length > 0 && (
                <nav
                  aria-label="Secondary mobile"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 max-w-2xl"
                >
                  {secondary.map((item, i) => (
                    <Link
                      key={i}
                      href={resolveHref(item.link)}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-cream-50/70 hover:text-sun-200 transition-colors"
                    >
                      {item.link.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 grid place-items-center rounded-full border border-line/20 hover:bg-content/5 transition-colors"
      >
        <span className="sr-only">Menu</span>
        <span
          className={`absolute inset-x-2 top-[14px] h-[1.5px] bg-content transition-all duration-300 ${
            open ? 'translate-y-[6px] rotate-45' : ''
          }`}
        />
        <span
          className={`absolute inset-x-2 top-[20px] h-[1.5px] bg-content transition-all duration-300 ${
            open ? '-translate-y-[6px] -rotate-45' : ''
          }`}
        />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  )
}
