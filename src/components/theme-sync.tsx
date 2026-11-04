'use client'

import { useLayoutEffect } from 'react'
import { applySavedTheme } from '@/lib/theme'

// Client-side backstop for <ThemeScript>. When Next can't server-render a
// response it sends an empty shell and React builds the whole layout in the
// browser, and React never runs a <script> it creates. The main case is a 404:
// a dynamic notFound() always comes back as that shell, so without this a 404
// always showed in light mode. A layout effect runs before the first paint,
// so the right theme shows straight away. On server-rendered pages the class
// is already correct and this does nothing visible.
export function ThemeSync() {
  useLayoutEffect(applySavedTheme, [])
  return null
}
