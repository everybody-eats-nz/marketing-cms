import React from 'react'

// Renders plain text supporting *em* markers and \n line breaks.
// Optional highlightWord wraps the first non-em occurrence with the sun-underline span.
// Optional emClassName is applied to the *asterisk* emphasis — used on the dark
// pay/donate pages to colour it (e.g. the gold "text-sun-200" accent).
export function renderRichText(text: string | undefined, highlight?: string, emClassName?: string) {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g)
    const rendered = parts.map((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={key} className={emClassName}>
            {part.slice(1, -1)}
          </em>
        )
      }
      return renderWithHighlight(part, highlight, key)
    })
    return (
      <React.Fragment key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    )
  })
}

function renderWithHighlight(text: string, highlight: string | undefined, key: string) {
  if (!highlight) return <React.Fragment key={key}>{text}</React.Fragment>
  const idx = text.indexOf(highlight)
  if (idx === -1) return <React.Fragment key={key}>{text}</React.Fragment>
  return (
    <React.Fragment key={key}>
      {text.slice(0, idx)}
      <span className="relative inline-block">
        {highlight}
        <span
          className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-sun-200 -z-10 rounded-full"
          aria-hidden
        />
      </span>
      {text.slice(idx + highlight.length)}
    </React.Fragment>
  )
}
