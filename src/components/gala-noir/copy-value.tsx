'use client'

import { useEffect, useState } from 'react'

/**
 * A value people need to type somewhere else (e.g. a bank account number),
 * with a Copy button that confirms in place. The value stays selectable text
 * so it still works where the Clipboard API is unavailable.
 */
export function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context, permissions): the value is still
      // on screen to select by hand, so fail quietly.
    }
  }

  return (
    <div className="gn-copy">
      <span className="gn-copy-value select-all">{value}</span>
      <button
        type="button"
        onClick={copy}
        className="gn-copy-button"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </div>
  )
}
