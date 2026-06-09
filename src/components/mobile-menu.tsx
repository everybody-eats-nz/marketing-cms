'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { resolveHref, type LinkValue, type Media } from '@/lib/types'
import { PayloadImage } from './payload-image'

type PrimaryItem = { link: LinkValue; previewImage?: Media | string | number | null }

type Props = {
  primary: PrimaryItem[]
  secondary: Array<{ link: LinkValue }>
}

export function MobileMenu({ primary, secondary }: Props) {
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

      {/* Top bar — logo + close (floats above image on desktop) */}
      <div className="container-wide flex items-center justify-between h-16 sm:h-20 relative z-20 lg:max-w-none lg:mx-0 lg:px-12 xl:px-20">
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

      {/* Left — nav links (constrained to half-width on lg+) */}
      <div className="relative z-10 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] lg:w-1/2 overflow-y-auto">
        <div className="container-wide lg:max-w-none lg:mx-0 lg:pl-12 xl:pl-20 lg:pr-12 pt-6 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 min-h-full flex flex-col justify-between gap-12">
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
