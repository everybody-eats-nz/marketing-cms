// Recovery for post-deploy `ChunkLoadError`s.
//
// The site ships as a single container that's replaced wholesale on every
// deploy: `next build` emits content-hashed chunk filenames, and the previous
// build's `/_next/static/chunks/*` assets vanish the moment the new container
// takes over — there's no CDN retaining old builds. A visitor who loaded the
// page before a deploy (or whose browser prefetched a route from the old build)
// then requests a chunk URL that no longer exists, gets a 404, and Turbopack's
// runtime surfaces it as an uncaught `ChunkLoadError` — leaving the page without
// the JS it needs to continue. This is exactly the recurring production error
// seen across browsers and routes (`/`, `/our-story`, `/impact`).
//
// The recovery is a one-shot hard reload: re-fetching the current HTML pulls in
// the new build's asset URLs, so the retry resolves. It's guarded against
// reload loops — if a reload was just attempted and the chunk is *still*
// unreachable (a genuine outage rather than a stale deploy), we stop reloading
// and let the error surface to error tracking instead of spinning.

const RELOAD_GUARD_KEY = 'ee:chunk-reload-at'

// A stale-deploy reload resolves on the first retry, so a second failure inside
// this window means the asset is genuinely missing — stop rather than loop.
const RELOAD_GUARD_WINDOW_MS = 10_000

function isChunkLoadError(reason: unknown): boolean {
  if (!reason) return false

  if (typeof reason === 'object' && (reason as { name?: unknown }).name === 'ChunkLoadError') {
    return true
  }

  const message =
    typeof reason === 'string'
      ? reason
      : typeof (reason as { message?: unknown }).message === 'string'
        ? ((reason as { message: string }).message)
        : ''

  // Turbopack: "Failed to load chunk /_next/static/chunks/<hash>.js from module <id>"
  // webpack:   "Loading chunk 123 failed." / "Loading CSS chunk 45 failed."
  return /Failed to load chunk/i.test(message) || /Loading (?:CSS )?chunk .* failed/i.test(message)
}

function reloadOnce(): void {
  let last = 0
  try {
    last = Number(window.sessionStorage.getItem(RELOAD_GUARD_KEY)) || 0
    // Compare *before* writing so a genuine outage (chunk still missing after a
    // reload) doesn't reload again.
    if (last && Date.now() - last < RELOAD_GUARD_WINDOW_MS) return
    window.sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()))
  } catch {
    // sessionStorage can throw (Safari private mode, blocked storage). Without
    // the guard a reload could loop, so bail instead of reloading blindly.
    return
  }

  window.location.reload()
}

let installed = false

// Install once per full page load. The listeners live on `window`, so they
// persist across client-side (App Router) navigations too — a chunk that fails
// while navigating to a new route is caught just the same.
export function installChunkErrorReloadHandler(): void {
  if (installed || typeof window === 'undefined') return
  installed = true

  // Failed dynamic import()s reject; Turbopack's chunk loader rejects too.
  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) reloadOnce()
  })

  // Errors thrown synchronously (e.g. during hydration) land here. `error` may
  // be absent on some browsers, so fall back to the message string.
  window.addEventListener('error', (event) => {
    if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) reloadOnce()
  })
}
