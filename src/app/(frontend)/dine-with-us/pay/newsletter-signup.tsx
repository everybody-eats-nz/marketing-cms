'use client'

import { useState } from 'react'
import { renderRichText } from '@/components/blocks/render-text'
import { DEFAULT_PAY_COPY, type NewsletterCopy } from '@/lib/pay-copy'

// Newsletter sign-up shown on the /thanks page. Subscribes a diner to the
// General Supporters list via Campaign Monitor through /api/newsletter (no
// `lists` in the payload → the route defaults to the general audience; the
// full three-option picker lives on the /newsletter page).
export function NewsletterSignup({
  copy = DEFAULT_PAY_COPY.newsletter,
}: {
  copy?: NewsletterCopy
}) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || copy.errorMessage)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorMessage)
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-[1.75rem] bg-surface text-content p-7 sm:p-9 text-center shadow-2xl">
        <p className="display text-2xl font-light">{copy.successTitle}</p>
        <p className="mt-3 text-sm text-muted leading-relaxed">{copy.successMessage}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-surface text-content p-7 sm:p-9 text-left shadow-2xl"
    >
      <p className="display text-2xl font-light leading-snug">{renderRichText(copy.heading)}</p>
      <p className="mt-2 text-sm text-muted leading-relaxed">{copy.subtitle}</p>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            placeholder={copy.emailPlaceholder}
            className="w-full rounded-2xl border border-line/25 bg-surface-2 px-4 py-3 text-base outline-none focus:border-forest-500 transition-colors"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary justify-center px-6 py-3 disabled:opacity-60"
        >
          {submitting ? copy.sendingLabel : copy.submitLabel}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}
    </form>
  )
}
