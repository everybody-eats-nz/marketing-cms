'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  return (
    <form
      className="mt-12 bg-cream-100 rounded-[2rem] p-8 sm:p-10"
      onSubmit={async (e) => {
        e.preventDefault()
        setStatus('submitting')
        // Wired to your ESP later. For now, simulate a successful subscribe.
        await new Promise((r) => setTimeout(r, 600))
        setStatus('success')
      }}
    >
      {status === 'success' ? (
        <p className="display text-xl text-forest-700 leading-relaxed">
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
              className="w-full bg-cream-50 border border-forest-500/20 rounded-pill px-5 py-3.5 text-forest-700 placeholder-forest-500/50 focus:outline-none focus:border-forest-500"
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
