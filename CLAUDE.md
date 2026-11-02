# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Status

The walk check-in app is built end to end and deployed (production alias: `https://walk-checkin.vercel.app`; per-deployment `*.vercel.app` URLs sit behind Vercel Authentication, so verify on the alias).

- Pages: `/` (start-walk form), `/walk/[token]` (walker's "I'm home" page), `/f/[id]` (friend page, polls every 5s).
- API routes: `POST /api/walks`, `GET /api/walks/[id]` (public status, never returns the walker token), `POST /api/walks/arrive`.
- Database: one Neon Postgres table, `walks` (`db/schema.sql`), accessed through `lib/db.ts`.
- `lib/status.ts` holds `getStatus` (home → overdue → walking), computed on request using the database's `now()`; nothing is stored as "overdue".
- `proxy.ts` checks that a walk exists and hasn't expired before `/walk/[token]` and `/f/[id]` render, so unknown or expired links get a real 404 (the pages stream behind `<Suspense>`, which would otherwise send 200).
- Demo only, by the owner's choice: every page shows a "Demo only" banner and is `noindex` (`app/layout.tsx`, `app/robots.ts`); only 1, 5 and 15 minute walks are allowed and at most 25 walks can be live (`lib/demo-limits.ts`, enforced in `POST /api/walks`). Don't add real-use features without asking.
- Retention: `lib/retention.ts` holds the 24-hour window and the purge; `GET /api/cron/purge` runs daily via Vercel Cron and, if `CRON_SECRET` is set, requires it as a bearer token.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000 (Turbopack)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (flat config: next core-web-vitals + typescript)
npx tsc --noEmit  # type-check (no dedicated script)
```

There is no test framework set up yet.

## Stack and versions

Next.js 16.4 (App Router), React 19.3, TypeScript (strict), Tailwind CSS v4. These are newer than most training data — check `node_modules/next/dist/docs/` (`01-app/` for App Router) before using any Next.js API, as AGENTS.md says.

## Configuration that affects how code must be written

`next.config.ts` enables:

- **`cacheComponents: true`** — the Cache Components caching model (`"use cache"` directive etc.). Do not use the older `fetch` cache / `revalidate` segment-config patterns; see `01-app/01-getting-started/08-caching.md` and `09-revalidating.md`.
- **`partialPrefetching: true`** — staged navigation (App Shell → prefetched URL data → full render). See `01-app/02-guides/optimizing-prefetching.md`.
- **`experimental.agentFeedback: true`** — this is why `next dev` (re)writes the block in `AGENTS.md`. Commit `AGENTS.md` changes along with your work rather than reverting them.
- **Tailwind via Turbopack loader** — CSS is processed by `@tailwindcss/turbopack` (configured under `turbopack.rules`), not PostCSS; there is no `postcss.config` or `tailwind.config`. Theme tokens live in `app/globals.css` under `@theme inline` (`--color-background`, `--color-foreground`, Geist font vars).

## Conventions

- Path alias `@/*` maps to the repo root.
- Layouts/pages use Next's global typed route helpers (e.g. `LayoutProps<"/">` in `app/layout.tsx`) rather than hand-written props types.
- Deployed on Vercel (`.vercel/` is linked); pushing to `main` auto-deploys to production.
- `.env.local` was created by the Vercel CLI, but the Neon vars are Secret type, so `vercel env pull` only writes `"[SENSITIVE]"` placeholders for them. `DATABASE_URL` in `.env.local` is pasted in by hand from the Neon dashboard (pooled connection string). Never print it.

# Project scope
@SCOPE.md

# How to work with me
- I'm learning this stack. Small steps, one feature at a time.
- Explain the plan in plain English before writing code.
- No new dependencies without asking.
- API routes that touch the database run on the Node.js runtime (never Edge). With Cache Components this is the default, and the docs say not to export `runtime` at all (including `runtime = "nodejs"`), so leave the export out.
- Store all times in UTC; convert to local time only for display.

# Data & privacy rules
- Store only nickname + walk times. Never location, destination, phone, email.
- No analytics, pixels, third-party scripts, or tracking; ask before adding any.
- No personal data in cookies, localStorage, or logs.
- Secrets only in env vars; never NEXT_PUBLIC_ for secrets. The browser never talks to the DB: only server code (API routes, server components, `proxy.ts`) queries it.
- API responses return only needed fields; never return walker_token.
- Walks expire 24 hours after `started_at` (`WALK_TTL_HOURS` in `lib/retention.ts`; the privacy note on `/` says 24 hours, so change both together). Every query that reads a walk must filter on that window. Expired rows are purged by `/api/cron/purge` (daily, `vercel.json`) and whenever a new walk starts.
