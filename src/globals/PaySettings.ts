import type { GlobalConfig } from 'payload'

// Editable copy + amounts for the donation (/donate) and pay-at-table
// (/dine-with-us/pay/*) flows. Every field is OPTIONAL: leave one blank and the
// flow falls back to the built-in default (see DEFAULT_PAY_COPY in
// src/lib/pay-copy.ts), which is why the placeholders show the current wording.
//
// Tabs are NAMED so each section's data nests under its own key (amounts /
// picker / payment / form / thanks / feedback) — matching the PayCopy shape the
// resolver reads. Headings support the *asterisk* italic convention used across
// the site (wrap a word in *asterisks* for the light editorial italic).
export const PaySettings: GlobalConfig = {
  slug: 'pay-settings',
  label: 'Pay & Donate',
  access: { read: () => true },
  admin: {
    description:
      'Copy and amounts for the /donate page and the pay-at-table flow. Blank fields use the built-in default shown as placeholder text.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'amounts',
          label: 'Amounts',
          fields: [
            {
              name: 'presets',
              type: 'array',
              labels: { singular: 'Preset amount', plural: 'Preset amounts' },
              admin: {
                description:
                  'The quick-pick amount tiles in the pay-at-table form. 2–4 work best in the grid.',
              },
              minRows: 0,
              maxRows: 4,
              fields: [
                {
                  name: 'amount',
                  type: 'number',
                  required: true,
                  admin: { description: 'Whole dollars, e.g. 25', width: '40%' },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "Covers tonight’s meal"', width: '60%' },
                },
              ],
            },
            {
              name: 'minAmount',
              type: 'number',
              admin: {
                description:
                  'Smallest custom ("Other") amount allowed, in whole dollars. Default 1.',
                placeholder: '1',
                width: '50%',
              },
            },
            {
              name: 'maxAmount',
              type: 'number',
              admin: {
                description: 'Largest custom amount allowed, in whole dollars. Default 100000.',
                placeholder: '100000',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'picker',
          label: 'Choose restaurant',
          description: 'The page where a diner picks which restaurant they ate at.',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              admin: { placeholder: 'Pay what you feel' },
            },
            {
              name: 'heading',
              type: 'textarea',
              admin: {
                description: 'Wrap a word in *asterisks* for italic.',
                placeholder: 'Thank you for *dining* with us',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              admin: { placeholder: 'Where did you join us tonight?' },
            },
            {
              name: 'specialEventsLabel',
              type: 'text',
              admin: {
                description: 'The dashed "special event" option at the bottom of the list.',
                placeholder: 'A special event or pop-up dinner',
              },
            },
            {
              name: 'securityNote',
              type: 'textarea',
              admin: {
                placeholder:
                  'Payments are processed securely by Stripe. Apple Pay and Google Pay accepted.',
              },
            },
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'Browser tab / SEO title.', placeholder: 'Pay what you feel' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: { description: 'SEO meta description.' },
            },
          ],
        },
        {
          name: 'payment',
          label: 'Payment page',
          description: 'The per-restaurant page with the amount picker and card form.',
          fields: [
            {
              name: 'eyebrowLocation',
              type: 'text',
              admin: {
                description: 'Use {location} for the restaurant name.',
                placeholder: 'Everybody Eats {location}',
              },
            },
            {
              name: 'eyebrowSpecial',
              type: 'text',
              admin: {
                description: 'Eyebrow shown for the special-events / pop-up page.',
                placeholder: 'Everybody Eats · Special event',
              },
            },
            {
              name: 'heading',
              type: 'textarea',
              admin: {
                description: 'Wrap a word in *asterisks* for italic.',
                placeholder: 'Pay what feels *right*',
              },
            },
            {
              name: 'explanation',
              type: 'textarea',
              admin: {
                description: 'Wrap a phrase in *asterisks* to highlight it (e.g. *$25–$35*).',
                placeholder:
                  'Whatever you can give tonight makes a difference. A three-course meal like yours typically costs *$25–$35* to put on the table — anything beyond that shouts dinner for someone who can’t.',
              },
            },
            {
              name: 'changeRestaurant',
              type: 'text',
              admin: {
                description: 'The "go back" link text (a ← arrow is added automatically).',
                placeholder: 'Not where you dined? Change restaurant',
              },
            },
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'Browser tab / SEO title. Use {location} for the restaurant name.',
                placeholder: 'Pay what you feel — {location}',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: { description: 'SEO meta description.' },
            },
          ],
        },
        {
          name: 'form',
          label: 'Payment form',
          description:
            'The amount + card form. Shared by the pay-at-table flow and the embedded /donate form.',
          fields: [
            {
              name: 'payPrompt',
              type: 'text',
              admin: {
                description: 'Prompt above the amounts, pay-at-table flow.',
                placeholder: 'Tonight, I’d like to give',
              },
            },
            {
              name: 'donationPrompt',
              type: 'text',
              admin: {
                description: 'Prompt above the amounts on the /donate page.',
                placeholder: 'I’d like to give',
              },
            },
            {
              name: 'otherPlaceholder',
              type: 'text',
              admin: { placeholder: 'Other amount' },
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              admin: { placeholder: 'Email for a receipt (optional)' },
            },
            {
              name: 'continueLabel',
              type: 'text',
              admin: {
                description: 'First button. The chosen amount is appended automatically.',
                placeholder: 'Continue',
              },
            },
            {
              name: 'oneMomentLabel',
              type: 'text',
              admin: { description: 'Shown on the button while starting payment.', placeholder: 'One moment…' },
            },
            {
              name: 'securityNote1',
              type: 'text',
              admin: { placeholder: 'Secure payment by Stripe — card, Apple Pay or Google Pay.' },
            },
            {
              name: 'securityNote2',
              type: 'text',
              admin: { placeholder: 'No amount is too small. Koha of any size is welcome.' },
            },
            {
              name: 'kohaNote',
              type: 'textarea',
              admin: {
                description:
                  'Pay-at-table only. Makes clear the payment is koha (a gift) — GST-free and not a tax-deductible donation receipt. Not shown on the /donate page.',
                placeholder:
                  'Your koha is a gift, so it’s GST-free — you’ll get a payment confirmation, not a tax-deductible donation receipt.',
              },
            },
            {
              name: 'givingLabel',
              type: 'text',
              admin: {
                description: 'Shown on the card step. Use {amount} for the chosen amount.',
                placeholder: 'Giving {amount}',
              },
            },
            {
              name: 'changeAmountLabel',
              type: 'text',
              admin: { description: 'Link back to the amount step (← added automatically).', placeholder: 'Change amount' },
            },
            {
              name: 'orPayByCard',
              type: 'text',
              admin: { description: 'Divider between the wallet buttons and the card form.', placeholder: 'or pay by card' },
            },
            {
              name: 'giveLabel',
              type: 'text',
              admin: {
                description: 'Final pay button. Use {amount} for the chosen amount.',
                placeholder: 'Give {amount} →',
              },
            },
            {
              name: 'processingLabel',
              type: 'text',
              admin: { placeholder: 'Processing…' },
            },
            {
              name: 'cardSecurityNote',
              type: 'text',
              admin: { placeholder: 'Secure payment by Stripe. Your card details never touch our servers.' },
            },
            {
              name: 'chooseAmountError',
              type: 'text',
              admin: { description: 'Shown when no amount is selected.', placeholder: 'Choose or enter an amount to give.' },
            },
            {
              name: 'rangeError',
              type: 'text',
              admin: {
                description: 'Out-of-range error. Use {min} and {max} for the limits.',
                placeholder: 'Please enter an amount between {min} and {max}.',
              },
            },
            {
              name: 'notConfigured',
              type: 'textarea',
              admin: {
                description: 'Shown if Stripe isn’t configured (no publishable key).',
                placeholder:
                  'Online payments aren’t set up yet — please see one of our team at the counter. Sorry!',
              },
            },
          ],
        },
        {
          name: 'newsletter',
          label: 'Newsletter sign-up',
          description:
            'The newsletter sign-up shown on the thank-you page. Subscribes to the single website list via Campaign Monitor (needs CAMPAIGN_MONITOR_API_KEY set).',
          fields: [
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Wrap a word in *asterisks* for italic.',
                placeholder: 'Stay in the *loop*',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              admin: {
                placeholder:
                  'Get the occasional note about dinners, events and good news from your local Everybody Eats.',
              },
            },
            // The website newsletter is a single list now (no region split), so
            // these region fields are no longer used. Hidden rather than removed
            // to avoid a DB migration; safe to drop in a future schema change.
            { name: 'regionLabel', type: 'text', admin: { hidden: true } },
            { name: 'aucklandLabel', type: 'text', admin: { hidden: true } },
            { name: 'wellingtonLabel', type: 'text', admin: { hidden: true } },
            { name: 'emailPlaceholder', type: 'text', admin: { placeholder: 'you@example.com' } },
            { name: 'submitLabel', type: 'text', admin: { placeholder: 'Sign me up' } },
            { name: 'sendingLabel', type: 'text', admin: { placeholder: 'Signing up…' } },
            { name: 'regionError', type: 'text', admin: { hidden: true } },
            {
              name: 'errorMessage',
              type: 'textarea',
              admin: {
                description: 'Generic failure message.',
                placeholder: 'We couldn’t sign you up just now. Please try again later.',
              },
            },
            { name: 'successTitle', type: 'text', admin: { placeholder: 'You’re on the list.' } },
            {
              name: 'successMessage',
              type: 'textarea',
              admin: {
                placeholder: 'Thanks — keep an eye on your inbox for the next letter.',
              },
            },
          ],
        },
        {
          name: 'thanks',
          label: 'Thank you',
          description: 'The confirmation page shown after a successful payment.',
          fields: [
            { name: 'eyebrow', type: 'text', admin: { placeholder: 'Pay what you feel' } },
            {
              name: 'heading',
              type: 'textarea',
              admin: { description: 'Wrap a word in *asterisks* for italic.', placeholder: 'Thank *you*' },
            },
            {
              name: 'messageWithLocation',
              type: 'textarea',
              admin: {
                description:
                  'Shown when we know the restaurant. Use {amount} and {location}; wrap {amount} in *asterisks* to highlight it.',
                placeholder:
                  'Your *{amount}* goes straight back into the kitchen at {location} — rescuing food, training chefs, and keeping seats at the table for everyone.',
              },
            },
            {
              name: 'messageNoLocation',
              type: 'textarea',
              admin: {
                description: 'Shown when we have the amount but not the restaurant. Use {amount}.',
                placeholder:
                  'Your *{amount}* goes straight back into the kitchen — rescuing food, training chefs, and keeping seats at the table for everyone.',
              },
            },
            {
              name: 'messageFallback',
              type: 'textarea',
              admin: {
                description: 'Shown when the amount can’t be confirmed.',
                placeholder:
                  'Your contribution goes straight back into the kitchen — rescuing food, training chefs, and keeping seats at the table for everyone.',
              },
            },
            {
              name: 'receiptNote',
              type: 'text',
              admin: { description: 'Shown when a receipt email was given. Use {email}.', placeholder: 'A receipt is on its way to {email} from Stripe.' },
            },
            {
              name: 'kohaNote',
              type: 'textarea',
              admin: {
                description:
                  'Pay-at-table only. Reiterates the payment is koha — GST-free and not a tax-deductible donation receipt. Not shown for /donate confirmations.',
                placeholder:
                  'Your koha is a gift — it’s GST-free and isn’t a tax-deductible donation receipt.',
              },
            },
            { name: 'bookLabel', type: 'text', admin: { placeholder: 'Book your next dinner' } },
            { name: 'otherWaysLabel', type: 'text', admin: { placeholder: 'Other ways to help' } },
            {
              name: 'closing',
              type: 'text',
              admin: { description: 'The italic sign-off line at the bottom.', placeholder: 'See you at the table again soon.' },
            },
            { name: 'metaTitle', type: 'text', admin: { description: 'Browser tab / SEO title.', placeholder: 'Thank you' } },
          ],
        },
        {
          name: 'feedback',
          label: 'Feedback note',
          description: 'The optional "leave a note" form on the thank-you page.',
          fields: [
            { name: 'heading', type: 'text', admin: { placeholder: 'Leave a note' } },
            {
              name: 'optionalLabel',
              type: 'text',
              admin: { description: 'Muted suffix after the heading.', placeholder: '— optional' },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              admin: {
                placeholder:
                  'How was tonight? A line about your meal helps our volunteers and future diners.',
              },
            },
            { name: 'placeholder', type: 'text', admin: { description: 'Note textarea placeholder.', placeholder: 'The food, the welcome, the room…' } },
            { name: 'ratingLabel', type: 'text', admin: { description: 'Accessible label for the star rating.', placeholder: 'Rating out of five' } },
            { name: 'namePlaceholder', type: 'text', admin: { placeholder: 'First name (optional)' } },
            {
              name: 'consentLabel',
              type: 'textarea',
              admin: {
                placeholder:
                  'OK to share my note publicly with my first name on the Everybody Eats website.',
              },
            },
            { name: 'submitLabel', type: 'text', admin: { placeholder: 'Share your note' } },
            { name: 'sendingLabel', type: 'text', admin: { placeholder: 'Sending…' } },
            { name: 'emptyError', type: 'text', admin: { description: 'Shown when the note is empty.', placeholder: 'Write a few words first.' } },
            { name: 'doneTitle', type: 'text', admin: { placeholder: 'Thank you for the kind words.' } },
            {
              name: 'donePublished',
              type: 'textarea',
              admin: {
                description: 'Confirmation when the note may be shared publicly.',
                placeholder:
                  'With your blessing, your note may appear on our restaurant page and be shared with the team who cooked for you.',
              },
            },
            {
              name: 'doneUnpublished',
              type: 'textarea',
              admin: {
                description: 'Confirmation when the note is kept private.',
                placeholder: 'We’ve passed your note to the team who cooked for you tonight.',
              },
            },
          ],
        },
      ],
    },
  ],
}
