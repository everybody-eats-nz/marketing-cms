'use client'

import { useState } from 'react'

// Marketing-site newsletter sign-up. Subscribes a reader to the single public
// website list via Campaign Monitor through /api/newsletter — no region split
// (the Auckland/Wellington lists belong to the volunteer portal, not the site).
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
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
      <div className="flex flex-col sm:flex-row gap-3">
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
