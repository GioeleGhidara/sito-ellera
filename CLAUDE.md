# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Official website for Ellera (a village in Liguria, Italy) — editorial content, interactive
trekking/MTB maps, events, news, and local services. Static React SPA deployed to Vercel, with
Supabase Edge Functions for a few dynamic bits (weather alerts, event registration/payments).

## Commands

```bash
npm run dev              # start Vite dev server (port 8080)
npm run build             # production build (runs prebuild: sitemap + trail metadata, then vite build + generate-social-pages)
npm run build:dev         # development-mode build, same post-steps
npm run lint               # eslint .
npm test                   # vitest run (single run)
npm run test:watch         # vitest watch mode
npx vitest run src/lib/weather.test.ts   # run a single test file
npm run seo:sitemap        # regenerate sitemap.xml / robots.txt only
npm run trail:metadata     # regenerate trail technical metadata only
```

Package manager: `bun.lock` and `package-lock.json` both exist; either bun or npm works, but check
which was used most recently before mixing lockfile changes into a commit.

Env vars (see `.env.example`) are required for local dev: `VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL` (used by the sitemap generator — must be correct),
`VITE_SITE_NOINDEX`, `VITE_TURNSTILE_SITE_KEY`, `SECRET_TOKEN`.

No test-writing convention is enforced beyond `vitest` + `jsdom`; tests live under `src/test/` and
as `*.test.ts` next to source (e.g. `src/lib/weather.test.ts`).

## Architecture

**Routing** is centralized: `src/lib/routes.ts` defines the `ROUTES` map (single source of truth
for paths) plus helper builders (`eventDetailPath`, `tradizioneDetailPath`, `newsDetailPath`,
`serviziSectionPath`). `src/App.tsx` builds a `createBrowserRouter` route table from `ROUTES`,
lazy-loading every page except the home page (`Index`). When adding a route, add it to `ROUTES`
first, then wire it into `appRoutes` in `App.tsx`.

**Two patterns for "event" pages** — know which one applies before editing:
1. **Generic/data-driven events**: entries in `src/data/events/events.ts` (`EventItem[]`) are
   rendered through the shared `Eventi` (list) and `EventDetail` (`/eventi/:slug`) pages. Add a
   new simple event by adding an object to this array.
2. **Dedicated one-off event pages**: bespoke, heavily-designed events (e.g.
   `AlbiTrailEbikeFest`, `CaruggiELanterne`) get their own route, page component under
   `src/pages/events/`, and often their own data folder under `src/data/events/<slug>/` and
   components under `src/components/features/events/<slug>/`. These are also added as
   `customPages` entries in `scripts/generate-social-pages.mjs` so a static, crawler-friendly
   `index.html` with correct OG/Twitter meta gets emitted into `dist/<route>/` post-build (SPAs
   can't self-serve per-route OG tags, hence this script).

**Content sources**: editorial/static content is split between plain TS data modules
(`src/data/core/*.ts`, `src/data/culture/*.ts`, `src/data/trails/*.ts`) and Markdown files
(`src/content/tradizioni/*.md`) for longer-form "tradizioni" articles. GPX tracks live as static
assets in `public/tracks/`; trail technical metadata (distance/elevation/etc.) is generated at
build time by `scripts/generate-trail-technical-metadata.mjs` from those GPX files into
`src/data/trailTechnicalMetadata.ts` — don't hand-edit that generated file.

**SEO**: `src/lib/seo.ts` holds shared constants (`SITE_NAME`, `DEFAULT_OG_IMAGE`, etc.) and
JSON-LD builders (`createWebSiteJsonLd`, `createOrganizationJsonLd`, `createPlaceJsonLd`);
`src/lib/jsonLd.ts` has more page/event-specific structured data helpers. `src/components/shared/Seo.tsx`
is the per-page `<Helmet>` wrapper — every routed page should render it. `scripts/generate-sitemap.mjs`
walks routes/data to emit `sitemap.xml` and `robots.txt` at build time using `VITE_SITE_URL`.

**PWA**: service worker registers with `autoUpdate`; GPX files are precached for offline trail use;
OSM map tiles get runtime-cached after first visit. (Configured via `vite-plugin-pwa`, though the
plugin registration itself may be conditionally included in `vite.config.ts`.)

**Supabase**: `src/integrations/supabase/client.ts` is the browser client (uses
`VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY`). Server-side logic lives in
`supabase/functions/*` as Deno Edge Functions: `arpal-allerta` (weather alerts, consumed by
`src/lib/weather.ts`/`src/lib/arpal.ts`), and `create-stripe-checkout` / `stripe-webhook` /
`submit-registration` / `validate-promo` for event registration + Stripe payment flows (used by the
E-Bike Fest registration form). Corresponding SQL migrations are in `supabase/migrations/`.

**Maintenance mode**: `src/config/maintenance.ts` (`MAINTENANCE_CONFIG`) is a manual per-section
flag map; when a flag is `true` the corresponding page renders `MaintenanceView` instead of its
normal content. Check this file when a page appears blank/placeholder unexpectedly.

**Path alias**: `@/*` → `src/*` (configured in `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`,
and `components.json`) — use it instead of relative `../../..` imports.

**UI components**: shadcn/ui setup (`components.json`, `src/components/ui/`) with Tailwind
(`tailwind.config.ts`, base color `slate`, CSS variables enabled). Feature components are grouped
under `src/components/features/<domain>/` (events, trail, weather, home, art); cross-cutting
components live in `src/components/shared/` and `src/components/layout/`.

**TypeScript** is configured loosely on purpose (`strictNullChecks: false`, `noImplicitAny: false`,
`noUnusedLocals`/`noUnusedParameters` off) — don't tighten these without discussing, and don't treat
unused-var/implicit-any as lint errors since the config intentionally allows them.
