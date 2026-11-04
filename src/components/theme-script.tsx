import { applySavedTheme } from '@/lib/theme'

// Inline, render-blocking script that applies the saved (or system) theme
// before first paint to avoid a flash of the wrong theme. Kept tiny on purpose.
const script = `(${applySavedTheme.toString()})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
