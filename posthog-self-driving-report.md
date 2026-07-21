# PostHog Self-driving setup report

**Project:** Marketing CMS — Everybody Eats NZ  
**Date:** 2026-07-17  
**Inbox:** https://us.posthog.com/project/200228/inbox

## Summary

PostHog Self-driving has been configured for the Everybody Eats marketing site. Session Replay, Error Tracking, Support, and GitHub Issues are now wired as signal sources; a three-scout troop (general, web-analytics, revenue-analytics) is running on a daily schedule. Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/200228/inbox) within approximately 30 minutes.

---

## AI data processing

**Status:** Approved — organization-level AI data processing consent was granted before this run started.

---

## GitHub

**Status:** Connected during this run.  
**Organization:** everybody-eats-nz  
**Integration ID:** 186660

---

## Products enabled

The `products-enable` API was not available via the current MCP token. All three products are confirmed capturing data (session recordings and error tracking issues were found in step 2; the `posthog.init` check was clean). A project admin should verify each product is toggled ON in project settings.

| Product | Status | Notes |
|---|---|---|
| Session Replay | Capturing — confirm ON in settings | Recordings found in step 2; init has no `disable_session_recording` override |
| Error Tracking | Capturing — confirm ON in settings | Active issues found (incl. React #418); init has `capture_exceptions: true` |
| Support (Conversations) | Confirm ON in settings | Idle until an inbound channel is connected — see Follow-ups |

**posthog.init check:** clean — no `disable_session_recording` or `capture_exceptions: false` overrides in `src/instrumentation-client.ts`.

---

## Signal sources

| source_product | source_type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | On by default — no row needed |
| `error_tracking` | `issue_created` | Enabled (id: 019f6f48-88bd-7a32-88b7-f2691d7db3b1) |
| `error_tracking` | `issue_reopened` | Enabled (id: 019f6f48-8c93-7580-8464-042fb8844d46) |
| `error_tracking` | `issue_spiking` | Enabled (id: 019f6f48-8f27-7ab1-937a-52424857bb34) |
| `session_replay` | `session_analysis_cluster` | Enabled (id: 019f6f48-9126-7ae5-8df6-d0016820cae5) — 10% sample rate (server default) |
| `conversations` | `ticket` | Enabled (id: 019f6f48-9637-7480-9840-0fca19d5fb9b) — idle until a channel is connected |
| `github` | `issue` | Enabled (id: 019f6f49-c801-7b28-82ba-2d3bccd5da3f) — syncing from warehouse source |
| `llm_analytics` | any | Skipped — no LLM/AI usage in this project |
| `logs` | any | Skipped — PostHog logs product not in use |

---

## Connected tools

| Tool | Status |
|---|---|
| GitHub Issues | **Connected by this setup** — warehouse source id `019f6f49-b17e-0000-17cd-910eb1255976`, first sync started. Only the `issues` table is syncing; more tables (PRs, commits) can be enabled in the PostHog data warehouse UI. |
| Linear | Not used (not selected) |
| Zendesk | Not used (not selected) |
| pganalyze | Not used (not selected) |
| Jira | Not used (not selected) |

---

## Scout troop

**Enabled (3):**

| Scout | Reason enabled |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers |
| `signals-scout-web-analytics` | Marketing site — per-channel traffic, attribution, and landing-page health are core metrics |
| `signals-scout-revenue-analytics` | Stripe SDK present — watches Stripe sync health and donation capture regressions |

**Disabled (23):**

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by the native `error_tracking` source (issue_created/reopened/spiking) |
| `signals-scout-session-replay` | Covered by the native `session_replay` source (session_analysis_cluster) |
| `signals-scout-product-analytics` | No saved funnels/retention flows found; web-analytics is the relevant specialist for this marketing site |
| `signals-scout-web-vitals` | Keeping specialist count to two; re-enable if Core Web Vitals regressions become a concern |
| `signals-scout-feature-flags` | No feature flag usage found on this marketing site |
| `signals-scout-surveys` | No surveys in use (0 surveys found) |
| `signals-scout-experiments` | No active A/B experiments |
| `signals-scout-ai-observability` | No `$ai_*` events or LLM SDK |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | B2C marketing site — no group/accounts analytics |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports configured |
| `signals-scout-data-warehouse` | Minimal warehouse usage (GitHub Issues only) |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry |
| `signals-scout-anomaly-detection` | Keeping troop small; re-enable if dashboards/insights are built out |
| `signals-scout-health-checks` | Keeping troop small; re-enable if PostHog health issues surface |
| `signals-scout-experiments` | No experiments |
| `signals-scout-replay-vision` | No Replay Vision scanners configured |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` telemetry |
| `signals-scout-observability-gaps` | Keeping troop small |
| `signals-scout-ingestion-warnings` | Keeping troop small |
| `signals-scout-insight-alerts` | No configured insight alerts |
| `signals-scout-inbox-validation` | No shipped fixes to validate yet (fresh setup) |
| `signals-scout-skills-store` | Not relevant for this project |

Re-enable candidates: `signals-scout-web-vitals` (if page performance becomes a concern), `signals-scout-feature-flags` (if feature flags are adopted), `signals-scout-surveys` (if surveys are launched).

---

## Custom scouts

**Proposed:** one candidate — "Watch corporate enquiry submissions for drops."  
**Rationale:** `corporate_enquiry_submitted` is a confirmed custom server-side event (in `src/app/(frontend)/actions/enquiry.ts`) and is the charity's primary lead signal. No built-in scout watches this event; `signals-scout-web-analytics` covers traffic but not conversion into enquiries.  
**Discriminator:** rolling-window drop in `corporate_enquiry_submitted` volume vs. prior-period baseline, broken down by `preferred_location`.  
**Decision:** Declined by user — built-in troop kept as-is.

**Surfaces considered and ruled out:**

| Surface | Filter that ruled it out |
|---|---|
| Newsletter signups | No confirmed PostHog events (Campaign Monitor handles subscription server-side; no custom capture found) |
| Location page engagement | Covered by `signals-scout-web-analytics` ($pageview traffic) |
| Donation funnel steps | Covered by `signals-scout-revenue-analytics` (Stripe health); no donation-step events confirmed |
| Error bursts around form submission | Covered by native `error_tracking` source |

**Noise escape hatch:** if any enabled scout becomes noisy, set `emit: false` on its config in PostHog Settings to switch it to dry-run without losing its schedule.

---

## Follow-ups

- [ ] **Enable products in settings:** Visit [Project Settings](https://us.posthog.com/project/200228/settings) and confirm Session Replay, Error Tracking, and Support (Conversations) are toggled ON. The `products-enable` API was not available via the current MCP token.
- [ ] **Connect a Support inbound channel:** The Conversations product is on but idle. Connect an email inbox, Slack channel, or other inbound channel in PostHog to start receiving support tickets. [PostHog docs: Conversations](https://posthog.com/docs/conversations)
- [ ] **Fix React #418 error:** Error tracking shows 24 occurrences of "Minified React error #418" (first seen 2026-07-09, 13 affected users). This is a server/client hydration mismatch. See [https://us.posthog.com/project/200228/error_tracking/019f25e8-59bc-7010-9dc4-8403b921517c](https://us.posthog.com/project/200228/error_tracking/019f25e8-59bc-7010-9dc4-8403b921517c).
- [ ] **GitHub Issues additional tables:** Only the `issues` table is syncing. To also sync PRs, reviews, or commits, enable additional schemas in [Data Warehouse](https://us.posthog.com/project/200228/data-management/sources).
- [ ] **Corporate enquiry scout (optional):** If you later want to watch `corporate_enquiry_submitted` volume for drops, re-run this setup or create a custom `signals-scout-corporate-enquiry` skill manually.

---

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes. Scouts run on a daily schedule and file findings as reports directly in the inbox — no weak signals, each report is a standalone item a human can act on. Error tracking findings (new issues, spikes, regressions) reach the inbox through the native source pipeline and may appear sooner. Check your inbox at:

**https://us.posthog.com/project/200228/inbox**
