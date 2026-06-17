'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { MAX_AMOUNT, MIN_AMOUNT } from './shared'

type Preset = { amount: number; label: string }

// Loaded once per page. The publishable key is safe to expose to the browser.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

// Stripe Elements render inside a cross-origin iframe, so our CSS variables and
// self-hosted fonts don't reach them — brand colours have to be passed as
// literals (see tailwind.config.ts), and the body font (Plus Jakarta Sans) must
// be loaded into the iframe explicitly via the `fonts` option below. `inherit`
// does NOT work here; it falls back to a serif default.
const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#1D5337', // forest-500
    colorText: '#1A1410', // ink
    colorDanger: '#D87F58', // clay-300
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    borderRadius: '14px',
    spacingUnit: '4px',
  },
}

// Loaded into the Element's iframe so the form matches the site's body font.
const fonts = [
  {
    cssSrc:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
]

export function DonateForm({
  locationSlug,
  locationName,
  presets,
}: {
  locationSlug: string
  locationName: string
  presets: Preset[]
}) {
  const [amount, setAmount] = useState<number | null>(presets[0]?.amount ?? null)
  const [custom, setCustom] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const customActive = custom.trim() !== ''
  const effectiveAmount = customActive ? Number(custom) : amount

  async function startPayment() {
    setError(null)
    if (!effectiveAmount || !Number.isFinite(effectiveAmount)) {
      setError('Choose or enter an amount to give.')
      return
    }
    if (effectiveAmount < MIN_AMOUNT || effectiveAmount > MAX_AMOUNT) {
      setError(`Please enter an amount between $${MIN_AMOUNT} and $${MAX_AMOUNT.toLocaleString()}.`)
      return
    }
    setStarting(true)
    try {
      const res = await fetch('/api/donate/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, locationSlug, locationName }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || 'Could not start the payment.')
      }
      setClientSecret(data.clientSecret)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  if (!stripePromise) {
    return (
      <p className="text-center text-base text-muted py-6">
        Online payments aren’t set up yet — please see one of our team at the counter. Sorry!
      </p>
    )
  }

  // Step 2 — embedded card / wallet form, shown once we have a client secret.
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance, fonts }}>
        <CheckoutForm
          amount={effectiveAmount as number}
          onBack={() => {
            setClientSecret(null)
            setError(null)
          }}
        />
      </Elements>
    )
  }

  // Step 1 — choose an amount.
  return (
    <div>
      <p className="eyebrow mb-4">Tonight, I’d like to give</p>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => {
          const selected = !customActive && amount === preset.amount
          return (
            <button
              key={preset.amount}
              type="button"
              onClick={() => {
                setAmount(preset.amount)
                setCustom('')
                setError(null)
              }}
              aria-pressed={selected}
              className={`group rounded-2xl border px-4 py-5 text-center transition-all duration-200 active:scale-[0.98] ${
                selected
                  ? 'border-forest-500 bg-forest-500 text-cream-50 shadow-lg'
                  : 'border-line/25 hover:border-forest-500'
              }`}
            >
              <span className="display block text-3xl font-medium leading-tight">
                ${preset.amount}
              </span>
              <span
                className={`mt-1 block text-xs leading-snug transition-colors ${
                  selected ? 'text-cream-50/80' : 'text-muted'
                }`}
              >
                {preset.label}
              </span>
            </button>
          )
        })}
      </div>

      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-line/25 px-4 py-3 focus-within:border-forest-500 transition-colors">
        <span className="display text-2xl text-muted">$</span>
        <input
          type="number"
          inputMode="decimal"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          placeholder="Other amount"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value)
            setError(null)
          }}
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted/70"
        />
      </label>

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="button"
        onClick={startPayment}
        disabled={starting}
        className="btn-primary w-full justify-center mt-5 py-4 text-base disabled:opacity-60"
      >
        {starting ? 'One moment…' : `Continue${effectiveAmount ? ` — $${effectiveAmount.toLocaleString()}` : ''} →`}
      </button>

      <p className="mt-5 text-xs text-muted/85 text-center leading-relaxed">
        Secure payment by Stripe — card, Apple Pay or Google Pay.
        <span className="block mt-1">No amount is too small. Koha of any size is welcome.</span>
      </p>
    </div>
  )
}

function CheckoutForm({ amount, onBack }: { amount: number; onBack: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      // Wallets (Apple/Google Pay) may need a redirect; cards usually don't.
      // `if_required` keeps card payments on-page and only redirects when the
      // payment method demands it.
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/dine-with-us/pay/thanks`,
      },
    })

    if (submitError) {
      setError(submitError.message || 'Your payment could not be completed.')
      setSubmitting(false)
      return
    }

    // No redirect was needed — send the diner to the thank-you page ourselves,
    // carrying the PaymentIntent id so it can confirm and offer to leave a note.
    if (paymentIntent) {
      router.push(`/dine-with-us/pay/thanks?payment_intent=${paymentIntent.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-baseline justify-between mb-5">
        <p className="eyebrow">Giving ${amount.toLocaleString()}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted hover:text-content transition-colors"
        >
          ← Change amount
        </button>
      </div>

      <PaymentElement />

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="btn-primary w-full justify-center mt-6 py-4 text-base disabled:opacity-60"
      >
        {submitting ? 'Processing…' : `Give $${amount.toLocaleString()} →`}
      </button>

      <p className="mt-5 text-xs text-muted/85 text-center leading-relaxed">
        Secure payment by Stripe. Your card details never touch our servers.
      </p>
    </form>
  )
}
