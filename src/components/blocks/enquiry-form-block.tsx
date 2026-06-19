import { EnquiryForm } from '@/components/enquiry-form'
import { renderRichText } from './render-text'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    intro?: string
    variant?: 'forest' | 'cream'
    enquiryTypes?: Array<{ label?: string }> | null
    recipientEmail?: string
    successMessage?: string
    footnote?: string
  }
}

const DEFAULT_SUCCESS = "Thanks — your enquiry is on its way. We'll be in touch within two working *days*."

export function EnquiryFormBlock({ block }: Props) {
  const tone = block.variant === 'cream' ? 'cream' : 'forest'
  const isForest = tone === 'forest'
  const enquiryTypes = (block.enquiryTypes || [])
    .map((t) => t?.label?.trim())
    .filter((l): l is string => Boolean(l))

  return (
    <section id="enquiry" className="container-wide scroll-mt-24 pt-12 pb-24">
      <div
        className={`relative overflow-hidden rounded-[3rem] [clip-path:inset(0_round_3rem)] p-8 sm:p-14 grain ${
          isForest
            ? 'bg-forest-700 text-cream-50'
            : 'bg-cream-100 text-forest-700 border border-forest-500/10 dark:bg-surface-2 dark:text-content dark:border-line/15'
        }`}
      >
        {isForest && (
          <div
            className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sun-200/15 blur-3xl"
            aria-hidden
          />
        )}

        <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy column */}
          <div className="lg:py-4">
            {block.eyebrow && (
              <p
                className={`eyebrow flex items-center gap-3 ${
                  isForest ? 'text-cream-50/70' : 'text-forest-500/80 dark:text-muted'
                }`}
              >
                <span
                  className={`inline-block h-px w-8 ${isForest ? 'bg-cream-50/40' : 'bg-forest-500/50'}`}
                />
                {block.eyebrow}
              </p>
            )}
            {block.heading && (
              <h2 className="display mt-5 text-4xl font-light leading-tight sm:text-5xl">
                {renderRichText(block.heading)}
              </h2>
            )}
            {block.intro && (
              <p
                className={`mt-6 max-w-md text-lg leading-relaxed ${
                  isForest ? 'text-cream-50/80' : 'text-forest-700/80 dark:text-content/75'
                }`}
              >
                {renderRichText(block.intro)}
              </p>
            )}
            {block.footnote && (
              <p
                className={`mt-8 text-sm ${
                  isForest ? 'text-cream-50/55' : 'text-forest-700/55 dark:text-muted/80'
                }`}
              >
                {renderRichText(block.footnote)}
              </p>
            )}
          </div>

          {/* Form column */}
          <div>
            <EnquiryForm
              tone={tone}
              enquiryTypes={enquiryTypes}
              successMessage={block.successMessage || DEFAULT_SUCCESS}
              recipientEmail={block.recipientEmail}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
