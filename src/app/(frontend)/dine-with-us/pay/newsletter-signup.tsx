'use client'

import { useState } from 'react'
import { renderRichText } from '@/components/blocks/render-text'
import { DEFAULT_PAY_COPY, type NewsletterCopy } from '@/lib/pay-copy'
import { NEWSLETTER_REGIONS, type NewsletterRegion } from '@/lib/newsletter'

// Newsletter sign-up shown on the /thanks page. Lets a diner join the Auckland
// or Wellington list — subscribed via Campaign Monitor through /api/newsletter,
// the same audiences the volunteer portal feeds.
export function NewsletterSignup({
  defaultRegion,
  copy = DEFAULT_PAY_COPY.newsletter,
}: {
  // Pre-selected region (e.g. inferred from where the diner ate). Optional.
  defaultRegion?: NewsletterRegion
  copy?: NewsletterCopy
}) {
  const [region, setRegion] = useState<NewsletterRegion | null>(defaultRegion ?? null)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const regionLabels: Record<NewsletterRegion, string> = {
    auckland: copy.aucklandLabel,
    wellington: copy.wellingtonLabel,
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!region) {
      setError(copy.regionError)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), region }),
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

      <fieldset className="mt-5">
        <legend className="eyebrow mb-2">{copy.regionLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {NEWSLETTER_REGIONS.map((r) => {
            const selected = region === r
            return (
              <button
                key={r}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setRegion(r)
                  setError(null)
                }}
                className={`rounded-pill px-5 py-2.5 text-sm font-medium border transition-colors ${
                  selected
                    ? 'bg-forest-500 border-forest-500 text-cream-50'
                    : 'bg-surface-2 border-line/25 text-content hover:border-forest-500'
                }`}
              >
                {regionLabels[r]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
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
