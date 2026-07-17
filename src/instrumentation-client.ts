import posthog from 'posthog-js'
import type { CaptureResult } from 'posthog-js'

// Substrings identifying errors injected by browser/OS content scripts rather
// than by our own code. These are unhandled window errors that `capture_exceptions`
// forwards into PostHog, where they masquerade as "new issues" (1 event, 1 user)
// even though nothing in this repo references them:
//  - `window.__firefox__.reader` → Firefox for iOS Reader-mode content script.
//  - `_AutofillCallbackHandler` → iOS WebKit autofill script.
//  - `webkit.messageHandlers` → generic iOS WKWebView native bridge.
//  - `Can't find variable: gmo`, `instantSearchSDKJSBridgeClearHighlight` → in-app
//    browser (Google app / Firefox) injected globals.
const INJECTED_ERROR_SIGNATURES = [
  '__firefox__',
  '_AutofillCallbackHandler',
  'webkit.messageHandlers',
  'instantSearchSDKJSBridgeClearHighlight',
  "Can't find variable: gmo",
]

// Drop exception events whose type or message matches a known browser-injected
// script. Returns null to discard, otherwise the event unchanged.
function filterInjectedErrors(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== '$exception') return event

  const exceptions = event.properties?.$exception_list
  if (Array.isArray(exceptions)) {
    for (const ex of exceptions) {
      const haystack = `${ex?.type ?? ''} ${ex?.value ?? ''}`
      if (INJECTED_ERROR_SIGNATURES.some((sig) => haystack.includes(sig))) {
        return null
      }
    }
  }

  return event
}

// Client-side PostHog bootstrap. Next.js runs `instrumentation-client` once per
// full page load, before the app hydrates — the canonical place to init the
// browser SDK in Next 15.3+/16 (do NOT also wrap the tree in a PostHogProvider).
//
// Two deliberate guards:
//  1. No key → no-op. Keeps local dev and the pre-launch preview quiet until the
//     project token is set, mirroring the server-side capture in
//     src/app/(frontend)/actions/enquiry.ts.
//  2. Skip the Payload CMS admin. /admin shares this Next.js process; we only
//     want analytics + session replay on the public marketing site, not on staff
//     CMS sessions. instrumentation-client fires on the initial full-page load,
//     and /admin is always a separate document from the (frontend) routes, so a
//     pathname check here cleanly excludes it.
//
// Ingestion is proxied through /ingest (see next.config.mjs rewrites) so it
// rides the first-party domain and survives ad blockers. `defaults` opts into
// PostHog's current best-practice bundle (autocapture + history-aware pageviews
// and pageleaves), so no manual $pageview wiring is needed for App Router nav.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key && typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
  posthog.init(key, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    before_send: filterInjectedErrors,
    debug: process.env.NODE_ENV === 'development',
  })
}
