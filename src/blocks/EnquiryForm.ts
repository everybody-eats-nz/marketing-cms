import type { Block } from 'payload'

// Lead-capture form for corporate events, catering and venue hire — the B2B
// funnel the rest of the marketing site doesn't have. Submissions are emailed
// (server action -> Payload Resend) to the corporate inbox; the recipient
// defaults to site-settings.corporateEmail unless overridden here.
export const EnquiryForm: Block = {
  slug: 'enquiryForm',
  labels: { singular: 'Enquiry form', plural: 'Enquiry forms' },
  imageURL: '/block-previews/enquiryForm.jpg',
  imageAltText: 'Enquiry form with type selector',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Start an enquiry' },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue: "Let's plan something\n*worth sharing*.",
      admin: { description: 'Wrap a word in *asterisks* for the brand italic.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Short paragraph above the form. *asterisks* allowed.' },
    },
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'forest',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Forest green', value: 'forest' },
        { label: 'Cream', value: 'cream' },
      ],
    },
    {
      name: 'enquiryTypes',
      type: 'array',
      labels: { singular: 'Enquiry type', plural: 'Enquiry types' },
      admin: { description: 'Options in the "What can we help with?" dropdown.' },
      defaultValue: [
        { label: 'Catering' },
        { label: 'Venue hire / private event' },
        { label: 'Team volunteering' },
        { label: 'Sponsorship / partnership' },
        { label: 'Something else' },
      ],
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'recipientEmail',
      type: 'email',
      admin: {
        description:
          'Where enquiries are sent. Leave blank to use the corporate email in Site Settings.',
      },
    },
    {
      name: 'successMessage',
      type: 'textarea',
      defaultValue:
        "Thanks — your enquiry is on its way. We'll be in touch within two working *days*.",
      admin: { description: 'Shown after a successful submit. *asterisks* allowed.' },
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Small print under the form, e.g. a phone fallback.' },
    },
  ],
}
