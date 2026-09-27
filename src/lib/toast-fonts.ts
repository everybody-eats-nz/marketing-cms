import { Roboto_Mono } from 'next/font/google'

/**
 * Toast typefaces. Toast's wordmark is a drawn logo (public/toast-logo.svg),
 * not a typeface, so the brand only needs one face: the monospaced utility type
 * that carries every label, heading and figure on the page.
 *
 * Deliberately declared here rather than reused from src/lib/hopper-fonts.ts —
 * Hopper and Toast are sibling Everybody Eats cafes with intentionally similar
 * utility type, but they are separate brands and either one should be able to
 * change its face without silently changing the other.
 */
export const toastMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-toast-mono',
  display: 'swap',
})

/** The Toast font CSS variable, ready to drop onto a wrapping element's className. */
export const toastFontVars = toastMono.variable
