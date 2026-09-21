# Hackathon log

- **Project:** VRADR
- **Event:** Convex All Gas Hackathon
- **What it does:** Real-time global visa tracking dashboard with AI-powered wait time predictions, embassy scraping, smart alerts, app inbox, and per-visa application guides.
- **Live app:** not deployed (run locally: `npx convex dev` + `pnpm dev`)
- **Demo:** none recorded yet
- **Repo:** none
- **Frontend:** Convex static hosting
- **Convex deployment:** local (`local:local-bankole_david-vradr_app`)
- **Components:** none
- **Convex features:** schema, queries, mutations, actions, indexes, crons, HTTP webhooks, auth
- **Auth:** Convex Auth (Password provider)
- **AI models:** gpt-4o-mini (wait-time prediction wired into country detail)
- **Data feed:** Firecrawl v2 scrape API (feed sources + 12h cron + manual scrape)
- **Inbox:** AgentMail REST + message.received webhook (inbox tab, compose, thread view, wait-time email alerts)
- **Started:** 2026-08-26T09:56:00Z
- **Last updated:** 2026-09-04T02:00:00Z
## Log

### 2026-08-26 - working tree
Environment setup for Convex All Gas Hackathon. Installed Convex agent skills (33
skills) and configured Convex MCP server in OpenCode. Installed hackathon
build-log skill. Project directory initialized, ready to begin building.

### 2026-08-26 - working tree
Core application scaffolded. Landing page with editorial design (Fraunces + Inter
fonts, cream/terracotta/navy palette). Dashboard with search, country detail
panel, and stat cards. Convex backend with visaTimelines, visaApplications, and
alerts tables. Queries for global stats, country lookup, visa type filtering,
and search. Vite + React + Tailwind v4 configured. Production build passes.

### 2026-08-26 - working tree
Major UI overhaul inspired by Usance design system. Dark/light theme with CSS
custom properties and localStorage persistence. Landing page with full-bleed hero,
grain texture overlay, SVG globe illustration, numbered steps section, visa card
preview, feature grid with SVG icons, FAQ accordion, and cinematic closer section.
Dashboard with sticky nav, KPI row, search with risk badges, country detail cards,
and popular countries grid. All inline SVG assets for zero network dependencies.

### 2026-08-26 - working tree
UI polish pass. Centered hero text, reduced spacing, added real Unsplash images
(hero background, steps illustration, closer background). Fixed broken airport image
image URL. Added IntersectionObserver fade-in animations across all sections with
staggered delays. Dashboard redesigned: emoji-based visa type pill selector
replacing generic dropdown, flag icons on country cards, KPI cards with accent
color and decorative SVG, country detail panel with summary stats (avg/fastest/
slowest), visa type cards with hover lift. Added subtle dot pattern on cards and
diagonal line pattern on sections. Build passes (327KB JS, 15KB CSS).

### 2026-08-26 - working tree
Full feature dashboard + auth + Terms/Privacy. Added Convex Auth with Password
provider (signIn/signUp page). Full dashboard with 6 tabs: Search (country+visa
pills, results, country detail with flagcdn flags, summary stats, trend arrows,
watchlist), Tracker (add/remove applications, status badges, days elapsed, status
update buttons), Alerts (list, mark read, mark all, type-based icons), Compare
(multi-country selection, cross-country comparison with ranking, avg/min/max), 
Intelligence (peak seasons, policy changes, success tips with accordions), and
Hub (document checklists per visa type, seasonal insights grid). New backend:
applications.ts, alerts.ts, watchlist.ts (all auth-aware via getAuthUserId),
visa.ts with compare/getPopularCountries/getTrends queries. Terms of Service
and Privacy Policy pages. Landing page footer links to Terms/Privacy. Sign-out
button in dashboard nav. Build passes (381KB JS, 15KB CSS).

### 2026-08-26 - working tree
Dashboard UX simplification + personalization by country of origin. Consolidated
6 overwhelming tabs into 3 focused sections (Search, My Apps, Tools with nested
compare/intelligence/documents). Rebuilt dashboard styling with a cleaner editorial
layout: floating pill nav with logo, pill tab bar, gradient hero title, dedicated
classes instead of inline styles, accent average-time callout card, hover-lift
country/visa cards, compare ranking list. NEW: signup now asks "Where are you based?"
with a searchable 29-country picker (flag icons) — stored on the users profile.
Dashboard becomes personalized: origin country gets a "Popular for you" row of their
most-likely visa destinations (e.g. Nigeria → US/UK/Canada/Germany) shown first,
plus a "Visas from <country>" hero title. Added users table + users.ts backend
(getProfile/createProfile), tsconfig.json + @types/react/@types/react-dom/@types/node
for the first real tsc typecheck, and a per-origin destination map. Build passes
(388KB JS, 31KB CSS).

### 2026-08-26 - working tree
Simplified dashboard landing to communicate value in one glance (not overwhelming).
Added a real-time "big answer" card computed live from seed data via a new
visa.getFastestFor query: the fastest visa among the user's top destinations
(e.g. "Fastest from Nigeria right now: United Kingdom Tourist visa, 15 days")
with a pulsing Live indicator. Landing now reads left-to-right: quick search,
the one big answer, a compact 4-card "Top destinations for you" row, visa filter
pills, and the full country grid collapsed behind a "Browse all countries" toggle
so it never clutters the default view. Replaced the always-open duplicate
"Popular for you" grid + all-countries grid with this tighter hierarchy. Build
passes (389KB JS, 34KB CSS).

### 2026-08-30 - landing rebuild (requested style)
Rebuilt the landing page from scratch in the user's original tight/minimal style:
blue dark-photo hero, cream canvas, passport-blue accent, Fraunces + Inter
(reverted @theme fonts, dropped the swapped Playfair/Space Grotesk and the
Instrument Serif TaglineReveal + whole editorial CSS block). Floating-pill nav
(VRADR boxed wordmark, no underline), hero headline "Stop refreshing embassy
sites. We track it for you." with inline stats + a product-mockup result card,
3-step how-it-works, 6 feature cards, accordion FAQ, dark globe CTA band, slim
footer. Added a new Illustrations.tsx (stamp, globe-with-plane, passport,
sparkle, squiggle) so the "space" is filled with on-brand vector illustrations
instead of dead padding; compact 48-56px section rhythm. tsc passes, vite build
passes (389KB JS, 35KB CSS), 7 auth-flow tests pass.

### 2026-09-04 - working tree
Dashboard hardening + settings. Gear-icon settings menu with three compact modals
(Profile edit with name + home country, Export my data as JSON download, Delete
account with redirect). Rewrote the custom Select to the simple signup-style
absolute-anchored dropdown (no fixed positioning, no viewport measuring). Added a
branded loading screen, a 404 page wired as the authenticated catch-all, and an
error boundary around the app. Apps tab badge now shows the tracked-application
count always (even at 0) on desktop tabs and the mobile bottom nav. Fixed the
Profile Home-country picker to use the residence-country list (Nigeria, India,
Philippines, Kenya...) instead of the destination-country list, so "No options"
no longer appears. tsc clean, tests pass, build passes (404KB JS, 120KB gzip).

### 2026-09-04 - working tree
Fixed the auth/profile sync root cause. A DB dump proved identity.subject is a
"userId|sessionId" pipe composite (never the users row _id) and identity.email is
empty at first signup — which is why signups created two users rows, email stayed
blank, and country never stuck. Fix: resolveProfile splits the subject on "|" and
reads by row id first; createProfile/updateProfile upsert onto that row without
duplicating or clobbering a real email with ""; the auth callback normalizes any
legacy composite userId back to the pure id on sign-in. Added a regression test
for the composite-subject + empty-email path. Backend comments trimmed to
one-liners. tsc clean, 8/8 auth-flow tests pass, build passes.

### 2026-09-04 - working tree
Sponsor stack does real work now. Firecrawl upgraded to v2 with a feedSources
table, scrapedPages storage, a 12h feed cron, manual scrape action, and seed
sources (was v1, embedded URL map). AgentMail rewired to the real REST API
(api.agentmail.to send endpoint) plus a message.received HTTP webhook that lands
inbound mail in a new emails table; new Inbox tab with thread view, compose, and
wait-time email alerts via corrected notify.ts. OpenAI prediction actually wired
into the UI: country detail has an AI prediction card calling predictWaitTime
with recent history. Visa model expanded beyond 6 generics: B1, B2, B1/B2, H-1B,
L-1, O-1, F-1, J-1 with per-type document checklists plus a who/process/qualifies
guide in the Hub, and seed rows for US B1/B2, H-1B, F-1, J-1. Swapped
lucide-react for heroicons across all 8 UI files. 14/14 tests pass, build passes.

### 2026-09-04 - working tree
Hub rebuilt around live data instead of static lists. Per-type live strip (current
avg wait, faster/slower-than-usual trend, country coverage, updated date from real
timeline rows), an apply-by-date planner (travel date minus live wait plus buffer),
tappable document chips with a ready count, a step-by-step process stepper, and
qualify badges. Search filter pills grouped (Travel/Work/Study/Business/Transit/
Family) with inline sub-pills (B1, B2, H-1B, L-1, O-1, F-1, J-1) that actually filter
the grid and search via a new getTypeAverages query. 17/17 tests pass.

### 2026-09-04 - working tree
Prep tab: SOP Studio (OpenAI drafts from your details, editable, saved per user),
mock interviews (officer questions, per-answer scores with model answers, saved
sessions with averages), opportunity radar (12 seeded scholarships + work routes
with deadlines, countdowns, reminders into alerts, Firecrawl recheck per listing),
and Study/Work/Talent roadmaps as steppers with requirement chips. New tables:
sops, interviewSessions, opportunities. OPENAI_BASE_URL + OPENAI_MODEL envs make
the endpoint and model swappable (free-tier gateways for dev, official API for
demo traffic). 25/25 tests pass, build passes.

### 2026-09-04 - working tree
Work-route intelligence beyond one country. NZ Work roadmap (AEWV 3-check flow,
Green List tiers, Seek/TradeMe hunting, landing-week tasks) generalized to UK
Work (Skilled Worker vs Global Talent), Canada Work (Express Entry vs LMIA),
Australia Work, Germany Work (Blue Card vs Opportunity Card), and US Work
(H-1B/O-1/L-1), each with steps, needs, scam warnings, and official source links
rendered in the stepper. Green List Tier 1/2 roles plus Canada/Australia routes
seeded into opportunities (seed is now additive). AEWV added as a full visa type
(checklist, guide, pills). tsc clean, 25/25 tests pass, build passes.

### 2026-09-04 - working tree
Alerts finally fire for real: every timeline write goes through a shared
recordTimeline helper, and on a real change all watchers get an in-app alert
plus a scheduled email. Added a watchlist by_place index to reach watchers.
Loading states: skeleton cards for the country grid and app list, 8s boot gate
with retry. Concurrency stress test: 15 parallel signups with tracking, all
isolated. tsc clean, 27/27 tests pass, build passes.

### 2026-09-04 - working tree
Email pivoted to the app's own service: one AgentMail inbox sends onboarding,
alerts, and reminders for everyone instead of per-user inboxes (fits the free
tier: 3 inboxes would cap us at 3 users). New users get a welcome email on
signup via scheduler. Reads scoped to signed-in users, webhook idempotent,
20/day send cap per sender. tsc clean, 27/27 tests pass, build passes.
