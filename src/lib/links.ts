// True when a CMS-entered href points at a downloadable file rather than a
// page: a Payload upload route (/api/documents/file/..., /api/media/file/...)
// or anything ending in a document extension, absolute or relative.
//
// These must render as a plain <a>, not next/link: <Link> prefetches its
// target as an RSC request when it scrolls into view, which downloads the
// whole file (often several MB) on every page view, and clicking it then
// falls back to a full-page navigation anyway.
const UPLOAD_ROUTE = /^(?:https?:\/\/[^/]+)?\/api\/[\w-]+\/file\//i
const FILE_EXTENSION = /\.(?:pdf|docx?|xlsx?|pptx?|csv|zip)(?:[?#]|$)/i

export function isFileHref(href: string): boolean {
  return UPLOAD_ROUTE.test(href) || FILE_EXTENSION.test(href)
}
