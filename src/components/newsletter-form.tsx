'use client'

import { useState } from 'react'
import type { NewsletterListKey } from '@/lib/newsletter'

// Marketing-site newsletter sign-up. Readers pick one or more of the three
// Campaign Monitor audiences (the two regional community letters plus the
// general supporters letter) and /api/newsletter subscribes them to each.
const LIST_OPTIONS: { key: NewsletterListKey; label: string; description: string }[] = [
  {
    key: 'auckland',
    label: 'Auckland Community',
    description: 'What’s happening across our Auckland restaurants.',
  },
  {
    key: 'wellington',
    label: 'Wellington Community',
    description: 'What’s happening across our Wellington restaurants.',
  },
  {
    key: 'general',
    label: 'General Supporters',
    description: 'Stories, impact and ways to help from across Everybody Eats.',
  },
]

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<NewsletterListKey[]>(['general'])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  function toggleList(key: NewsletterListKey) {
    setSelected((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    )
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected.length === 0) {
      setError('Pick at least one newsletter to subscribe to.')
      return
    }
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), lists: selected }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'We couldn’t sign you up just now. Please try again later.')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn’t sign you up just now. Please try again later.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-12 bg-surface-2 rounded-[2rem] p-8 sm:p-10">
        <p className="display text-2xl text-content leading-relaxed">
          You’re on the list. We’ll send the next letter your way <em>soon</em>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 bg-surface-2 rounded-[2rem] p-8 sm:p-10">
      <fieldset>
        <legend className="text-sm font-semibold text-content">Choose your newsletters</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LIST_OPTIONS.map((option) => {
            const checked = selected.includes(option.key)
            return (
              <label
                key={option.key}
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${
                  checked
                    ? 'border-forest-500 bg-forest-500/10 dark:border-forest-300 dark:bg-forest-300/10'
                    : 'border-line/20 bg-surface hover:border-line/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleList(option.key)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded accent-forest-500 dark:accent-forest-300"
                />
                <span>
                  <span className="block text-sm font-semibold text-content">{option.label}</span>
                  <span className="mt-1 block text-xs text-muted leading-relaxed">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            placeholder="you@example.com"
            className="w-full bg-surface border border-line/20 rounded-pill px-5 py-3.5 text-content placeholder-muted/50 focus:outline-none focus:border-line"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary px-7 py-3.5 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-clay-300" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
