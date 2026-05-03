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

## Configurazione (.env)

Per far funzionare correttamente il progetto (sitemap, robots e chiamate a Supabase per le allerte meteo), devi creare un file `.env` nella directory principale partendo dal file `.env.example`.

Le variabili da inserire sono:
- `SECRET_TOKEN`: Token segreto o password del progetto.
- `VITE_SUPABASE_URL`: URL del tuo progetto Supabase (serve per le chiamate alle Edge Functions, es. `arpal-allerta`).
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Chiave pubblica anonima di Supabase.
- `VITE_SITE_URL`: Il dominio ufficiale del sito (es. `https://ellera.it`). È **fondamentale** che sia corretto, perché lo script di build lo usa per generare automaticamente la `sitemap.xml` e il `robots.txt`.
- `VITE_SITE_NOINDEX`: Imposta a `true` per disabilitare l'indicizzazione sui motori di ricerca (utile per ambienti di test).

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
