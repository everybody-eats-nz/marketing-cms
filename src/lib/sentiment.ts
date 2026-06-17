import Anthropic from '@anthropic-ai/sdk'

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'unknown'

export type SentimentResult = {
  sentiment: Sentiment
  /** One short internal-only line on why — stored for staff, never shown publicly. */
  reason: string
}

let client: Anthropic | null = null

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!client) client = new Anthropic()
  return client
}

// The classifier defaults to Claude Opus 4.8 (the most capable model). Sentiment
// is a cheap, high-volume task, so SENTIMENT_MODEL lets you drop to a smaller
// model (e.g. claude-haiku-4-5) without a code change.
const MODEL = process.env.SENTIMENT_MODEL || 'claude-opus-4-8'

const SENTIMENT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sentiment: {
      type: 'string',
      enum: ['positive', 'neutral', 'negative'],
      description: 'Overall sentiment of the diner’s comment.',
    },
    reason: {
      type: 'string',
      description: 'One short sentence explaining the call (max ~20 words).',
    },
  },
  required: ['sentiment', 'reason'],
} as const

/**
 * Classify a diner's free-text comment. Used to decide whether feedback is
 * eligible to surface publicly (positive + consent → auto-publish).
 *
 * Fails soft: if no API key is configured or the call errors, returns
 * `unknown` so the feedback is still saved (just not auto-published) and a
 * staff member can review it manually.
 */
export async function classifyFeedback(
  message: string,
  rating?: number,
): Promise<SentimentResult> {
  const anthropic = getClient()
  if (!anthropic) {
    return { sentiment: 'unknown', reason: 'AI classification not configured.' }
  }

  const ratingLine =
    typeof rating === 'number' ? `\nThe diner also gave a ${rating}/5 star rating.` : ''

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 256,
      system:
        'You classify the sentiment of short diner comments left for a New Zealand ' +
        'pay-as-you-feel charity restaurant. Judge the diner’s overall feeling about ' +
        'their experience. Sarcasm and backhanded compliments are negative. Mixed but ' +
        'mostly warm is positive. Return only the structured result.',
      // Structured output: constrain the response to our schema so we get
      // valid JSON without prompt-wrangling or brittle parsing.
      output_config: { format: { type: 'json_schema', schema: SENTIMENT_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: `Classify this diner comment:\n\n"""${message}"""${ratingLine}`,
        },
      ],
    } as Anthropic.MessageCreateParamsNonStreaming)

    const text = response.content.find((b) => b.type === 'text')
    if (!text || text.type !== 'text') {
      return { sentiment: 'unknown', reason: 'No structured output returned.' }
    }
    const parsed = JSON.parse(text.text) as { sentiment: Sentiment; reason: string }
    return { sentiment: parsed.sentiment, reason: parsed.reason }
  } catch {
    // Network/model/parse failure — never block the diner's feedback on it.
    return { sentiment: 'unknown', reason: 'AI classification failed; needs manual review.' }
  }
}
