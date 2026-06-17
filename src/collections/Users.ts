import type { CollectionConfig } from 'payload'

const adminURL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: {
    // New accounts must confirm their email before they can sign in. On user
    // creation Payload emails this verification link — effectively an invite to
    // the CMS. Until the link is clicked the account stays unverified and login
    // is blocked.
    verify: {
      generateEmailSubject: () => 'You’ve been invited to the Everybody Eats CMS',
      generateEmailHTML: ({ token, user }) => {
        // Matches Payload's default verify route: {serverURL}/admin/{collection}/verify/{token}
        const verifyURL = `${adminURL}/admin/users/verify/${token}`
        const name = (user as { name?: string })?.name
        return `
          <p>Kia ora${name ? ` ${name}` : ''},</p>
          <p>You’ve been added to the Everybody Eats CMS. Confirm your email address to activate your account:</p>
          <p><a href="${verifyURL}">Verify my account</a></p>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p>${verifyURL}</p>
        `
      },
    },
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
