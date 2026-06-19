// Editable copy + amounts for the donation and pay-at-table flows.
//
// This module is CLIENT-SAFE (no server imports) so client components like
// DonateForm / FeedbackForm can import the types and DEFAULT_PAY_COPY. The
// server-side fetch (reading the `pay-settings` global) lives in
// ./pay-copy.server.ts.
//
// How it fits together: the `pay-settings` Payload global lets the team edit
// every string and the preset amounts in /admin. Fields left blank in the
// admin fall back to the DEFAULT_PAY_COPY values below (mergePayCopy handles
// the overlay), so the defaults here stay the single source of truth for the
// out-of-the-box copy — there's no need to also set defaultValue on the global
// fields.

export type Preset = { amount: number; label: string }

export type FormCopy = {
  minAmount: number
  maxAmount: number
  donationPrompt: string
  payPrompt: string
  otherPlaceholder: string
  emailPlaceholder: string
  chooseAmountError: string
  // Templates — {min} / {max} are replaced with the formatted dollar amounts.
  rangeError: string
  notConfigured: string
  continueLabel: string
  oneMomentLabel: string
  securityNote1: string
  securityNote2: string
  // Shown only in the pay-at-table flow: clarifies the payment is koha (a gift) —
  // GST-free, and not a tax-deductible donation receipt. Not shown on /donate.
  kohaNote: string
  // {amount} is replaced with the formatted dollar amount.
  givingLabel: string
  changeAmountLabel: string
  orPayByCard: string
  giveLabel: string
  processingLabel: string
  cardSecurityNote: string
}

export type FeedbackCopy = {
  heading: string
  optionalLabel: string
  subtitle: string
  placeholder: string
  ratingLabel: string
  namePlaceholder: string
  consentLabel: string
  emptyError: string
  submitLabel: string
  sendingLabel: string
  doneTitle: string
  donePublished: string
  doneUnpublished: string
}

export type NewsletterCopy = {
  heading: string
  subtitle: string
  emailPlaceholder: string
  submitLabel: string
  sendingLabel: string
  errorMessage: string
  successTitle: string
  successMessage: string
}

export type PayCopy = {
  amounts: {
    presets: Preset[]
    minAmount: number
    maxAmount: number
  }
  picker: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    heading: string
    subheading: string
    specialEventsLabel: string
    securityNote: string
  }
  payment: {
    // {location} is replaced with the restaurant name.
    metaTitle: string
    metaDescription: string
    eyebrowLocation: string
    eyebrowSpecial: string
    heading: string
    explanation: string
    changeRestaurant: string
  }
  form: FormCopy
  newsletter: NewsletterCopy
  thanks: {
    metaTitle: string
    eyebrow: string
    heading: string
    // {amount} / {location} / {email} are replaced at render time.
    messageWithLocation: string
    messageNoLocation: string
    messageFallback: string
    receiptNote: string
    // Shown only for pay-at-table payments: koha is GST-free and not a donation
    // receipt. Not shown for /donate confirmations.
    kohaNote: string
    bookLabel: string
    otherWaysLabel: string
    closing: string
  }
  feedback: FeedbackCopy
}

// Default copy — mirrors what was previously hardcoded in the pay/donate pages
// and forms. Headings use the *asterisk* italic convention (see renderRichText).
export const DEFAULT_PAY_COPY: PayCopy = {
  amounts: {
    presets: [
      { amount: 25, label: 'Covers tonight’s meal' },
      { amount: 35, label: 'A meal, plus a little extra' },
      { amount: 50, label: 'Yours — and one paid forward' },
      { amount: 100, label: 'Feeds the whole table' },
    ],
    // Guard rails for the custom ("Other") amount, in whole dollars. Mirrored
    // server-side in /api/donate/create-intent, which reads the same global.
    minAmount: 1,
    maxAmount: 100_000,
  },
  picker: {
    metaTitle: 'Pay what you feel',
    metaDescription:
      'Thank you for dining with us. Choose the restaurant you visited tonight and pay what feels right.',
    eyebrow: 'Pay what you feel',
    heading: 'Thank you for *dining* with us',
    subheading: 'Where did you join us tonight?',
    specialEventsLabel: 'A special event or pop-up dinner',
    securityNote: 'Payments are processed securely by Stripe. Apple Pay and Google Pay accepted.',
  },
  payment: {
    metaTitle: 'Pay what you feel — {location}',
    metaDescription: 'Choose what to pay for tonight’s meal. Every dollar keeps the kitchen open.',
    eyebrowLocation: 'Everybody Eats {location}',
    eyebrowSpecial: 'Everybody Eats · Special event',
    heading: 'Pay what feels *right*',
    explanation:
      'Whatever you can give tonight makes a difference. A three-course meal like yours typically costs *$25–$35* to put on the table — anything beyond that shouts dinner for someone who can’t.',
    changeRestaurant: 'Not where you dined? Change restaurant',
  },
  form: {
    minAmount: 1,
    maxAmount: 100_000,
    donationPrompt: 'I’d like to give',
    payPrompt: 'Tonight, I’d like to give',
    otherPlaceholder: 'Other amount',
    emailPlaceholder: 'Email for a receipt (optional)',
    chooseAmountError: 'Choose or enter an amount to give.',
    rangeError: 'Please enter an amount between {min} and {max}.',
    notConfigured:
      'Online payments aren’t set up yet — please see one of our team at the counter. Sorry!',
    continueLabel: 'Continue',
    oneMomentLabel: 'One moment…',
    securityNote1: 'Secure payment by Stripe — card, Apple Pay or Google Pay.',
    securityNote2: 'No amount is too small. Koha of any size is welcome.',
    kohaNote:
      'Your koha is a gift, so it’s GST-free — you’ll get a payment confirmation, not a tax-deductible donation receipt.',
    givingLabel: 'Giving {amount}',
    changeAmountLabel: 'Change amount',
    orPayByCard: 'or pay by card',
    giveLabel: 'Give {amount} →',
    processingLabel: 'Processing…',
    cardSecurityNote: 'Secure payment by Stripe. Your card details never touch our servers.',
  },
  newsletter: {
    heading: 'Stay in the *loop*',
    subtitle: 'Get the occasional note about dinners, events and good news from Everybody Eats.',
    emailPlaceholder: 'you@example.com',
    submitLabel: 'Sign me up',
    sendingLabel: 'Signing up…',
    errorMessage: 'We couldn’t sign you up just now. Please try again later.',
    successTitle: 'You’re on the list.',
    successMessage: 'Thanks — keep an eye on your inbox for the next letter.',
  },
  thanks: {
    metaTitle: 'Thank you',
    eyebrow: 'Pay what you feel',
    heading: 'Thank *you*',
    messageWithLocation:
      'Your *{amount}* goes straight back into the kitchen at {location} — rescuing food, training chefs, and keeping seats at the table for everyone.',
    messageNoLocation:
      'Your *{amount}* goes straight back into the kitchen — rescuing food, training chefs, and keeping seats at the table for everyone.',
    messageFallback:
      'Your contribution goes straight back into the kitchen — rescuing food, training chefs, and keeping seats at the table for everyone.',
    receiptNote: 'A receipt is on its way to {email} from Stripe.',
    kohaNote:
      'Your koha is a gift — it’s GST-free and isn’t a tax-deductible donation receipt.',
    bookLabel: 'Book your next dinner',
    otherWaysLabel: 'Other ways to help',
    closing: 'See you at the table again soon.',
  },
  feedback: {
    heading: 'Leave a note',
    optionalLabel: '— optional',
    subtitle: 'How was tonight? A line about your meal helps our volunteers and future diners.',
    placeholder: 'The food, the welcome, the room…',
    ratingLabel: 'Rating out of five',
    namePlaceholder: 'First name (optional)',
    consentLabel: 'OK to share my note publicly with my first name on the Everybody Eats website.',
    emptyError: 'Write a few words first.',
    submitLabel: 'Share your note',
    sendingLabel: 'Sending…',
    doneTitle: 'Thank you for the kind words.',
    donePublished:
      'With your blessing, your note may appear on our restaurant page and be shared with the team who cooked for you.',
    doneUnpublished: 'We’ve passed your note to the team who cooked for you tonight.',
  },
}

// Pick a string only if it's a non-blank override, else fall back to default.
function s(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

// Overlay a (possibly null / partial) `pay-settings` global onto the defaults.
// Named tabs in the global mean its data is nested under the same keys as
// PayCopy (amounts / picker / payment / form / thanks / feedback).
export function mergePayCopy(global: any): PayCopy {
  const d = DEFAULT_PAY_COPY
  const g = global ?? {}

  const presets: Preset[] =
    Array.isArray(g.amounts?.presets) && g.amounts.presets.length > 0
      ? g.amounts.presets
          .filter((p: any) => typeof p?.amount === 'number' && Number.isFinite(p.amount))
          .map((p: any) => ({ amount: p.amount, label: s(p.label, '') }))
      : d.amounts.presets

  const minAmount = num(g.amounts?.minAmount, d.amounts.minAmount)
  const maxAmount = num(g.amounts?.maxAmount, d.amounts.maxAmount)

  return {
    amounts: { presets: presets.length > 0 ? presets : d.amounts.presets, minAmount, maxAmount },
    picker: {
      metaTitle: s(g.picker?.metaTitle, d.picker.metaTitle),
      metaDescription: s(g.picker?.metaDescription, d.picker.metaDescription),
      eyebrow: s(g.picker?.eyebrow, d.picker.eyebrow),
      heading: s(g.picker?.heading, d.picker.heading),
      subheading: s(g.picker?.subheading, d.picker.subheading),
      specialEventsLabel: s(g.picker?.specialEventsLabel, d.picker.specialEventsLabel),
      securityNote: s(g.picker?.securityNote, d.picker.securityNote),
    },
    payment: {
      metaTitle: s(g.payment?.metaTitle, d.payment.metaTitle),
      metaDescription: s(g.payment?.metaDescription, d.payment.metaDescription),
      eyebrowLocation: s(g.payment?.eyebrowLocation, d.payment.eyebrowLocation),
      eyebrowSpecial: s(g.payment?.eyebrowSpecial, d.payment.eyebrowSpecial),
      heading: s(g.payment?.heading, d.payment.heading),
      explanation: s(g.payment?.explanation, d.payment.explanation),
      changeRestaurant: s(g.payment?.changeRestaurant, d.payment.changeRestaurant),
    },
    form: {
      minAmount,
      maxAmount,
      donationPrompt: s(g.form?.donationPrompt, d.form.donationPrompt),
      payPrompt: s(g.form?.payPrompt, d.form.payPrompt),
      otherPlaceholder: s(g.form?.otherPlaceholder, d.form.otherPlaceholder),
      emailPlaceholder: s(g.form?.emailPlaceholder, d.form.emailPlaceholder),
      chooseAmountError: s(g.form?.chooseAmountError, d.form.chooseAmountError),
      rangeError: s(g.form?.rangeError, d.form.rangeError),
      notConfigured: s(g.form?.notConfigured, d.form.notConfigured),
      continueLabel: s(g.form?.continueLabel, d.form.continueLabel),
      oneMomentLabel: s(g.form?.oneMomentLabel, d.form.oneMomentLabel),
      securityNote1: s(g.form?.securityNote1, d.form.securityNote1),
      securityNote2: s(g.form?.securityNote2, d.form.securityNote2),
      kohaNote: s(g.form?.kohaNote, d.form.kohaNote),
      givingLabel: s(g.form?.givingLabel, d.form.givingLabel),
      changeAmountLabel: s(g.form?.changeAmountLabel, d.form.changeAmountLabel),
      orPayByCard: s(g.form?.orPayByCard, d.form.orPayByCard),
      giveLabel: s(g.form?.giveLabel, d.form.giveLabel),
      processingLabel: s(g.form?.processingLabel, d.form.processingLabel),
      cardSecurityNote: s(g.form?.cardSecurityNote, d.form.cardSecurityNote),
    },
    newsletter: {
      heading: s(g.newsletter?.heading, d.newsletter.heading),
      subtitle: s(g.newsletter?.subtitle, d.newsletter.subtitle),
      emailPlaceholder: s(g.newsletter?.emailPlaceholder, d.newsletter.emailPlaceholder),
      submitLabel: s(g.newsletter?.submitLabel, d.newsletter.submitLabel),
      sendingLabel: s(g.newsletter?.sendingLabel, d.newsletter.sendingLabel),
      errorMessage: s(g.newsletter?.errorMessage, d.newsletter.errorMessage),
      successTitle: s(g.newsletter?.successTitle, d.newsletter.successTitle),
      successMessage: s(g.newsletter?.successMessage, d.newsletter.successMessage),
    },
    thanks: {
      metaTitle: s(g.thanks?.metaTitle, d.thanks.metaTitle),
      eyebrow: s(g.thanks?.eyebrow, d.thanks.eyebrow),
      heading: s(g.thanks?.heading, d.thanks.heading),
      messageWithLocation: s(g.thanks?.messageWithLocation, d.thanks.messageWithLocation),
      messageNoLocation: s(g.thanks?.messageNoLocation, d.thanks.messageNoLocation),
      messageFallback: s(g.thanks?.messageFallback, d.thanks.messageFallback),
      receiptNote: s(g.thanks?.receiptNote, d.thanks.receiptNote),
      kohaNote: s(g.thanks?.kohaNote, d.thanks.kohaNote),
      bookLabel: s(g.thanks?.bookLabel, d.thanks.bookLabel),
      otherWaysLabel: s(g.thanks?.otherWaysLabel, d.thanks.otherWaysLabel),
      closing: s(g.thanks?.closing, d.thanks.closing),
    },
    feedback: {
      heading: s(g.feedback?.heading, d.feedback.heading),
      optionalLabel: s(g.feedback?.optionalLabel, d.feedback.optionalLabel),
      subtitle: s(g.feedback?.subtitle, d.feedback.subtitle),
      placeholder: s(g.feedback?.placeholder, d.feedback.placeholder),
      ratingLabel: s(g.feedback?.ratingLabel, d.feedback.ratingLabel),
      namePlaceholder: s(g.feedback?.namePlaceholder, d.feedback.namePlaceholder),
      consentLabel: s(g.feedback?.consentLabel, d.feedback.consentLabel),
      emptyError: s(g.feedback?.emptyError, d.feedback.emptyError),
      submitLabel: s(g.feedback?.submitLabel, d.feedback.submitLabel),
      sendingLabel: s(g.feedback?.sendingLabel, d.feedback.sendingLabel),
      doneTitle: s(g.feedback?.doneTitle, d.feedback.doneTitle),
      donePublished: s(g.feedback?.donePublished, d.feedback.donePublished),
      doneUnpublished: s(g.feedback?.doneUnpublished, d.feedback.doneUnpublished),
    },
  }
}

// Format a whole-dollar amount the way the flows display it ($1,234).
export function formatDollars(amount: number): string {
  return `$${amount.toLocaleString('en-NZ')}`
}

// Fill {amount} / {location} / {email} / {min} / {max} placeholders.
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? values[key] : match,
  )
}
