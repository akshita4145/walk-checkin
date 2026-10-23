# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Status

Freshly scaffolded `create-next-app` project (single commit). `app/page.tsx` and the `metadata` in `app/layout.tsx` are still template placeholders — the actual walk check-in app has not been built yet.

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
- Deployed on Vercel (`.vercel/` is linked); `.env.local` was created by the Vercel CLI (`vercel env pull`).

# Project scope
@SCOPE.md

# How to work with me
- I'm learning this stack. Small steps, one feature at a time.
- Explain the plan in plain English before writing code.
- No new dependencies without asking.
- API routes that touch the database use runtime = "nodejs".
- Store all times in UTC; convert to local time only for display.
