import type { ReactNode } from 'react'

// Renders a plain-text field, turning inline [label](href) markdown links into
// anchors. External (http) links open in a new tab. Everything else passes
// through untouched, so whitespace-pre-line still handles line breaks.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

export function renderToastText(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match
    const start = match.index ?? 0
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start))
    const external = /^https?:\/\//i.test(href)
    nodes.push(
      <a
        key={start}
        href={href}
        className="toast-inline-link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>,
    )
    lastIndex = start + full.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}
