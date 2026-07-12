/** A populated doc from the `documents` collection, as delivered by an upload field. */
export type DocFile = {
  url?: string
  filename?: string
  filesize?: number
  mimeType?: string
  title?: string
  description?: string
}

export function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return null
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function fileLabel(mimeType?: string) {
  if (mimeType === 'application/pdf') return 'PDF'
  return mimeType?.split('/')[1]?.toUpperCase() || 'FILE'
}
