import type { Metadata } from 'next'
import { StyleGuide } from './style-guide'

export const metadata: Metadata = {
  title: 'Style guide',
  description: 'Interactive design-system reference for the Everybody Eats marketing site.',
  robots: { index: false, follow: false },
}

// The whole page is interactive (copy-to-clipboard, live theme preview,
// contrast checker, type playground), so it renders client-side. It reads its
// tokens straight from src/styles/brand-tokens.ts — the same module Tailwind
// compiles from — so the reference can never drift from production styles.
export default function StyleGuidePage() {
  return <StyleGuide />
}
