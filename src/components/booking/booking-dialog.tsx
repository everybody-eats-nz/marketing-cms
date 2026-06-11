'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ExternalLinkIcon } from '../external-link-icon'

export type BookingLocation = {
  name: string
  slug: string
  city?: string | null
  hoursSummary?: string | null
  bookingUrl?: string | null
  comingSoon?: boolean
}

const OPEN_EVENT = 'ee:booking:open'

/** Open the booking dialog from anywhere (header button, mobile menu, …). */
export function openBookingDialog() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT))
}

/** A button that opens the booking dialog. Style it via className. */
export function BookingDialogTrigger({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={openBookingDialog} className={className}>
      {children}
    </button>
  )
}

// Re-theme a Now Book It widget link so the embedded view sits on our cream
// paper instead of the stock white. Only documented params are touched
// (theme / bg / font) — the venue-configured `colors` value is left alone.
// https://kb.nowbookit.com/knowledge/widget-modifications-and-iframes
function themedBookingUrl(raw: string): string {
  try {
    const url = new URL(raw)
    if (url.hostname !== 'nowbookit.com' && !url.hostname.endsWith('.nowbookit.com')) return raw
    url.searchParams.set('theme', 'light')
    url.searchParams.set('bg', 'FDF8EF') // cream-50
    url.searchParams.set('font', 'Plus Jakarta Sans')
    return url.toString()
  } catch {
    return raw
  }
}

export function BookingDialog({ locations }: { locations: BookingLocation[] }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<BookingLocation | null>(null)
  const [widgetReady, setWidgetReady] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onOpen = () => {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setSelected(null)
      setWidgetReady(false)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    // Deferred a frame: focusing an element while its `visibility` is still
    // flipping in the same frame silently no-ops in Chrome.
    const raf = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [open])

  // After the close transition ends: unload the third-party widget and hand
  // focus back to whichever button opened the dialog.
  useEffect(() => {
    if (open) return
    restoreFocusRef.current?.focus?.()
    const t = setTimeout(() => {
      setSelected(null)
      setWidgetReady(false)
    }, 450)
    return () => clearTimeout(t)
  }, [open])

  const close = () => setOpen(false)

  const overlay = (
    <div
      className={`fixed inset-0 z-[110] transition-opacity duration-300 ease-in-out-soft ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close booking"
        onClick={close}
        className="absolute inset-0 w-full cursor-default bg-forest-900/60 backdrop-blur-sm"
      />

      {/* Panel — full-screen sheet on mobile, centred card on sm+ */}
      <div className="pointer-events-none absolute inset-0 sm:grid sm:place-items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book a table"
          className={`pointer-events-auto relative flex h-full w-full flex-col overflow-hidden bg-forest-700 grain text-cream-50 transition-[transform,opacity] duration-500 ease-in-out-soft sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-2xl sm:rounded-[2.5rem] ${
            open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-5 opacity-0 sm:translate-y-0 sm:scale-[0.97]'
          }`}
        >
          {/* Signature warm glow */}
          <div
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sun-200/15 blur-3xl"
            aria-hidden
          />

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close booking"
            className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-cream-50/30 backdrop-blur-sm transition-colors hover:bg-cream-50/10"
          >
            <span className="absolute inset-x-2 top-1/2 h-[1.5px] rotate-45 bg-cream-50" />
            <span className="absolute inset-x-2 top-1/2 h-[1.5px] -rotate-45 bg-cream-50" />
          </button>

          {!selected ? (
            /* Step 1 — choose a restaurant */
            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto p-6 pt-20 sm:p-12 sm:pt-14">
              <p className="eyebrow flex items-center gap-3 !text-cream-50/70">
                <span className="inline-block h-px w-8 bg-cream-50/40" />
                Reservations
              </p>
              <h2 className="display mt-4 text-4xl font-light leading-[0.95] sm:text-5xl">
                Book a <em className="text-sun-200">table</em>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-50/70">
                One three-course menu, pay what you feel. Where would you like to eat?
              </p>

              <ul className="mt-8 sm:mt-10">
                {locations.map((loc, i) => {
                  const rowStyle = {
                    transitionDelay: open ? `${i * 60 + 100}ms` : '0ms',
                    transform: open ? 'translateY(0)' : 'translateY(16px)',
                    opacity: open ? 1 : 0,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  } as const
                  const inner = (
                    <>
                      <span className="pt-2 font-mono text-xs tracking-[0.2em] text-cream-50/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="display block text-3xl font-light leading-tight transition-colors duration-300 group-hover:text-sun-200 sm:text-4xl">
                          {loc.name}
                        </span>
                        {(loc.city || loc.hoursSummary || loc.comingSoon) && (
                          <span className="mt-1 block text-xs text-cream-50/60">
                            {loc.comingSoon
                              ? 'Coming soon'
                              : [loc.city, loc.hoursSummary].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </span>
                      <span
                        aria-hidden
                        className="-translate-x-1 self-center text-xl text-sun-200 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </>
                  )
                  return (
                    <li key={loc.slug} className="border-t border-cream-50/10 last:border-b" style={rowStyle}>
                      {loc.bookingUrl && !loc.comingSoon ? (
                        <button
                          type="button"
                          onClick={() => {
                            setWidgetReady(false)
                            setSelected(loc)
                          }}
                          className="group flex w-full items-start gap-4 py-5 text-left"
                        >
                          {inner}
                        </button>
                      ) : (
                        <Link
                          href={`/dine-with-us/${loc.slug}`}
                          onClick={close}
                          className="group flex w-full items-start gap-4 py-5 text-left"
                        >
                          {inner}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>

              <p className="mt-8 text-xs text-cream-50/50">
                Bookings are handled securely by our partner Now Book It.
              </p>
            </div>
          ) : (
            /* Step 2 — the booking widget, on our paper */
            <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6 pt-16 sm:p-10 sm:pt-12">
              <div className="flex items-center justify-between gap-4 pr-12 sm:pr-14">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-cream-50/80 transition-all hover:gap-3 hover:text-sun-200"
                >
                  <span aria-hidden>←</span> All restaurants
                </button>
                {selected.bookingUrl && (
                  <a
                    href={selected.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cream-50/60 transition-colors hover:text-sun-200"
                  >
                    Open in new tab
                    <ExternalLinkIcon className="h-2.5 w-2.5" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                )}
              </div>

              <h2 className="display mt-3 text-3xl font-light leading-tight sm:text-4xl">
                A table at <em className="text-sun-200">{selected.name}</em>
              </h2>

              <div className="relative mt-5 min-h-0 flex-1 overflow-hidden rounded-3xl bg-cream-50 sm:h-[clamp(24rem,58vh,34rem)] sm:flex-none">
                <iframe
                  src={themedBookingUrl(selected.bookingUrl || '')}
                  title={`Book a table at ${selected.name}`}
                  onLoad={() => setWidgetReady(true)}
                  className="h-full w-full border-0"
                />
                <div
                  className={`absolute inset-0 grid place-items-center bg-cream-50 transition-opacity duration-500 ${
                    widgetReady ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                  aria-hidden={widgetReady}
                >
                  <span
                    className="h-8 w-8 animate-spin rounded-full border-2 border-forest-500/20 border-t-forest-500"
                    role="status"
                    aria-label="Loading booking widget"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return mounted ? createPortal(overlay, document.body) : null
}
