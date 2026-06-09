import { NewsletterForm } from '@/components/newsletter-form'

type Props = {
  block: {
    footnote?: string
  }
}

export function NewsletterFormBlockRenderer({ block }: Props) {
  return (
    <section className="container-tight pb-32">
      <NewsletterForm />
      {block.footnote && (
        <p className="mt-4 text-xs text-muted/85">{block.footnote}</p>
      )}
    </section>
  )
}
