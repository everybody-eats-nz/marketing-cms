// The public website newsletter audiences (Campaign Monitor). Three lists:
// the two regional community letters (the same lists the volunteer portal
// syncs volunteers into) and the general supporters letter. Override
// per-environment with the CAMPAIGN_MONITOR_*_LIST_ID env vars if they change.

export const NEWSLETTER_LIST_KEYS = ['auckland', 'wellington', 'general'] as const
export type NewsletterListKey = (typeof NEWSLETTER_LIST_KEYS)[number]

// Server-only: resolve a newsletter audience to its Campaign Monitor list ID.
export function getNewsletterListId(key: NewsletterListKey = 'general'): string | undefined {
  switch (key) {
    case 'auckland':
      return process.env.CAMPAIGN_MONITOR_AUCKLAND_LIST_ID || 'd0fa752b4fe96d8b9a14e77d3c917222'
    case 'wellington':
      return process.env.CAMPAIGN_MONITOR_WELLINGTON_LIST_ID || 'dca35fce91d251a98c06a2d783794181'
    case 'general':
      return process.env.CAMPAIGN_MONITOR_WEBSITE_LIST_ID || 'cbe33492a9449b91b0da4dc5fb365a88'
  }
}
