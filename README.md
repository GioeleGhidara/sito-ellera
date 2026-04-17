# Sito Ellera

Repository del sito ufficiale di Ellera.

## Panoramica

Il progetto raccoglie in un unico frontend le sezioni dedicate a outdoor, cultura, tradizioni, eventi, news e servizi locali. Il sito include mappe interattive con Leaflet e tracce GPX statiche pubblicate da `public/tracks/`.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Leaflet
- React Router
- TanStack Query
- vite-plugin-pwa

## Funzionalità principali

- Pagine editoriali per eventi, news, tradizioni e servizi.
- Mappe interattive per trekking e trail MTB.
- Tracce GPX statiche disponibili in `public/tracks/`.
- PWA offline-first con service worker in auto update.
- Precache dei file `.gpx` per garantire disponibilità offline dei percorsi.
- Cache runtime delle tile OpenStreetMap dopo il primo utilizzo.

## Sviluppo locale

```bash
npm install
npm run dev
```

## Build e verifica

```bash
npm run build
npm test
```

La build di produzione viene generata in `dist/`.

## Struttura utile

- `src/`: applicazione React e componenti UI.
- `public/tracks/`: tracce GPX pubblicate come asset statici.
- `public/loghi/`: loghi e asset SVG serviti direttamente.
- `scripts/`: script di generazione metadata e sitemap.

## PWA e offline

- Il manifest viene generato da `vite-plugin-pwa`.
- Il service worker usa `registerType: "autoUpdate"`.
- I file GPX sono inclusi nel precache.
- Le tile mappa già visitate restano disponibili offline finché presenti in cache.
