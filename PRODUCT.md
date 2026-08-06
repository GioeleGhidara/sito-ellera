# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, roughly equal weight:
- **Residents of Ellera and the surrounding Valle Sansobbia** — use the site for practical local info: bus schedules, news, committee activity, Teatro Balomà, weather/trail alerts.
- **Visitors/tourists** — discover Ellera through the site: trekking/MTB trails, events (Caruggi e Lanterne, Albi Trail E-Bike Fest, Castagnata), local traditions and history.

Neither audience is primary; pages generally serve one or the other, and the site as a whole must keep both well served.

## Product Purpose

The official site for **Comitato Ellerese**, a volunteer committee that maintains and promotes the village of Ellera (a frazione of Albisola Superiore, Savona, Liguria). It publishes trekking/MTB trail info with GPX-backed maps, event listings (including paid registration for events like the E-Bike Fest), local traditions/history content, Teatro Balomà info and support, weather/trail alerts, news, and practical resident services (bus times, local food/shops). Success means residents stay informed and engaged, visitors are drawn to the village and its trails/events, and the committee's fundraising and community activities are supported.

## Positioning

Hyperlocal and 100% volunteer-run: no formal membership, no dues, open to anyone who wants to help. All proceeds from events and fundraising are reinvested entirely into the village (trail maintenance, events, community spaces) — never for any other purpose. This is a claim a generic tourism site or municipal page could not credibly make.

## Operating Context

Ellera is a small hamlet in the hills above Albisola Superiore (SV), Liguria, in the Valle Sansobbia. The site's content spans:
- 40+ km of maintained trekking/MTB trails in the "Albi Trail Area," with GPX tracks and generated technical metadata (distance, elevation, etc.).
- Recurring events, from simple data-driven listings to bespoke, heavily designed one-off pages (e.g. Albi Trail E-Bike Fest, Caruggi e Lanterne) with paid registration via Stripe checkout.
- Teatro Balomà, a community theater/multi-purpose center, with its own support/donation flow.
- Local traditions and history (streghe, mulini del colore, etc.) as long-form Markdown articles.
- Weather/trail-safety alerts via an ARPAL integration.
- A volunteer committee council with defined roles (president, treasurer, trail councillors, Balomà councillor, general councillors).
- Practical resident services: bus line 17 schedule (sourced from the official TPL document), local food and shop businesses.

## Capabilities and Constraints

Static React SPA (Vite) deployed to Vercel. Supabase Edge Functions handle the few dynamic/server-side bits: weather alerts and event registration + Stripe payment flows. Two distinct patterns for events — simple data-driven entries rendered through shared list/detail pages, versus bespoke one-off event pages with dedicated design, data, and static OG/social meta (SPAs can't self-serve per-route OG tags, so these get a generated static `index.html` per route). Content is a mix of plain TS data modules and Markdown (for long-form "tradizioni" articles); there is no CMS, so content changes go through code and a PR.

## Brand Commitments

Name: "Ellera" (site) / "Comitato Ellerese" (organization). Existing logo asset (`logoComitato`). Voice is warm, community-first, and deliberately non-corporate — e.g. "Ellera è di chi la ama," "Nessun 'socio', solo volontari."

## Evidence on Hand

Real committee structure and roles (Chi Siamo page); real bus schedule sourced from the official TPL document; real local businesses (food/shops) with actual names and addresses; real GPX trail tracks under `public/tracks/`; real event history (Caruggi e Lanterne, Albi Trail E-Bike Fest, Castagnata, etc.). No testimonials, press mentions, or benchmarks currently exist on the site — future work must not fabricate any.

## Product Principles

1. **Volunteer/non-profit honesty** — never imply a commercial motive; any claim about proceeds or reinvestment must stay true to "100% reinvested in the village."
2. **Equal service to two audiences** — don't let visitor-facing spectacle crowd out resident-facing utility (bus times, news) or vice versa.
3. **Hyperlocal specificity over generic tourism-site tropes** — real trail names, real business names, real committee roles ground every page.
4. **Practical info must stay trustworthy** — bus schedules, weather alerts, and trail data are safety/logistics-relevant and must never be stylized into inaccuracy.
5. **Low-friction participation** — the committee has no formal membership; design and copy should keep "anyone can help" easy and unintimidating.
