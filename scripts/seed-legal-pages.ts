/**
 * Seed the two legal pages migrated from the live Webflow site:
 *   - /terms   (https://www.everybodyeats.nz/hygiene/terms-and-conditions)
 *   - /privacy (https://www.everybodyeats.nz/hygiene/privacy-policy)
 *
 * The footer global already links to /terms and /privacy (see scripts/seed.ts
 * legalLinks), so we use those short slugs rather than the old Webflow
 * /hygiene/* paths — these pages are what those footer links point at.
 *
 * Obvious leftover Webflow template placeholders are cleaned up here:
 *   "[Your Company Name]" → Everybody Eats, "[Contact Information]" →
 *   info@everybodyeats.nz, the "available [here]" privacy reference becomes a
 *   real link to /privacy, and the trailing "consult a lawyer" template note is
 *   dropped.
 *
 * Self-contained and idempotent: pages are upserted by slug.
 *
 * Usage:
 *   pnpm tsx scripts/seed-legal-pages.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// ── Minimal Lexical richText builders (match src/components/rich-text.tsx) ────

const BOLD = 1

const text = (text: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

type Inline = ReturnType<typeof text> | ReturnType<typeof link>

const link = (label: string, url: string, newTab = false) => ({
  type: 'link',
  fields: { url, newTab, linkType: 'custom' },
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [text(label)],
})

const para = (...children: Array<string | Inline>) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: children.map((c) => (typeof c === 'string' ? text(c) : c)),
})

const heading = (tag: 'h1' | 'h2' | 'h3', value: string) => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [text(value)],
})

const bullets = (items: Array<string | Inline[]>) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: items.map((item, i) => ({
    type: 'listitem',
    value: i + 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: typeof item === 'string' ? [text(item)] : item,
  })),
})

const doc = (...children: any[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
})

// ── Page content ─────────────────────────────────────────────────────────────

const termsContent = doc(
  heading('h1', 'Terms & conditions'),
  heading('h2', '1. Introduction'),
  para(
    'Welcome to the Everybody Eats website. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using our site.',
  ),

  heading('h2', '2. Definitions'),
  bullets([
    [text('Website: ', BOLD), text('Refers to www.everybodyeats.nz.')],
    [text('User: ', BOLD), text('Any individual accessing or using the website.')],
    [text('Content: ', BOLD), text('Any material, text, images, or other media found on the website.')],
  ]),

  heading('h2', '3. Acceptance of Terms'),
  para(
    'By using our website, you accept these Terms and Conditions. If you do not agree to these terms, you should not use the website.',
  ),

  heading('h2', '4. Changes to Terms'),
  para(
    'We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the website signifies acceptance of any updated terms.',
  ),

  heading('h2', '5. Use of the Website'),
  bullets([
    'Users must be at least 18 years old or have parental consent.',
    'You agree not to misuse the website, including but not limited to hacking, spamming, or infringing upon intellectual property rights.',
    'Content on the website is for personal, non-commercial use unless otherwise authorized.',
  ]),

  heading('h2', '6. Intellectual Property'),
  para(
    'All content on this website, including text, graphics, logos, and images, is the property of Everybody Eats or licensed to us. You may not use any content without prior written consent.',
  ),

  heading('h2', '7. User Accounts'),
  para(
    'To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and are liable for any activity on your account.',
  ),

  heading('h2', '8. Limitation of Liability'),
  para(
    'We do not guarantee the accuracy or completeness of the content on our website. Everybody Eats is not liable for any damages arising from the use or inability to use the website.',
  ),

  heading('h2', '9. External Links'),
  para(
    'Our website may contain links to third-party websites. We are not responsible for the content or policies of these external sites.',
  ),

  heading('h2', '10. Privacy Policy'),
  para(
    'Our Privacy Policy, available ',
    link('here', '/privacy'),
    ', outlines how we collect, use, and protect your information. By using our website, you consent to our data practices.',
  ),

  heading('h2', '11. Termination'),
  para(
    'We reserve the right to terminate or suspend access to our website at any time, without notice, for any reason.',
  ),

  heading('h2', '12. Governing Law'),
  para(
    'These Terms and Conditions are governed by the laws of New Zealand. Any disputes will be resolved in the courts of New Zealand.',
  ),

  heading('h2', '13. Contact Us'),
  para(
    'If you have any questions regarding these Terms and Conditions, please contact us at ',
    link('info@everybodyeats.nz', 'mailto:info@everybodyeats.nz'),
    '.',
  ),
)

const privacyContent = doc(
  heading('h1', 'Privacy policy'),
  para('Last updated: 24 October 2025'),
  para('Everybody Eats ("we," "us," or "our") is committed to protecting your privacy.'),
  para(
    'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.everybodyeats.nz.',
  ),
  para(
    'Please read this Privacy Policy carefully. If you do not agree with the terms of this policy, please do not access the site.',
  ),

  heading('h2', '1. Information We Collect'),
  para('Personal Data and Non-Personal Data.'),
  para(
    'When you use our website, we may collect personally identifiable information, such as:',
  ),
  bullets([
    'Name',
    'Email address',
    'Contact information',
    'Other similar information you voluntarily provide',
  ]),
  para('We may also collect non-personally identifiable information such as:'),
  bullets(['IP address', 'Browser type', 'Access times', 'Referring URL', 'Pages viewed']),
  para('This information helps us understand how our website is used.'),

  heading('h2', '2. How We Use Your Information'),
  para('We may use the information we collect for the following purposes:'),
  bullets([
    'To improve and personalize your experience on our site',
    'To communicate with you about updates, promotions, or other information that may interest you',
    'To respond to your inquiries and provide customer support',
    'To monitor and analyze usage and trends to improve the website',
    'To detect and prevent fraudulent activities and ensure security',
  ]),

  heading('h2', '3. Disclosure of Your Information'),
  para('We may share your information with third parties in the following cases:'),
  bullets([
    [
      text('Service Providers: ', BOLD),
      text(
        'We may share your information with trusted third parties that assist us in operating our website and conducting our business.',
      ),
    ],
    [
      text('Legal Requirements: ', BOLD),
      text(
        'We may disclose your information if required by law, such as in response to a subpoena or government request.',
      ),
    ],
    [
      text('Business Transfers: ', BOLD),
      text(
        'If we undergo a merger, acquisition, or asset sale, your information may be transferred to the new entity.',
      ),
    ],
  ]),

  heading('h2', '4. Profile Retention'),
  para(
    'We reserve the right to delete any profile that remains incomplete and unapproved after 4 weeks has passed from the creation of the profile.',
  ),

  heading('h2', '5. Cookies and Tracking Technologies'),
  para(
    'We may use cookies and similar tracking technologies to collect and store information when you visit our website. Cookies help us improve your experience by remembering your preferences. You may choose to disable cookies through your browser settings, but this may limit some functionalities of the website.',
  ),

  heading('h2', '6. Data Security'),
  para(
    'We use industry-standard security measures to protect your information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.',
  ),

  heading('h2', '7. Third-Party Links'),
  para(
    'Our website may contain links to other sites that are not operated by us. We are not responsible for the privacy practices of these third-party sites, and we encourage you to read their privacy policies.',
  ),

  heading('h2', "8. Children's Privacy"),
  para(
    'Our website is not intended for children under the age of 13. We do not knowingly collect information from children under 13. If we become aware that we have collected personal data from a child under 13 without parental consent, we will take steps to delete that information.',
  ),

  heading('h2', '9. Your Choices and Rights'),
  para(
    'Depending on your jurisdiction, you may have rights related to your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us at ',
    link('info@everybodyeats.nz', 'mailto:info@everybodyeats.nz'),
    '.',
  ),

  heading('h2', '10. Changes to This Privacy Policy'),
  para(
    'We may update our Privacy Policy from time to time. Any changes will be posted on this page with the updated date. Your continued use of the site after such changes constitutes acceptance of the updated Privacy Policy.',
  ),

  heading('h2', '11. Contact Us'),
  para('If you have any questions about this Privacy Policy, please contact us at:'),
  para(
    link('info@everybodyeats.nz', 'mailto:info@everybodyeats.nz'),
    ' or 306 Onehunga Mall, Onehunga, Auckland 1016',
  ),
)

type PageSpec = {
  slug: string
  title: string
  seo?: { title?: string; description?: string }
  layout: any[]
}

const pages: PageSpec[] = [
  {
    slug: 'terms',
    title: 'Terms & conditions',
    seo: {
      description:
        'The terms and conditions governing the use of the Everybody Eats website.',
    },
    layout: [
      {
        blockType: 'richText',
        width: 'tight',
        content: termsContent,
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    seo: {
      description:
        'How Everybody Eats collects, uses, and protects your information.',
    },
    layout: [
      {
        blockType: 'richText',
        width: 'tight',
        content: privacyContent,
      },
    ],
  },
]

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'pages', where: { slug: { in: pages.map((p) => p.slug) } }, limit: pages.length, depth: 0 })

  for (const spec of pages) {
    const found = existing.docs.find((d: any) => d.slug === spec.slug)
    const data = {
      title: spec.title,
      slug: spec.slug,
      ...(spec.seo ? { seo: spec.seo } : {}),
      layout: spec.layout,
      _status: 'published',
    } as any

    if (found) {
      await payload.update({ collection: 'pages', id: (found as any).id, data })
      console.log(`✓ Updated  ${spec.slug.padEnd(12)} (${spec.layout.length} blocks)`)
    } else {
      const created = await payload.create({ collection: 'pages', data })
      console.log(`✓ Created  ${spec.slug.padEnd(12)} (id=${created.id}, ${spec.layout.length} blocks)`)
    }
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
