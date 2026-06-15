'use client'

import { useEffect, useId, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitEnquiry, type EnquiryInput } from '@/app/(frontend)/actions/enquiry'
import { renderRichText } from '@/components/blocks/render-text'
import { DatePicker } from '@/components/date-picker'

type Tone = 'forest' | 'cream'

type Props = {
  tone: Tone
  enquiryTypes: string[]
  successMessage: string
  recipientEmail?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EnquiryForm({ tone, enquiryTypes, successMessage, recipientEmail }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const formId = useId()

  // Pre-select the enquiry type from a ?type= param (e.g. when linked from an
  // "Enquire" card on the same page), falling back to the first option.
  const searchParams = useSearchParams()
  const paramType = searchParams.get('type') || ''
  const [selectedType, setSelectedType] = useState(() =>
    enquiryTypes.includes(paramType) ? paramType : enquiryTypes[0] || '',
  )
  useEffect(() => {
    if (paramType && enquiryTypes.includes(paramType)) setSelectedType(paramType)
  }, [paramType, enquiryTypes])

  const isForest = tone === 'forest'

  const labelCls = `block text-sm font-medium mb-2 ${
    isForest ? 'text-cream-50/80' : 'text-forest-700/80 dark:text-content/80'
  }`
  const fieldCls = `w-full rounded-2xl px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
    isForest
      ? 'bg-forest-600 text-cream-50 placeholder:text-cream-50/40 border border-cream-50/10 focus:ring-sun-200/60 focus:border-cream-50/30'
      : 'bg-cream-50 text-forest-700 placeholder:text-forest-600/40 border border-forest-500/15 focus:ring-forest-500/40 focus:border-forest-500/40 dark:bg-surface dark:text-content dark:border-line/20 dark:placeholder:text-muted/50'
  }`
  const reqMark = (
    <span className={isForest ? 'text-sun-200' : 'text-forest-500'} aria-hidden>
      {' '}
      *
    </span>
  )

  if (status === 'success') {
    return (
      <div
        role="status"
        className={`rounded-[2rem] p-8 sm:p-10 ${
          isForest
            ? 'bg-forest-600 text-cream-50'
            : 'bg-cream-50 text-forest-700 border border-forest-500/10 dark:bg-surface dark:text-content dark:border-line/15'
        }`}
      >
        <div
          className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full ${
            isForest ? 'bg-sun-200 text-forest-700' : 'bg-forest-500 text-cream-50'
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="display text-2xl sm:text-3xl font-light leading-snug">
          {renderRichText(successMessage)}
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const input: EnquiryInput = {
      name: String(fd.get('name') || ''),
      company: String(fd.get('company') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      enquiryType: String(fd.get('enquiryType') || ''),
      eventDate: String(fd.get('eventDate') || ''),
      headcount: String(fd.get('headcount') || ''),
      budget: String(fd.get('budget') || ''),
      message: String(fd.get('message') || ''),
      website: String(fd.get('website') || ''),
      recipientEmail,
    }

    if (!input.name.trim() || !input.company.trim() || !input.message.trim()) {
      setError('Please fill in your name, organisation and a short message.')
      return
    }
    if (!EMAIL_RE.test(input.email.trim())) {
      setError('Please enter a valid email address so we can reply.')
      return
    }

    setStatus('submitting')
    const result = await submitEnquiry(input)
    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('idle')
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this empty</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className={labelCls}>
            Your name{reqMark}
          </label>
          <input id={`${formId}-name`} name="name" type="text" required autoComplete="name" className={fieldCls} placeholder="Jordan Smith" />
        </div>
        <div>
          <label htmlFor={`${formId}-company`} className={labelCls}>
            Organisation{reqMark}
          </label>
          <input id={`${formId}-company`} name="company" type="text" required autoComplete="organization" className={fieldCls} placeholder="Acme Co." />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className={labelCls}>
            Email{reqMark}
          </label>
          <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" inputMode="email" className={fieldCls} placeholder="jordan@acme.co" />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className={labelCls}>
            Phone
          </label>
          <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" className={fieldCls} placeholder="021 234 5678" />
        </div>
        {enquiryTypes.length > 0 && (
          <div>
            <label htmlFor={`${formId}-type`} className={labelCls}>
              What can we help with?
            </label>
            <select
              id={`${formId}-type`}
              name="enquiryType"
              className={`${fieldCls} appearance-none`}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {enquiryTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={`${formId}-date`} className={labelCls}>
            Preferred date
          </label>
          <DatePicker id={`${formId}-date`} name="eventDate" tone={tone} fieldClassName={fieldCls} />
        </div>
        <div>
          <label htmlFor={`${formId}-headcount`} className={labelCls}>
            Approx. headcount
          </label>
          <input id={`${formId}-headcount`} name="headcount" type="text" inputMode="numeric" className={fieldCls} placeholder="40" />
        </div>
        <div>
          <label htmlFor={`${formId}-budget`} className={labelCls}>
            Budget (optional)
          </label>
          <input id={`${formId}-budget`} name="budget" type="text" className={fieldCls} placeholder="$2,000–5,000" />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelCls}>
          Tell us about your event{reqMark}
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={4}
          className={fieldCls}
          placeholder="What are you planning, and how can we help make it happen?"
        />
      </div>

      {error && (
        <p
          role="alert"
          className={`text-sm ${isForest ? 'text-sun-200' : 'text-clay-300 dark:text-clay-200'}`}
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`${isForest ? 'btn-accent' : 'btn-primary'} px-8 py-3.5 disabled:opacity-60`}
        >
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className={`text-xs ${isForest ? 'text-cream-50/55' : 'text-forest-700/55 dark:text-muted/70'}`}>
          We reply within two working days.
        </p>
      </div>
    </form>
  )
}
