'use server'

import { getPayloadClient } from '@/lib/payload'

export type EnquiryInput = {
  name: string
  company: string
  email: string
  phone?: string
  enquiryType?: string
  preferredLocation?: string
  eventDate?: string
  headcount?: string
  budget?: string
  message: string
  // Honeypot — must stay empty. Bots fill every field they see.
  website?: string
  // Optional per-block recipient override resolved on the client from the block.
  recipientEmail?: string
}

export type EnquiryResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  // Spam trap: a filled honeypot looks like success to the bot, sends nothing.
  if (input.website && input.website.trim() !== '') return { ok: true }

  const name = input.name?.trim()
  const company = input.company?.trim()
  const email = input.email?.trim()
  const message = input.message?.trim()

  if (!name || !company || !message) {
    return { ok: false, error: 'Please fill in your name, organisation and a short message.' }
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Please enter a valid email address so we can reply.' }
  }

  const payload = await getPayloadClient()

  // Recipient precedence: block override -> site-settings.corporateEmail ->
  // contactEmail -> the configured from-address (so a lead is never lost).
  let recipient = input.recipientEmail?.trim()
  if (!recipient) {
    const settings = (await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)) as any
    recipient = settings?.corporateEmail || settings?.contactEmail || undefined
  }
  recipient = recipient || process.env.RESEND_FROM_ADDRESS || undefined
  if (!recipient) {
    return { ok: false, error: 'Sorry — enquiries are temporarily unavailable. Please email us directly.' }
  }

  const rows: Array<[string, string | undefined]> = [
    ['Name', name],
    ['Organisation', company],
    ['Email', email],
    ['Phone', input.phone?.trim()],
    ['Enquiry type', input.enquiryType?.trim()],
    ['Preferred location', input.preferredLocation?.trim()],
    ['Preferred date', input.eventDate?.trim()],
    ['Approx. headcount', input.headcount?.trim()],
    ['Budget', input.budget?.trim()],
  ]

  const htmlRows = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#5b6b5b;">${k}</td><td style="padding:4px 0;"><strong>${escapeHtml(
          v as string,
        )}</strong></td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#1A1410;max-width:560px;">
      <h2 style="font-weight:600;">New corporate enquiry</h2>
      <table style="border-collapse:collapse;font-size:14px;">${htmlRows}</table>
      <h3 style="margin-top:24px;font-weight:600;">Message</h3>
      <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(message)}</p>
    </div>`

  const textRows = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  const text = `New corporate enquiry\n\n${textRows}\n\nMessage:\n${message}`

  try {
    await payload.sendEmail({
      to: recipient,
      replyTo: email,
      subject: `Corporate enquiry — ${company}${input.enquiryType ? ` (${input.enquiryType})` : ''}`,
      html,
      text,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Failed to send corporate enquiry email')
    return { ok: false, error: 'Something went wrong sending your enquiry. Please try again or email us directly.' }
  }

  await captureAnalytics(email, {
    enquiry_type: input.enquiryType,
    preferred_location: input.preferredLocation,
    company,
    has_date: Boolean(input.eventDate),
    headcount: input.headcount,
  })

  return { ok: true }
}

// Fire-and-forget PostHog capture. No SDK dependency — a plain POST to the
// capture endpoint, guarded by env so it's a no-op until PostHog is configured.
async function captureAnalytics(distinctId: string, properties: Record<string, unknown>) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY
  if (!apiKey) return
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        event: 'corporate_enquiry_submitted',
        distinct_id: distinctId,
        properties,
      }),
    })
  } catch {
    // Analytics must never block or fail an enquiry.
  }
}
