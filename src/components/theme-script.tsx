// Inline, render-blocking script that applies the saved (or system) theme
// before first paint to avoid a flash of the wrong theme. Kept tiny on purpose.
const script = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
