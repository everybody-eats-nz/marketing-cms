'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { resolveHref, type LinkValue } from '@/lib/types'
import './blocks/hopper/hopper.css'

// The takeover is the Hopper brand, and the wordmark's per-letter sizes/tilts
// are hand-tuned in hopper.css (.hopper-wordmark span:nth-child(...)) to the six
// characters of "hOPPer". It's fixed here rather than CMS-editable so a future
// campaign can't feed in a word that renders with mismatched letters.
const WORDMARK = 'hOPPer'

// Fires when a visitor dismisses the takeover, so useSyncExternalStore re-reads.
const CHANGE_EVENT = 'ee-hopper-takeover-change'

function shouldShow(enabled: boolean, storageKey: string): boolean {
  if (!enabled) return false
  try {
    return window.localStorage.getItem(storageKey) !== '1'
  } catch {
    // localStorage unavailable (private mode / blocked) — show it anyway.
    return true
  }
}

export type Announcement = {
  enabled?: boolean | null
  campaignId?: string | null
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  link?: LinkValue | null
  dismissLabel?: string | null
}

type Props = {
  announcement?: Announcement | null
  /** Hopper font CSS-variable classes, supplied from the server (next/font). */
  fontClassName?: string
}

const STORAGE_PREFIX = 'ee-hopper-takeover:'

/**
 * A one-per-visitor, full-screen Hopper-branded takeover for the home page.
 * Renders nothing on the server / for returning visitors; a returning visitor
 * is anyone who has dismissed the current campaign (tracked in localStorage,
 * keyed by campaignId so a new campaign id re-shows it to everyone).
 */
export function HomeTakeover({ announcement, fontClassName = '' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const enabled = Boolean(announcement?.enabled)
  const campaignId = announcement?.campaignId || 'default'
  const storageKey = STORAGE_PREFIX + campaignId

  // Visibility is derived from localStorage, an external store: false on the
  // server (so there's no hydration flash for returning visitors), then the
  // real value after mount. Dismissing writes the key and dispatches the event.
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CHANGE_EVENT, onChange)
  }, [])
  const open = useSyncExternalStore(
    subscribe,
    () => shouldShow(enabled, storageKey),
    () => false,
  )

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      // Ignore — a visitor with storage blocked just sees it again next time.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [storageKey])

  // While open: lock body scroll, move focus into the dialog, trap Tab, and
  // close on Escape. Restores scroll + focus on close.
  useEffect(() => {
    if (!open) return
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismiss()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [open, dismiss])

  if (!enabled || !open) return null

  const eyebrow = announcement?.eyebrow
  const heading = announcement?.heading
  const bodyText = announcement?.body
  const link = announcement?.link
  const resolved = resolveHref(link)
  const ctaHref = resolved === '#' ? '/hopper' : resolved
  const ctaLabel = link?.label || 'Visit Hopper'
  const ctaNewTab = Boolean(link?.openInNewTab)
  const dismissLabel = announcement?.dismissLabel || 'Not now'

  return (
    <div
      className={`hopper-takeover-backdrop ${fontClassName}`}
      onMouseDown={dismiss}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hopper-takeover-title"
        className="hopper-scope hopper-takeover-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          className="hopper-takeover-close"
          aria-label="Close announcement"
        >
          <span aria-hidden>✕</span>
        </button>

        {eyebrow && (
          <p className="hopper-label mx-auto max-w-[22ch] text-[0.625rem] opacity-70 !tracking-[0.2em] sm:max-w-none sm:text-xs sm:!tracking-[0.3em]">
            {eyebrow}
          </p>
        )}

        <p
          id="hopper-takeover-title"
          aria-label={WORDMARK}
          className="hopper-display hopper-wordmark mt-6 leading-none tracking-[-0.1em] text-[clamp(3.25rem,16vw,7rem)]"
        >
          {[...WORDMARK].map((letter, i) => (
            <span key={i} aria-hidden style={{ '--i': i } as React.CSSProperties}>
              {letter}
            </span>
          ))}
        </p>

        {heading && (
          <p className="mt-6 text-[clamp(1.125rem,3.5vw,1.5rem)] font-bold leading-snug tracking-tight">
            {heading}
          </p>
        )}

        {bodyText && (
          <p className="mx-auto mt-4 max-w-[44ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
            {bodyText}
          </p>
        )}

        <div className="mt-9">
          <Link
            href={ctaHref}
            className="hopper-btn"
            target={ctaNewTab ? '_blank' : undefined}
            rel={ctaNewTab ? 'noopener noreferrer' : undefined}
            onClick={dismiss}
          >
            {ctaLabel} <span aria-hidden>{ctaNewTab ? '↗' : '→'}</span>
            {ctaNewTab && <span className="sr-only">(opens in a new tab)</span>}
          </Link>
        </div>

        <button type="button" onClick={dismiss} className="hopper-takeover-dismiss">
          {dismissLabel}
        </button>
      </div>
    </div>
  )
}
