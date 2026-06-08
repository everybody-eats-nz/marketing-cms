/**
 * Seed the FAQ collection + the FAQs page, migrated from the live Webflow site
 * (https://www.everybodyeats.nz/about-us/faqs).
 *
 * Self-contained (does NOT depend on the gitignored data/webflow/ dump) and
 * idempotent: FAQs are upserted by question, the page is upserted by slug.
 *
 * Usage:
 *   pnpm tsx scripts/seed-faqs.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

/** Wrap plain-text paragraphs into a minimal Lexical richText doc. */
function richText(...paras: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paras.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      })),
    },
  }
}

type Faq = { question: string; answer: ReturnType<typeof richText>; category: string }

// Order within this array == displayOrder. Groups render in CATEGORY_ORDER
// (see faqs-accordion-block.tsx), mirroring the live site's section order.
const FAQS: Faq[] = [
  // ── Paying at the restaurant ──────────────────────────────────────────────
  {
    category: 'pay-as-you-feel',
    question: 'What does pay-what-you-can mean?',
    answer: richText(
      "Pay what you can afford. Pay it forward. Koha. It's all the same. We want our meals to be accessible to everyone and for cost not to be a barrier to having a delicious meal in a social environment.",
      'All contributions are greatly received (and very much needed for us to keep our doors open). Funds go towards our fixed costs such as rent, utility bills and core staff who support our volunteers.',
      "If you're not sure how much to pay, we think $25-$35 per person is good value for a three-course meal and also means you're paying it forward for people less fortunate. Any amount, however big or small, is welcome.",
    ),
  },
  {
    category: 'pay-as-you-feel',
    question: 'How can I pay at your restaurants?',
    answer: richText(
      'We accept cash, eftpos and payments online through our pay-at-your-table system. Please note that payment for our pay-what-you-can meals is considered koha by the IRD and therefore not eligible for a tax deductible donation receipt.',
      "If you'd like to make a charitable donation, please use our website Donate page or get in touch.",
    ),
  },
  {
    category: 'pay-as-you-feel',
    question: 'Can I get a tax deductible donation receipt?',
    answer: richText(
      'Payment in the restaurants in exchange for a meal is not considered a donation by the IRD. It is also 0 rated for GST.',
      'To get a receipt you will need to send proof of payment and make a request to info@everybodyeats.nz, stating which restaurant you ate at and when. Only payments made outside of the restaurant are eligible for donation receipts.',
      'When you donate through our website you will automatically be emailed a receipt that is tax deductible, or you can contact us if you wish to make a donation by bank transfer.',
    ),
  },

  // ── About Everybody Eats ──────────────────────────────────────────────────
  {
    category: 'about-us',
    question: 'How long have you been operating?',
    answer: richText(
      "Everybody Eats was founded in June 2017. We first operated out of Gemmayze St restaurant on K'Road, before moving to our current permanent premises.",
    ),
  },
  {
    category: 'about-us',
    question: 'Are you a Registered Charity?',
    answer: richText(
      'Yes. The Everybody Eats Charitable Trust has been a Registered NZ Charity since December 2018. Our Charities Number is CC56055.',
    ),
  },
  {
    category: 'about-us',
    question: 'When will you be coming to my town/city?',
    answer: richText(
      'We have intentions to increase our reach and impact through pop-up restaurants in other cities. If you have a venue and supportive community that would welcome an Everybody Eats pop-up, get in touch.',
    ),
  },

  // ── Dining experience ─────────────────────────────────────────────────────
  {
    category: 'dining',
    question: 'Do I need to be homeless or experiencing poverty to come to a meal?',
    answer: richText(
      'No. We welcome and encourage everyone to come for a meal. Many of our guests are not facing financial insecurity and pay for their meals, like they would at another restaurant.',
      'By coming for a meal you are also helping to prevent food waste and build community connections. We encourage everyone to come along!',
    ),
  },
  {
    category: 'dining',
    question: 'By dining here, am I taking a meal from someone in need?',
    answer: richText(
      'No. We can only feed people experiencing hardship because we have paying customers who contribute enough to allow us to feed others. Reflecting diverse communities inside our restaurants and removing social barriers is what makes our restaurants different and special.',
      'Every week we see people from different backgrounds engaging with each other, building trust and strengthening the community whilst also helping to reduce food waste.',
    ),
  },
  {
    category: 'dining',
    question: 'I have allergies/dietary requirements, can you cater for me?',
    answer: richText(
      'Probably yes. We always have a complete 3 course vegetarian option and on most nights can provide at least 2 courses for vegans, but we do not guarantee it. Because of the nature of the food we receive we also can’t always cater to all allergies/dietaries.',
      'However, our experienced chefs can very often provide gluten free, dairy free and nut free meals. For more severe dietary requirements, we advise you contact the restaurant in advance (after 3pm once the menu is published) and speak to your server when you arrive.',
    ),
  },

  // ── Volunteering ──────────────────────────────────────────────────────────
  {
    category: 'volunteering',
    question: 'How do I become a volunteer?',
    answer: richText(
      "It's very easy, you can register here. Fill out the form, verify your email, complete your profile and you'll be helping us feed bellies, not bins in no time!",
    ),
  },
  {
    category: 'volunteering',
    question: 'Is everyone at Everybody Eats a volunteer?',
    answer: richText(
      "No, but most of the people you'll find working in our restaurants are. We employ a few people to manage our massive team of volunteers and to enable us to provide consistent quality meals.",
    ),
  },

  // ── Partnering & donations ────────────────────────────────────────────────
  {
    category: 'donating',
    question: 'I want to support you, how can I do that?',
    answer: richText(
      'Fantastic! Please contact us here to talk about partnership opportunities or visit our donate page. You can donate regularly or as a one-off. Every donation makes a difference.',
    ),
  },
  {
    category: 'donating',
    question: 'How do I donate surplus food from my business?',
    answer: richText(
      "If you have commercial (not residential) surplus food that is still fit for human consumption we'd love to hear from you, contact us here. Please note we can take products passed their 'best before' but not 'use-by' date.",
    ),
  },

  // ── About our meals ───────────────────────────────────────────────────────
  {
    category: 'our-meals',
    question: 'Where does your food come from?',
    answer: richText(
      'We receive donations of perfectly good food primarily from businesses and other food rescue charities. It may be short dated, labelled wrong or they might just have ordered too much. Here are some of the organisations we work with: Pak n Save, New World, Daily Bread, Kaibosh, Lewis Road, Karma Cola.',
      "We also buy additional ingredients if we don't have everything needed to make a complete three course meal. Please note, we do not use food scraps in any of our meals. All our food is good quality and complies with safety standards.",
    ),
  },
]

const PAGE = {
  slug: 'about/faqs',
  title: 'FAQs',
  seo: { description: 'Common questions about pay-as-you-feel dining at Everybody Eats.' },
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'FAQs',
      heading: 'Frequently asked *questions*.',
      subheading:
        "Everything we're asked most often, in one place. Can't find what you're looking for? Drop us a line on the contact page.",
    },
    { blockType: 'faqsAccordion' },
  ],
}

async function main() {
  const payload = await getPayload({ config })

  console.log('\n→ FAQs')
  let order = 0
  for (const faq of FAQS) {
    const data = { ...faq, displayOrder: order++ }
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      await payload.update({ collection: 'faqs', id: existing.docs[0].id, data: data as any })
      console.log(`  ✎ ${faq.question}`)
    } else {
      await payload.create({ collection: 'faqs', data: data as any })
      console.log(`  + ${faq.question}`)
    }
  }

  // Prune any FAQs not in the canonical set (e.g. stubs from earlier seeds).
  const keep = new Set(FAQS.map((f) => f.question))
  const all = await payload.find({ collection: 'faqs', limit: 200, depth: 0 })
  for (const doc of all.docs as any[]) {
    if (!keep.has(doc.question)) {
      await payload.delete({ collection: 'faqs', id: doc.id })
      console.log(`  − ${doc.question}`)
    }
  }

  console.log('\n→ FAQs page')
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE.slug } },
    limit: 1,
    depth: 0,
  })
  if (pages.totalDocs > 0) {
    await payload.update({ collection: 'pages', id: pages.docs[0].id, data: PAGE as any })
    console.log(`  ✎ ${PAGE.slug}`)
  } else {
    const created = await payload.create({ collection: 'pages', data: PAGE as any })
    console.log(`  + ${PAGE.slug} (id=${created.id})`)
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
