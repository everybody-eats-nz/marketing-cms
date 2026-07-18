import { withPayload } from '@payloadcms/next/withPayload'
import { withPostHogConfig } from '@posthog/nextjs-config'

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
  // Preserve inbound links from the old Webflow/Squarespace URLs. All 301
  // (permanent). Path-level SEO redirect map — see docs/seo-migration-audit.md
  // §2 for the traffic rationale behind each. Host canonicalisation (www→apex,
  // http→https) is handled at the proxy/DNS layer, not here (§5).
  //
  // Order matters: Next matches top-to-bottom, first hit wins. Keep the more
  // specific sources above their broader parents.
  async redirects() {
    return [
      // Old Webflow legal URLs (pages now live at /terms and /privacy —
      // see scripts/seed-legal-pages.ts).
      { source: '/hygiene/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/hygiene/privacy-policy', destination: '/privacy', permanent: true },

      // Hopper Cafe was briefly published under /events/hopper-cafe (still
      // indexed by Google, now 404s). It lives at its own top-level /hopper.
      { source: '/events/hopper-cafe', destination: '/hopper', permanent: true },

      // Collection renamed journal-posts → journal. Wildcard covers all posts.
      // Verify leaf-slug parity against the CMS (audit §3); add explicit
      // /journal-posts/<old> → /journal/<new> entries ABOVE this line where a
      // slug differs.
      { source: '/journal-posts/:slug*', destination: '/journal/:slug*', permanent: true },

      // Squarespace duplicate of the Onehunga location page (1,468 clicks/yr).
      { source: '/dine-with-us/onehunga-auck', destination: '/dine-with-us/onehunga', permanent: true },

      // /about-us/* section moved. Specific children before the parent.
      { source: '/about-us/our-team', destination: '/about/team', permanent: true },
      { source: '/about-us/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us/faqs', destination: '/about/faqs', permanent: true },
      // /about is only a stub that 307s to /our-story, so redirect straight to
      // the real destination — avoids a 301→307 chain ending on a non-permanent
      // hop, which would undercut the link-equity goal.
      { source: '/about-us', destination: '/our-story', permanent: true },

      // Squarespace `-2` artifact.
      { source: '/get-involved-2', destination: '/get-involved', permanent: true },

      // Fundraise page renamed + flattened.
      {
        source: '/get-involved/donate/fundraise-for-everybody-eats',
        destination: '/get-involved/fundraise',
        permanent: true,
      },
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

const config = withPayload(nextConfig, { devBundleServerPackages: false })

// Source-map upload only runs in the deploy container, which sets both secrets.
// withPostHogConfig enables sourcemaps by default and throws at config-load time
// if `projectId` is missing (`projectId is required when sourcemaps are
// enabled`), so gate the wrapper on the vars being present — otherwise CI and
// local `next build` (no PostHog secrets) fail to load next.config.mjs.
export default process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID
  ? withPostHogConfig(config, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  : config
