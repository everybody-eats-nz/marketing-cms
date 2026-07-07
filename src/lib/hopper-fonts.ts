import localFont from 'next/font/local'
import { Roboto_Mono } from 'next/font/google'

/**
 * Hopper Cafe typefaces, shared between the /hopper route group and the
 * homepage takeover overlay so the bubbly wordmark + monospace utility type
 * render identically wherever Hopper's brand appears. Defined once here (rather
 * than per-layout) so both entry points load the exact same font instance.
 */
export const hopperDisplay = localFont({
  // Adigiana Toybox — the Hopper logotype face (self-hosted, same pattern as
  // Fraunces on the main site).
  src: '../../public/fonts/AdigianaToybox.ttf',
  variable: '--font-hopper-display',
  display: 'swap',
})

// Everything else on the poster is monospaced caps.
export const hopperMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-hopper-mono',
  display: 'swap',
})

/** Both Hopper font CSS variables, ready to drop onto a wrapping element's className. */
export const hopperFontVars = `${hopperDisplay.variable} ${hopperMono.variable}`
