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

// Sentiment is a cheap, high-volume task on an unauthenticated endpoint, so the
// default is Haiku — easily capable of binary sentiment on short comments and
// far cheaper than larger models. SENTIMENT_MODEL overrides it without a code
// change (e.g. claude-sonnet-4-6).
const MODEL = process.env.SENTIMENT_MODEL || 'claude-haiku-4-5'

// We force a tool call to get structured JSON back. Tool use is universally
// supported across models and the SDK (no beta header, no type casts), so the
// classifier can't silently fall back to free-form text we'd fail to parse.
const SENTIMENT_TOOL: Anthropic.Tool = {
  name: 'classify_sentiment',
  description: 'Record the sentiment classification of a diner comment.',
  input_schema: {
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
  },
}

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
        'mostly warm is positive. Always record your answer with the classify_sentiment tool.',
      tools: [SENTIMENT_TOOL],
      tool_choice: { type: 'tool', name: SENTIMENT_TOOL.name },
      messages: [
        {
          role: 'user',
          content: `Classify this diner comment:\n\n"""${message}"""${ratingLine}`,
        },
      ],
    })

    const toolUse = response.content.find((b) => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') {
      return { sentiment: 'unknown', reason: 'No classification returned.' }
    }
    const parsed = toolUse.input as { sentiment: Sentiment; reason: string }
    return { sentiment: parsed.sentiment, reason: parsed.reason }
  } catch {
    // Network/model/parse failure — never block the diner's feedback on it.
    return { sentiment: 'unknown', reason: 'AI classification failed; needs manual review.' }
  }
}
