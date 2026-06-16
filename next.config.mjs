import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The deploy container's `next build` was OOM-killed during the type-check
  // phase (Payload's generated types make `tsc` memory-heavy, and the build host
  // has less RAM than CI). Type safety is already gated by the dedicated CI step
  // (`pnpm typecheck`), so skip the redundant in-build check to keep the
  // container build within memory. ESLint is skipped too — the repo has no
  // ESLint config, so `next build` would only ever prompt/skip it anyway.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: 'assets.website-files.com' },
      { protocol: 'https', hostname: 'uploads-ssl.webflow.com' },
      { protocol: 'https', hostname: 'localhost' },
    ],
  },
  experimental: {
    reactCompiler: false,
  },
  // Preserve inbound links to the old Webflow legal URLs (the pages now live at
  // /terms and /privacy — see scripts/seed-legal-pages.ts).
  async redirects() {
    return [
      { source: '/hygiene/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/hygiene/privacy-policy', destination: '/privacy', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
