// Applies the saved (or system) colour theme by toggling `dark` on <html>.
//
// Single source for both paths that run it:
// - <ThemeScript> serialises it with toString() into an inline, render-blocking
//   script, so server-rendered pages paint in the right theme.
// - <ThemeSync> calls it on the client, for pages React builds in the browser
//   (React never executes a <script> it creates itself).
//
// Keep it self-contained: no imports or outer variables, since the serialised
// copy runs on its own.
export function applySavedTheme() {
  try {
    const saved = localStorage.getItem('theme')
    const dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    /* storage blocked (private mode etc.) - keep the default theme */
  }
}
