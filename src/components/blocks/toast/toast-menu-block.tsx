import Image from 'next/image'
import { type DocFile, formatBytes } from '../file-meta'
import { renderToastText } from './toast-text'
import './toast.css'

type Sheet = { image?: any; alt?: string; id?: string }

type Props = {
  block: {
    eyebrow?: string
    sheets?: Sheet[] | null
    pdf?: DocFile | string | null
    downloadLabel?: string
    footnote?: string
  }
}

/** One page of the menu, shown at the artwork's own proportions. */
function MenuSheet({ sheet }: { sheet: Sheet }) {
  const media = sheet.image
  // Menus are artwork, not photography: render the full-size original rather
  // than a crop, so small print stays legible when someone pinches in.
  const url = media.url
  if (!url) return null
  const width = media.width || 1400
  const height = media.height || Math.round(width * 1.4142)
  return (
    <Image
      src={url}
      alt={sheet.alt || media.alt || ''}
      width={width}
      height={height}
      sizes="(min-width: 768px) 48rem, 100vw"
      className="toast-sheet"
    />
  )
}

export function ToastMenuBlock({ block }: Props) {
  const sheets = (block.sheets || []).filter(
    (s): s is Sheet & { image: any } => typeof s?.image === 'object' && s.image !== null,
  )
  const pdf = typeof block.pdf === 'object' && block.pdf?.url ? block.pdf : null
  if (!sheets.length && !pdf) return null

  const size = pdf ? formatBytes(pdf.filesize) : null

  return (
    <section className="toast-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="toast-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="toast-label mb-10">{block.eyebrow}</p>}

          {sheets.length > 0 ? (
            <div className="flex flex-col gap-8">
              {sheets.map((sheet, i) => (
                <MenuSheet key={sheet.id || i} sheet={sheet} />
              ))}
            </div>
          ) : (
            // No images uploaded — embed the PDF instead. Browsers that refuse
            // to embed one show nothing here, which is why the download button
            // below is always rendered alongside it.
            pdf && (
              <object
                data={pdf.url!}
                type="application/pdf"
                aria-label={pdf.title || 'Toast menu'}
                className="toast-sheet-pdf"
              >
                <p className="p-6 text-[0.9375rem] leading-[1.8] opacity-80">
                  Your browser can’t show the menu inline — use the download below.
                </p>
              </object>
            )
          )}

          {pdf && (
            <div className="mt-10">
              <a href={pdf.url!} target="_blank" rel="noopener noreferrer" className="toast-btn">
                {block.downloadLabel || 'Download the menu (PDF)'}
                {size && <span className="opacity-60">{size}</span>}
              </a>
            </div>
          )}

          {block.footnote && (
            <p className="mt-10 max-w-[52ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
              {renderToastText(block.footnote)}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
