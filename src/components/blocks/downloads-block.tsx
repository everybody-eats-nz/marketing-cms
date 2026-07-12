import { renderRichText } from './render-text'
import { type DocFile, formatBytes, fileLabel } from './file-meta'

type Item = {
  file?: DocFile | string | null
  title?: string
  description?: string
}

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    intro?: string
    columns?: '1' | '2' | '3'
    items?: Item[]
  }
}

const COLUMN_CLASSES: Record<string, string> = {
  '1': '',
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
}

export function DownloadsBlock({ block }: Props) {
  // Only items with a populated (object) file are renderable.
  const items = (block.items || []).filter(
    (i): i is Item & { file: DocFile } => typeof i.file === 'object' && i.file !== null && !!i.file.url,
  )
  if (!items.length) return null
  const colClass = COLUMN_CLASSES[block.columns || '2']

  return (
    <section className="container-wide py-16 sm:py-24">
      {(block.eyebrow || block.heading || block.intro) && (
        <div className="max-w-2xl mb-12">
          {block.eyebrow && <p className="eyebrow mb-3">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-5xl text-content font-light leading-tight">
              {renderRichText(block.heading)}
            </h2>
          )}
          {block.intro && (
            <p className="mt-5 text-lg text-muted leading-relaxed">{renderRichText(block.intro)}</p>
          )}
        </div>
      )}

      <ul className={`grid gap-5 ${colClass}`}>
        {items.map((item, i) => {
          const file = item.file
          const title = item.title || file.title || file.filename || 'Download'
          const description = item.description || file.description
          const size = formatBytes(file.filesize)
          const kind = fileLabel(file.mimeType)
          return (
            <li key={i}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                download={file.filename}
                className="group grain flex items-start gap-5 h-full rounded-[1.75rem] bg-surface-2 p-7 sm:p-8 transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span
                  className="mt-0.5 shrink-0 grid place-items-center size-12 rounded-2xl bg-forest-700 text-cream-50"
                  aria-hidden
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                    <path d="M12 11v6" />
                    <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
                  </svg>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 mb-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted/70">
                    {kind}
                    {size && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{size}</span>
                      </>
                    )}
                  </span>
                  <span className="block display text-xl sm:text-2xl font-medium text-content leading-snug">
                    {title}
                  </span>
                  {description && (
                    <span className="block mt-2 text-sm text-content/75 leading-relaxed">
                      {description}
                    </span>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-500 dark:text-forest-200 group-hover:gap-2.5 transition-all">
                    Download
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 4v12" />
                      <path d="m6 12 6 6 6-6" />
                      <path d="M5 20h14" />
                    </svg>
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
