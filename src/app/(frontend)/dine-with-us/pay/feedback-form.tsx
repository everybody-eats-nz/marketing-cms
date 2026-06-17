'use client'

import { useState } from 'react'

// Optional comment step shown after a successful payment on the /thanks page.
// Posts to /api/feedback, which classifies sentiment with AI and auto-publishes
// positive, consented notes to the restaurant page (and the volunteer portal).
export function FeedbackForm({
  stripePaymentIntentId,
  locationSlug,
  locationName,
}: {
  stripePaymentIntentId?: string
  locationSlug?: string
  locationName?: string
}) {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<null | { published: boolean }>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      setError('Write a few words first.')
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
        <p className="display text-2xl font-light">Thank you for the kind words.</p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {done.published
            ? 'With your blessing, your note may appear on our restaurant page and be shared with the team who cooked for you.'
            : 'We’ve passed your note to the team who cooked for you tonight.'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-surface text-content p-7 sm:p-9 text-left shadow-2xl"
    >
      <p className="eyebrow mb-1">Leave a note <span className="text-muted normal-case">— optional</span></p>
      <p className="text-sm text-muted mb-5 leading-relaxed">
        How was tonight? A line about your meal helps our volunteers and future diners.
      </p>

      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          setError(null)
        }}
        rows={3}
        maxLength={2000}
        placeholder="The food, the welcome, the room…"
        className="w-full rounded-2xl border border-line/25 bg-cream-50/40 px-4 py-3 text-base outline-none focus:border-forest-500 transition-colors resize-none"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating out of five">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              onClick={() => setRating(rating === star ? null : star)}
              className={`text-2xl leading-none transition-colors ${
                rating && star <= rating ? 'text-sun-400' : 'text-line/50 hover:text-sun-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder="First name (optional)"
          className="flex-1 min-w-[10rem] rounded-2xl border border-line/25 bg-cream-50/40 px-4 py-2.5 text-sm outline-none focus:border-forest-500 transition-colors"
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-content/80 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-forest-500"
        />
        <span>OK to share my note publicly with my first name on the Everybody Eats website.</span>
      </label>

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center mt-5 py-3.5 disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Share your note'}
      </button>
    </form>
  )
}
