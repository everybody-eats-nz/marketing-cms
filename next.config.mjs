import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The deploy container's `next build` was OOM-killed during the type-check
  // phase (Payload's generated types make `tsc` memory-heavy, and the build host
  // has less RAM than CI). Type safety is already gated by the dedicated CI step
  // (`pnpm typecheck`), so skip the redundant in-build check to keep the
  // container build within memory.
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: 'assets.website-files.com' },
      { protocol: 'https', hostname: 'uploads-ssl.webflow.com' },
      { protocol: 'https', hostname: 'localhost' },
    ],
  },
  reactCompiler: false,
  // Preserve inbound links to the old Webflow legal URLs (the pages now live at
  // /terms and /privacy — see scripts/seed-legal-pages.ts).
  async redirects() {
    return [
      { source: '/hygiene/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/hygiene/privacy-policy', destination: '/privacy', permanent: true },
    ]
  },
  // Reverse-proxy PostHog ingestion through our own origin so it loads as a
  // first-party request and isn't blocked by ad/tracker blockers — the browser
  // SDK points at `/ingest` (see src/instrumentation-client.ts). US Cloud hosts
  // are hard-coded here to match the server-side capture default in
  // src/app/(frontend)/actions/enquiry.ts; switch to eu.i / eu-assets if the
  // project ever moves regions.
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ]
  },
  // PostHog's capture endpoints expect trailing slashes; let them through
  // untouched instead of issuing Next's automatic trailing-slash redirect.
  skipTrailingSlashRedirect: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
