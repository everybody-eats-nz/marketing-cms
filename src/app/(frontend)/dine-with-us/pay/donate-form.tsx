'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { useIsDark } from '@/lib/hooks'
import { loadStripe } from '@stripe/stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import {
  DEFAULT_PAY_COPY,
  fillTemplate,
  formatDollars,
  type FormCopy,
  type Preset,
} from '@/lib/pay-copy'

// Loaded once per page. The publishable key is safe to expose to the browser.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// Stripe.js is fetched from js.stripe.com; an ad/content blocker, corporate
// proxy, or flaky network can block it, in which case loadStripe() rejects.
// We .catch() that here so the rejection never goes unhandled (posthog-js has
// capture_exceptions on, so an unhandled rejection reads as an app crash) and
// resolve to null instead, letting the form degrade to a friendly fallback.
const stripePromise = publishableKey
  ? loadStripe(publishableKey).catch(() => null)
  : null

// Stripe Elements render inside a cross-origin iframe, so our CSS variables,
// self-hosted fonts, and `.dark` class don't reach them — brand colours and
// fonts must be passed as literals (see tailwind.config.ts), and the theme has
// to be detected here and handed to Stripe. `fontFamily: 'inherit'` does NOT
// work; it falls back to a serif default.
const FONT = '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif'

// Light theme — bright card on the forest backdrop (cream `--surface`).
const lightAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#1D5337', // forest-500
    colorText: '#1A1410', // ink
    colorDanger: '#D87F58', // clay-300
    fontFamily: FONT,
    borderRadius: '14px',
    spacingUnit: '4px',
  },
}

// Dark theme — matches the near-black `--surface` the card flips to under .dark.
const darkAppearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#9BBDA0', // forest-200 — legible green on dark
    colorBackground: '#121C16', // surface-2 dark (inputs sit above the card)
    colorText: '#F3EDE0', // content dark (cream)
    colorDanger: '#E8A988', // clay-200
    fontFamily: FONT,
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

// The site toggles dark mode by adding `.dark` to <html> (tailwind darkMode:
// 'class'). The Stripe iframe can't observe that, so useIsDark watches it and
// hands Stripe the matching appearance — react-stripe-js applies it live
// (Stripe supports updating appearance without remounting the Element).

// The ?amount= query (e.g. /donate?amount=50), read from window rather than
// useSearchParams to avoid a Suspense boundary requirement at build. Null on
// the server and during hydration; fixed for the life of the page after that.
const emptySubscribe = () => () => {}
const getUrlAmount = () => new URLSearchParams(window.location.search).get('amount')
const getServerUrlAmount = () => null

export function DonateForm({
  locationSlug,
  locationName,
  presets,
  source = 'pay-at-table',
  copy = DEFAULT_PAY_COPY.form,
}: {
  // Location is only set for the pay-at-table flow; omitted for /donate.
  locationSlug?: string
  locationName?: string
  presets: Preset[]
  source?: 'pay-at-table' | 'donation'
  copy?: FormCopy
}) {
  const { minAmount, maxAmount } = copy
  const [amount, setAmount] = useState<number | null>(presets[0]?.amount ?? null)
  const [custom, setCustom] = useState('')
  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDark = useIsDark()
  const appearance = isDark ? darkAppearance : lightAppearance

  // If Stripe.js can't load (blocker / proxy / network), the promise above
  // resolves to null. Track that so we can swap the form for a fallback with a
  // path forward, rather than leaving <Elements> stuck loading forever.
  const [stripeLoadFailed, setStripeLoadFailed] = useState(false)
  useEffect(() => {
    if (!stripePromise) return
    let active = true
    stripePromise.then((stripe) => {
      if (active && !stripe) setStripeLoadFailed(true)
    })
    return () => {
      active = false
    }
  }, [])

  // Prefill from a ?amount= query: select it if it's a preset, otherwise drop
  // it into the custom field. Applied once, during the first render where the
  // URL is readable (right after hydration), then left to the user.
  const urlAmount = useSyncExternalStore(emptySubscribe, getUrlAmount, getServerUrlAmount)
  const [prefillDone, setPrefillDone] = useState(false)
  if (urlAmount !== null && !prefillDone) {
    setPrefillDone(true)
    const a = Number(urlAmount)
    if (Number.isFinite(a) && a > 0) {
      if (presets.some((p) => p.amount === a)) {
        setAmount(a)
        setCustom('')
      } else {
        setCustom(String(a))
      }
    }
  }

  const customActive = custom.trim() !== ''
  const effectiveAmount = customActive ? Number(custom) : amount

  async function startPayment() {
    setError(null)
    if (!effectiveAmount || !Number.isFinite(effectiveAmount)) {
      setError(copy.chooseAmountError)
      return
    }
    if (effectiveAmount < minAmount || effectiveAmount > maxAmount) {
      setError(
        fillTemplate(copy.rangeError, {
          min: formatDollars(minAmount),
          max: formatDollars(maxAmount),
        }),
      )
      return
    }
    setStarting(true)
    try {
      // Confirm Stripe.js actually loaded before advancing to the card step.
      // A slow block (e.g. a stalling proxy) can leave stripePromise unsettled
      // at click time, so the useEffect above may not have flipped the flag yet.
      // Await it here: if it resolved to null, show the fallback rather than
      // rendering <Elements> that would never mount.
      const stripe = await stripePromise
      if (!stripe) {
        setStripeLoadFailed(true)
        return
      }
      const res = await fetch('/api/donate/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: effectiveAmount,
          source,
          ...(locationSlug ? { locationSlug } : {}),
          ...(locationName ? { locationName } : {}),
          email: email.trim() || undefined,
        }),
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
    return <p className="text-center text-base text-muted py-6">{copy.notConfigured}</p>
  }

  // Stripe.js was blocked from loading — an environmental failure, not a broken
  // form. Explain it and offer a refresh (loadStripe memoises its failure, so a
  // fresh page load is the reliable retry).
  if (stripeLoadFailed) {
    return (
      <div className="py-6 text-center">
        <p className="text-base text-muted leading-relaxed">{copy.loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-ghost mt-5"
        >
          {copy.loadErrorRetry}
        </button>
      </div>
    )
  }

  // Step 2 — embedded card / wallet form, shown once we have a client secret.
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance, fonts }}>
        <CheckoutForm
          amount={effectiveAmount as number}
          copy={copy}
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
      <p className="eyebrow mb-4">
        {source === 'donation' ? copy.donationPrompt : copy.payPrompt}
      </p>
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
          min={minAmount}
          max={maxAmount}
          placeholder={copy.otherPlaceholder}
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value)
            setError(null)
          }}
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted/70"
        />
      </label>

      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={copy.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-line/25 px-4 py-3 text-base outline-none focus:border-forest-500 transition-colors placeholder:text-muted/70"
      />

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="button"
        onClick={startPayment}
        disabled={starting}
        className="btn-primary w-full justify-center mt-5 py-4 text-base disabled:opacity-60"
      >
        {starting
          ? copy.oneMomentLabel
          : `${copy.continueLabel}${effectiveAmount ? ` — ${formatDollars(effectiveAmount)}` : ''} →`}
      </button>

      <p className="mt-5 text-xs text-muted/85 text-center leading-relaxed">
        {copy.securityNote1}
        <span className="block mt-1">{copy.securityNote2}</span>
      </p>

      {/* Koha clarification — pay-at-table only. The /donate flow is a genuine
          (tax-deductible) donation, so this GST / "not a donation receipt" note
          must not appear there. */}
      {source === 'pay-at-table' && copy.kohaNote && (
        <p className="mt-3 border-t border-line/15 pt-3 text-[0.7rem] text-muted/70 text-center leading-relaxed">
          {copy.kohaNote}
        </p>
      )}
    </div>
  )
}

function CheckoutForm({
  amount,
  copy,
  onBack,
}: {
  amount: number
  copy: FormCopy
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Whether Apple Pay / Google Pay actually rendered (browser/device support),
  // so the "or pay by card" divider only shows when an express button is there.
  const [hasWallet, setHasWallet] = useState(false)
  // The PaymentElement mounts asynchronously inside its iframe. confirmPayment()
  // requires every Element in the group to have emitted `ready`, and *throws* an
  // IntegrationError if it hasn't — the trigger being a wallet tap (Apple Pay /
  // Google Pay) firing confirm() before the card element finished mounting.
  // Gate confirm() on this so that can't happen.
  const [paymentReady, setPaymentReady] = useState(false)

  // Shared by the card form submit and the express (wallet) buttons.
  async function confirm() {
    if (!stripe || !elements) return
    // Don't confirm until the PaymentElement in this group has mounted —
    // otherwise Stripe throws an IntegrationError (see paymentReady above). A
    // wallet tap can beat the card element's `ready`; bail with a friendly
    // retry rather than crashing.
    if (!paymentReady) {
      setError(copy.confirmError)
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        // Wallets may need a redirect; cards usually don't. `if_required` keeps
        // card payments on-page and only redirects when the method demands it.
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
    } catch {
      // Stripe *throws* (rather than returning submitError) for integration-level
      // failures like confirming against an unmounted Element. posthog-js has
      // capture_exceptions on, so an unhandled rejection reads as an app crash —
      // catch it and degrade to a friendly retry.
      setError(copy.confirmError)
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        confirm()
      }}
    >
      <div className="flex items-baseline justify-between mb-5">
        <p className="eyebrow">{fillTemplate(copy.givingLabel, { amount: formatDollars(amount) })}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted hover:text-content transition-colors"
        >
          ← {copy.changeAmountLabel}
        </button>
      </div>

      {/* Apple Pay / Google Pay first, so they're visible without scrolling.
          Renders nothing on browsers/devices without an available wallet. */}
      <ExpressCheckoutElement
        onConfirm={confirm}
        onReady={(event) => setHasWallet(Boolean(event.availablePaymentMethods))}
      />
      {hasWallet && (
        <div className="my-5 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.15em] text-muted/70">
          <span className="h-px flex-1 bg-line/20" />
          {copy.orPayByCard}
          <span className="h-px flex-1 bg-line/20" />
        </div>
      )}

      {/* Wallets are handled by the express element above, so keep them out of
          the card form to avoid duplicate Apple Pay / Google Pay entries. */}
      <PaymentElement
        onReady={() => setPaymentReady(true)}
        options={{ wallets: { applePay: 'never', googlePay: 'never' } }}
      />

      {error && <p className="mt-4 text-sm text-clay-300">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || !paymentReady || submitting}
        className="btn-primary w-full justify-center mt-6 py-4 text-base disabled:opacity-60"
      >
        {submitting
          ? copy.processingLabel
          : fillTemplate(copy.giveLabel, { amount: formatDollars(amount) })}
      </button>

      <p className="mt-5 text-xs text-muted/85 text-center leading-relaxed">
        {copy.cardSecurityNote}
      </p>
    </form>
  )
}
