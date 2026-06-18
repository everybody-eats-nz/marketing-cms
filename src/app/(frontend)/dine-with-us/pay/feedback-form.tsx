'use client'

import { useState } from 'react'
import { DEFAULT_PAY_COPY, type FeedbackCopy } from '@/lib/pay-copy'

// Optional comment step shown after a successful payment on the /thanks page.
// Posts to /api/feedback, which classifies sentiment with AI and auto-publishes
// positive, consented notes to the restaurant page (and the volunteer portal).
export function FeedbackForm({
  stripePaymentIntentId,
  locationSlug,
  locationName,
  copy = DEFAULT_PAY_COPY.feedback,
}: {
  stripePaymentIntentId?: string
  locationSlug?: string
  locationName?: string
  copy?: FeedbackCopy
}) {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<null | { published: boolean }>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      setError(copy.emptyError)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          name: name.trim() || undefined,
          rating: rating ?? undefined,
          consentToDisplay: consent,
          stripePaymentIntentId,
          locationSlug,
          locationName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save your note.')
      setDone({ published: Boolean(data.published) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-[1.75rem] bg-surface text-content p-7 sm:p-9 text-center shadow-2xl">
        <p className="display text-2xl font-light">{copy.doneTitle}</p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {done.published ? copy.donePublished : copy.doneUnpublished}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-surface text-content p-7 sm:p-9 text-left shadow-2xl"
    >
      <p className="eyebrow mb-1">
        {copy.heading} <span className="text-muted normal-case">{copy.optionalLabel}</span>
      </p>
      <p className="text-sm text-muted mb-5 leading-relaxed">{copy.subtitle}</p>

      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          setError(null)
        }}
        rows={3}
        maxLength={2000}
        placeholder={copy.placeholder}
        className="w-full rounded-2xl border border-line/25 bg-surface-2 px-4 py-3 text-base outline-none focus:border-forest-500 transition-colors resize-none"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label={copy.ratingLabel}
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              // Fill cumulatively up to the hovered star (preview) or the
              // selected rating — so hovering the rightmost star lights all
              // five, making clear that right = 5 = best.
              const active = hoverRating ?? rating ?? 0
              const filled = star <= active
              return (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(null)}
                  onClick={() => setRating(rating === star ? null : star)}
                  className={`text-2xl leading-none transition-colors ${
                    filled ? 'text-sun-400' : 'text-line/50'
                  }`}
                >
                  ★
                </button>
              )
            })}
          </div>
          <span className="text-xs text-muted tabular-nums w-14">
            {(hoverRating ?? rating) ? `${hoverRating ?? rating}/5` : ''}
          </span>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder={copy.namePlaceholder}
          className="flex-1 min-w-[10rem] rounded-2xl border border-line/25 bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-forest-500 transition-colors"
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-content/80 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-forest-500"
        />
        <span>{copy.consentLabel}</span>
      </label>

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center mt-5 py-3.5 disabled:opacity-60"
      >
        {submitting ? copy.sendingLabel : copy.submitLabel}
      </button>
    </form>
  )
}
