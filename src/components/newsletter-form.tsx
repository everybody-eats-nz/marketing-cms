'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  return (
    <form
      className="mt-12 bg-surface-2 rounded-[2rem] p-8 sm:p-10"
      onSubmit={async (e) => {
        e.preventDefault()
        setStatus('submitting')
        // Wired to your ESP later. For now, simulate a successful subscribe.
        await new Promise((r) => setTimeout(r, 600))
        setStatus('success')
      }}
    >
      {status === 'success' ? (
        <p className="display text-xl text-content leading-relaxed">
          Thanks. We'll send the next letter your way <em>soon</em>.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Email</span>
            <input
              type="email"
              required
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
      )}
    </form>
  )
}
