'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { resolveHref, type LinkValue } from '@/lib/types'

type Props = {
  primary: Array<{ link: LinkValue }>
  secondary: Array<{ link: LinkValue }>
}

export function MobileMenu({ primary, secondary }: Props) {
  const [open, setOpen] = useState(false)

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

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 grid place-items-center rounded-full border border-forest-500/20 hover:bg-forest-500/5 transition-colors"
      >
        <span className="sr-only">Menu</span>
        <span
          className={`absolute inset-x-2 top-[14px] h-[1.5px] bg-forest-600 transition-all duration-300 ${
            open ? 'translate-y-[6px] rotate-45' : ''
          }`}
        />
        <span
          className={`absolute inset-x-2 top-[20px] h-[1.5px] bg-forest-600 transition-all duration-300 ${
            open ? '-translate-y-[6px] -rotate-45' : ''
          }`}
        />
      </button>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 z-50 bg-forest-600 text-cream-50 transition-all duration-500 ease-in-out-soft grain ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden={!open}
      >
        <div className="container-wide flex items-center justify-between h-16 sm:h-20 relative z-10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="display text-lg sm:text-xl font-medium text-cream-50"
          >
            Everybody <em>Eats</em>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="relative w-10 h-10 grid place-items-center rounded-full border border-cream-50/30 hover:bg-cream-50/10"
          >
            <span className="absolute inset-x-2 top-1/2 h-[1.5px] bg-cream-50 rotate-45" />
            <span className="absolute inset-x-2 top-1/2 h-[1.5px] bg-cream-50 -rotate-45" />
          </button>
        </div>

        <div className="container-wide pt-8 sm:pt-16 pb-12 relative z-10 overflow-y-auto h-[calc(100dvh-5rem)]">
          <nav aria-label="Primary mobile" className="flex flex-col gap-3 mb-12">
            {primary.map((item, i) => (
              <Link
                key={i}
                href={resolveHref(item.link)}
                onClick={() => setOpen(false)}
                className="display text-4xl sm:text-6xl font-light tracking-tight text-cream-50 hover:text-sun-200 transition-colors"
                style={{
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
            ))}
          </nav>

          {secondary.length > 0 && (
            <nav aria-label="Secondary mobile" className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 max-w-2xl">
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
    </>
  )
}
