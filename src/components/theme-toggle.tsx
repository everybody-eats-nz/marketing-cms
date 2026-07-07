'use client'

import { useIsDark, useMounted } from '@/lib/hooks'

// Light/dark switch. The actual theme is applied pre-paint by <ThemeScript>;
// this component only reflects + flips the current state and persists the
// explicit choice to localStorage (after which we stop following the OS).
export function ThemeToggle({ className = '' }: { className?: string }) {
  // `dark` tracks the class on <html>, so flipping it below re-renders us.
  const dark = useIsDark()
  const mounted = useMounted()

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* ignore — private mode etc. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${dark ? 'light' : 'dark'} mode` : 'Toggle colour theme'}
      aria-pressed={mounted ? dark : undefined}
      title={mounted ? `Switch to ${dark ? 'light' : 'dark'} mode` : undefined}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full
        border border-line/20 text-content/80 transition-colors duration-200
        hover:bg-content/5 hover:text-content
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-300 ${className}`}
    >
      {/* Sun — shown in dark mode (tap to go light) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[18px] w-[18px] rotate-90 scale-0 opacity-0 transition-all duration-300 ease-expressive dark:rotate-0 dark:scale-100 dark:opacity-100"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
      </svg>
      {/* Moon — shown in light mode (tap to go dark) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="absolute h-[18px] w-[18px] rotate-0 scale-100 opacity-100 transition-all duration-300 ease-expressive dark:-rotate-90 dark:scale-0 dark:opacity-0"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}
