// The public website newsletter audience (Campaign Monitor). This is the single
// marketing list — there is no Auckland/Wellington split here. The per-region
// lists belong to the VOLUNTEER portal, not the website, so we don't use them.
// Override per-environment with CAMPAIGN_MONITOR_WEBSITE_LIST_ID if it changes.

// Server-only: resolve the website newsletter Campaign Monitor list ID.
export function getNewsletterListId(): string | undefined {
  return process.env.CAMPAIGN_MONITOR_WEBSITE_LIST_ID || 'cbe33492a9449b91b0da4dc5fb365a88'
}
