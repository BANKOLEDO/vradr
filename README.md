# VRADR — Visa Wait Tracker

Real-time global visa wait dashboard. Personalized by home country, fed by embassy scrapes, with AI predictions, application tracking, and an app inbox.

## Stack

- Frontend: React 19, Vite, Tailwind v4, Heroicons
- Backend: Convex (queries, mutations, actions, crons, HTTP webhooks, Convex Auth password provider)
- Data: Firecrawl v2 scrape API
- Inbox: AgentMail REST + webhooks
- AI: OpenAI gpt-4o-mini (wait-time predictions)

## Run locally

Prereqs: Node 18+, pnpm.

```bash
pnpm install
npx convex dev        # backend on http://127.0.0.1:3210
pnpm dev              # frontend on http://localhost:5173
```

Seed data (in a second terminal once Convex is up):

```bash
npx convex run seed:seed
npx convex run seed:seedFeeds
```

## Env vars (Convex dashboard or `.env.local` for Convex)

| Var | Needed for |
| --- | --- |
| `FIRECRAWL_API_KEY` | Embassy + feed scrapes |
| `OPENAI_API_KEY` | AI wait predictions |
| `AGENTMAIL_API_KEY` | Sending mail, alerts |
| `AGENTMAIL_INBOX_ID` | App inbox identity |
| `AGENTMAIL_API_URL` | Optional, defaults to `https://api.agentmail.to` |
| `AGENTMAIL_WEBHOOK_SECRET` | Optional shared secret for the inbound webhook |

Without keys the app runs on seed data; key-gated features explain themselves in the UI.

AgentMail inbound mail: point a `message.received` webhook at `/agentmail/webhook` on the Convex deployment (use a tunnel for local dev).

## Scripts

- `pnpm dev` — frontend
- `pnpm build` — production build
- `pnpm test` — backend integration tests (vitest + convex-test)
- `npx tsc --noEmit` — typecheck

## Layout

- `convex/` — schema, queries, mutations, actions, crons, HTTP routes
- `src/pages/` — Landing, Dashboard, AuthPage, Terms, Privacy, NotFound
- `src/components/` — shared UI
- `hackathon.md` — build log
