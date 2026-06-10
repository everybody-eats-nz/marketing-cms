import type { ReactNode } from 'react'

// Shared shell for the pay-at-table pages: full-height evening-green backdrop
// with a soft glow. The -mb-32 cancels the site footer's mt-32 (a deliberate
// breathing gap on cream pages) so the dark backdrop runs straight into the
// dark footer instead of showing a cream band.
export function PaySection({
  glow = 'forest',
  children,
}: {
  glow?: 'forest' | 'sun'
  children: ReactNode
}) {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] -mb-32 bg-forest-700 grain overflow-hidden">
      <div
        aria-hidden
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[44rem] rounded-full blur-3xl ${
          glow === 'sun' ? 'bg-sun-200/15' : 'bg-forest-500/50'
        }`}
      />
      {children}
    </section>
  )
}
