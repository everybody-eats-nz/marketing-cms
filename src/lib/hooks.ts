'use client'

import { useSyncExternalStore } from 'react'

// A subscription that never fires — pairs with useSyncExternalStore to read a
// value that differs between server and client but never changes after mount.
const emptySubscribe = () => () => {}

/**
 * `false` on the server and for the hydration render, `true` immediately
 * after. Replaces the `useEffect(() => setMounted(true), [])` pattern without
 * the extra post-paint render pass.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

function subscribeToRootClass(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

/**
 * Whether the class-based dark theme is active. `false` on the server; on the
 * client it tracks the `dark` class on <html> via a MutationObserver, so it
 * stays correct however the theme gets flipped (ThemeToggle, the styleguide
 * segmented control, or <ThemeScript> pre-paint).
 */
export function useIsDark(): boolean {
  return useSyncExternalStore(
    subscribeToRootClass,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  )
}
