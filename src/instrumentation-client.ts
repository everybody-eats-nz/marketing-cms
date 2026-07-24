import posthog from 'posthog-js'
import type { CaptureResult } from 'posthog-js'

// Substrings that mark a captured exception as third-party noise rather than a
// real site error. `capture_exceptions` turns on global autocapture of
// `unhandledrejection` and `window` errors, which scoops up several kinds of
// noise that never originate in our code:
//
//  Browser-extension content scripts (promise rejections that can't reach their
//  own background page):
//   - "Object Not Found Matching Id:… MethodName:update ParamCount:…"
//
//  Browser/OS content scripts injected into the page, which surface in PostHog as
//  fake "new issues" (1 event, 1 user):
//   - `window.__firefox__.reader` → Firefox for iOS Reader-mode content script.
//   - `_AutofillCallbackHandler` → iOS WebKit autofill script.
//   - `webkit.messageHandlers` → generic iOS WKWebView native bridge.
//   - `Can't find variable: gmo`, `instantSearchSDKJSBridgeClearHighlight` →
//     in-app browser (Google app / Firefox) injected globals.
//
//  A browser extension / injected script calling `JSON.stringify` on a live DOM
//  node whose React fiber closes a reference cycle, producing a synthetic,
//  stack-traceless `TypeError` that bubbles to `window.onerror`:
//   - `Converting circular structure to JSON` — every `JSON.stringify` in our
//     code serializes a plain object, never a DOM node, so this is never ours.
//
// None of these strings appear anywhere in our code, so matching on them only
// ever drops third-party noise, never a genuine site error.
const NOISE_SIGNATURES = [
  'Object Not Found Matching Id',
  'MethodName:update',
  '__firefox__',
  '_AutofillCallbackHandler',
  'webkit.messageHandlers',
  'instantSearchSDKJSBridgeClearHighlight',
  "Can't find variable: gmo",
  'Converting circular structure to JSON',
]

// Drop $exception events whose type or message matches a known noise signature.
// Returning null tells posthog-js not to send the event.
function dropInjectedNoise(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== '$exception') return event

  const exceptions = event.properties?.$exception_list
  if (!Array.isArray(exceptions)) return event

  const isNoise = exceptions.some((ex: { type?: unknown; value?: unknown }) => {
    const type = typeof ex?.type === 'string' ? ex.type : ''
    const value = typeof ex?.value === 'string' ? ex.value : ''
    const haystack = `${type} ${value}`
    return NOISE_SIGNATURES.some((sig) => haystack.includes(sig))
  })

  return isNoise ? null : event
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
    before_send: dropInjectedNoise,
    debug: process.env.NODE_ENV === 'development',
  })
}
