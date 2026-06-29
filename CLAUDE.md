# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Planstin CRM — a Next.js 15 (App Router) + TypeScript + Tailwind + Supabase rebuild of a single-page CRM used to manage employee-benefits client "groups" (renewals, open enrollment, transitions, workflows, reminders). It is migrating off a legacy single-file app: `index.html`, `crm-seed.js`, `support.js`, and `workflow-templates.js` at the repo root are artifacts of that legacy app (seed data / reference only) — do not build new features against them.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (`next/core-web-vitals`, `next/typescript`)

There is no test suite configured in this repo.

Database schema lives in `supabase/migrations/*.sql` (run manually against the Supabase project — no migration runner is wired up). `supabase/seed/*.sql` has seed data.

## Architecture

**Data flow:** Supabase (Postgres) → API routes (`app/api/**/route.ts`) → React Query hooks (`hooks/use*.ts`) → components. Components never call Supabase directly; everything goes through the Next.js API routes using a service-role client.

**snake_case ↔ camelCase boundary:** Postgres columns are snake_case; all TS domain types (`types/index.ts`) are camelCase. `lib/db-transforms.ts` is the single place this conversion happens — `transformX(row)` for DB→TS reads, and `xPatchToDb(patch)` for TS→DB writes (field-mapping tables, silently drops unknown keys). When adding a field to a table, you must update: the migration SQL, the type in `types/index.ts`, and both the transform and patch-to-db map in `lib/db-transforms.ts`.

**Server client:** `lib/supabase/server.ts` builds a service-role Supabase client per request (no RLS/session — auth is not yet implemented). Used only inside `app/api/**` route handlers.

**Composite resources:** A `Group` aggregates `notes`, `workflows` (with nested `sections`/`tasks`), and `contacts`. `workflows`/`workflow_tasks` are stored as flat relational rows and reconstructed into nested `Workflow[]` by `reconstructWorkflows()` in `lib/db-transforms.ts`. The group detail route (`app/api/groups/[id]/route.ts`) fans out parallel Supabase queries and assembles the full `Group` object server-side.

**Scoring/derived state (`lib/scoring.ts`):** `buildVM(group)` turns a raw `Group` into a `GroupViewModel` — computing reach-out priority `score`, `reasons`, OE window, renewal countdowns, workflow completion %, etc. This is the core "what needs attention" logic that drives the dashboard, reach-out queue, and groups table. If you change scoring weights or thresholds, this is the only file to touch. `lib/dates.ts` provides the ISO-date helpers (`daysUntil`, `fmt`, `addInterval`, …) that scoring and components build on — dates are stored/passed as `YYYY-MM-DD` strings, not `Date` objects, except internally.

**State management split:**
- Server state (groups, notes, workflows, reminders, etc.) → React Query, one hook file per resource in `hooks/` (e.g. `useGroups.ts`, `useReminders.ts`). Mutations use optimistic updates via `onMutate`/`onError`/`onSettled` — follow the existing pattern in `useGroups.ts` (`useUpdateGroup`) when adding new mutations.
- Client-only UI state (search, filters, sort, modal visibility, expanded/collapsed rows) → single Zustand store at `lib/store.ts` (`useUIStore`). Don't create new Zustand stores or React context for this — extend `useUIStore`.

**Routing:** Everything under the `(crm)` route group (`app/(crm)/`) shares the persistent shell in `app/(crm)/layout.tsx` (Sidebar + Header + AddGroupModal). `app/page.tsx` just redirects to `/dashboard`. Pages: `dashboard`, `groups`, `groups/[id]`, `groups/[id]/prep` (meeting prep view), `calendar`, `templates`, `settings`.

**Calendar windows/banners (`components/calendar/CalendarView.tsx`, `AgendaView.tsx`):** date ranges that apply to multiple groups — the transition handoff window (`handoffWindowStart`/`handoffWindowEnd`) and the OE window (`oeStartDate`/`oeEndDate`) — render as continuous multi-day banners (like a Google Calendar event), not per-day chips. Both share one generic pipeline: `WindowGroup` (`{ start, end, groups }`, merging groups that share identical dates into a single banner) → `buildWeekBanners(windows, weekDays, kind: BannerKind, getLabel, getColor)` (greedy lane-packing so overlapping windows stack instead of colliding) → a banner row clickable to a popover listing the groups in that window. `AgendaView.tsx` (the list-view alternative to the month grid) consumes the same `WindowGroup[]` data. Adding a third window kind means: a `buildXWindows()` grouping function, label/color functions passed into `buildWeekBanners`, and a popover/agenda branch on `kind` — not a new rendering system.

**Transition-handoff intake (`lib/intake-parser.ts`, `lib/dates.ts`):** groups arrive in onboarding batches with a freeform "transition timeline" string (e.g. `"6/24-7/1"`). `parseTransitionWindow()` turns that into real `handoffWindowStart`/`handoffWindowEnd` dates at intake time (anchored to the current year — these are one-time onboarding dates, not recurring annual ones — so it never rolls a date forward into next year just because it's already past). `firstOfNextMonth()` then default-fills `fullOwnership`/`commissionEffective` (the derived business rule: ownership transfers on the 1st of the month after the handoff window starts) — only if those fields are still empty, so a manual edit is never clobbered by re-pasting intake notes. Overdue handoffs (window passed, `changeCompleted` still false) must never be auto-hidden or silently completed — surface them, don't drop them.

**Styling:** Tailwind with theme tokens defined as CSS variables and mapped in `tailwind.config.ts` (`canvas`, `ink`, `accent`, `line`, `sidebar-bg`, etc.) — use these semantic tokens rather than raw Tailwind colors so light/dark theming (via `next-themes`, `darkMode: 'class'`) stays consistent. Status colors in `lib/scoring.ts` (`statusInfo`) use `oklch()`.

**Path alias:** `@/*` maps to the repo root (see `tsconfig.json`).
