import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

/**
 * Genera, per OGNI rotta pubblica del sito (non solo per le 3 pagine evento
 * come faceva il vecchio generate-social-pages.mjs), una copia statica di
 * dist/index.html con <title>, meta description, <link rel="canonical"> e
 * OG/Twitter tag corretti per quella rotta specifica.
 *
 * Perché: essendo una SPA client-side (createRoot, non hydrateRoot), Vercel
 * serve lo stesso index.html "vuoto" per ogni rotta (vedi i rewrite in
 * vercel.json) finché React non monta. Google vede quindi decine di pagine
 * con HTML iniziale pressoché identico — nessun canonical, stesso titolo,
 * stessa description — e le tratta come duplicati, scegliendo lui stesso
 * quale indicizzare o scartandole ("Scansionata, non indicizzata" in
 * Search Console). Dare a ogni rotta un <head> distinto e un canonical
 * corretto fin dal primo byte risolve il problema alla radice, senza dover
 * fare un rendering headless completo (rischioso in build su Vercel) e
 * senza toccare main.tsx: il contenuto React sostituisce comunque questo
 * shell non appena il JS carica.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const sitemapPath = path.join(distDir, "sitemap.xml");

if (!existsSync(indexPath)) {
  console.error("[page-shells] Errore: dist/index.html non trovato. Esegui prima la build.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// env / site url — stesso identico meccanismo di generate-sitemap.mjs, per
// restare coerenti su quale VITE_SITE_URL viene usato in questa build.
// ---------------------------------------------------------------------------

const parseEnvFile = (source) => {
  const values = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "").trim();
    }
    values[key] = value.replace(/\\n/g, "\n");
  }
  return values;
};

const loadEnv = async () => {
  const mode = process.env.MODE || process.env.NODE_ENV || "production";
  const envFiles = [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`];
  const loaded = {};
  for (const fileName of envFiles) {
    try {
      const content = await fs.readFile(path.join(projectRoot, fileName), "utf8");
      Object.assign(loaded, parseEnvFile(content));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return loaded;
};

const loadedEnv = await loadEnv();
const siteUrl = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  loadedEnv.SITE_URL ||
  loadedEnv.VITE_SITE_URL ||
  "https://www.ellera.it"
).replace(/\/+$/, "");

// ---------------------------------------------------------------------------
// Costanti SEO — mirror di src/lib/seo.ts (qui non possiamo importarlo: gira
// fuori da Vite e usa import.meta.env, non disponibile in uno script node puro).
// ---------------------------------------------------------------------------

const SITE_NAME = "Ellera";
const DEFAULT_DESCRIPTION =
  "Scopri Ellera, borgo della Liguria tra galleria a cielo aperto, outdoor nella Valle Sansobbia, tradizioni, teatro ed eventi del Comitato Ellerese.";
const DEFAULT_OG_IMAGE = `${siteUrl}/og/comitato-ellerese.jpg`;

const buildPageTitle = (title) => {
  if (!title) return SITE_NAME;
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
};

// ---------------------------------------------------------------------------
// Metadati delle pagine statiche — copiati 1:1 dalle prop <Seo title=.../>
// di ogni pagina in src/pages. Se cambi il testo lì, aggiornalo anche qui.
// ---------------------------------------------------------------------------

const STATIC_PAGES = {
  "/": { title: "Ellera", description: DEFAULT_DESCRIPTION },
  "/trekking": {
    title: "Trekking",
    description: "Scopri i principali percorsi trekking da Ellera tra boschi, crinali panoramici e sentieri storici dell'entroterra savonese.",
  },
  "/albi-trail-area": {
    title: "Albi Trail Area, MTB a Ellera",
    description: "Esplora l'Albi Trail Area di Ellera: trail MTB tra discese tecniche, risalite pedalate e mappe GPX nel cuore della Liguria.",
  },
  "/meteo-allerte": {
    title: "Meteo",
    description: "Previsioni meteo per Ellera e stato di allerta ARPAL per la Zona B della Liguria. Condizioni aggiornate per escursioni e attività outdoor.",
  },
  "/teatro-baloma": {
    title: "Teatro Balomà a Ellera",
    description: "Ex cinema di Ellera rinato come spazio culturale: storia, recupero, programmazione recente, affitto sala e contatti del Teatro Balomà.",
  },
  "/teatro-baloma/sostieni": {
    title: "Sostieni il Teatro Balomà",
    description: "Bonifico e contatti utili per sostenere il progetto del Teatro Balomà a Ellera.",
  },
  "/galleria-arte": {
    title: "Galleria d'Arte",
    description: "Visita la galleria a cielo aperto di Ellera: 50 pannelli ceramici, artisti italiani e internazionali e un borgo trasformato in percorso d'arte.",
  },
  "/storia": {
    title: "Storia",
    description: "Scopri la storia di Ellera: l'etimologia dal latino Hedera, la fondazione dei monaci benedettini, i mulini del colore e la rinascita come borgo d'arte.",
  },
  "/comitato": {
    title: "Chi Siamo",
    description: "Il Comitato Ellerese: chi siamo, la nostra missione e il nostro impegno per la valorizzazione del borgo di Ellera.",
  },
  "/eventi": {
    title: "Eventi",
    description: "Esplora il calendario degli eventi di Ellera: feste, cultura e outdoor nel borgo.",
  },
  "/servizi": {
    title: "Servizi a Ellera: bus, negozi e dove mangiare",
    description: "Consulta i servizi di Ellera: orari bus, attività commerciali, botteghe e posti dove mangiare nel borgo.",
  },
  "/tradizioni": {
    title: "Tradizioni",
    description: "Scopri tradizioni, leggende, mestieri e memorie di Ellera attraverso i racconti che hanno plasmato l'identità del borgo.",
  },
  "/news": {
    title: "News",
    description: "Leggi le ultime news da Ellera: progetti del Comitato Ellerese, eventi, cultura, outdoor e novità dal borgo.",
  },
  "/albi-trail-ebike-fest": {
    title: "Albi Trail E-Bike Fest 2026 | Ellera",
    description: "14 Giugno 2026 - Ride + pranzo sui sentieri dell'Albi Trail Area di Ellera. Iscriviti ora.",
    image: `${siteUrl}/og/ebike-fest-2026.jpg`,
  },
  "/eventi/la-pedaliamo-insieme-2026": {
    title: "La Pedaliamo Insieme 2026 | Ellera",
    description: "31 Maggio 2026 - Una giornata di pedalata collettiva in beneficienza tra Albisola Superiore ed Ellera. Percorsi per tutti i livelli, area bambini e rinfresco finale.",
    image: `${siteUrl}/og/pedaliamo-insieme.jpg`,
  },
  "/caruggi-e-lanterne": {
    title: "Caruggi & Lanterne 2026 - Ellera (Albisola Superiore)",
    description: "Il borgo di Ellera si illumina con oltre 200 lanterne e si accende di musica, gastronomia e tradizioni della Notte Ligure.",
    image: `${siteUrl}/images/events/caruggi-lanterne/manifesto.avif`,
  },
  // Pagine legali: noindex intenzionale (già gestito da Seo.tsx lato client,
  // qui lo rendiamo vero fin dal primo byte).
  "/privacy": {
    title: "Informativa Privacy - Albi Trail E-Bike Fest",
    description: "Informativa sul trattamento dei dati personali (GDPR) del Comitato Ellerese per l'Albi Trail E-Bike Fest.",
    noindex: true,
  },
  "/regolamento": {
    title: "Regolamento Generale Eventi - Comitato Ellerese",
    description: "Norme di partecipazione, sicurezza e responsabilità per gli eventi organizzati dal Comitato Ellerese, incluso l'Albi Trail E-Bike Fest.",
    noindex: true,
  },
};

// ---------------------------------------------------------------------------
// Metadati delle pagine dinamiche — stesso approccio "regex sul sorgente"
// già usato da generate-sitemap.mjs (niente import di file .ts in uno script
// node puro). Restituiscono una Map slug -> { title, description }.
// ---------------------------------------------------------------------------

const readFile = (relativePath) => fs.readFile(path.join(projectRoot, relativePath), "utf8");

// Divide un file dati in blocchi per-oggetto usando "slug:" come confine,
// così l'ordine dei campi dentro l'oggetto non conta mai.
const splitIntoBlocksBySlug = (source) => {
  const blocks = [];
  let currentSlug = null;
  let currentLines = [];

  const flush = () => {
    if (currentSlug) blocks.push({ slug: currentSlug, text: currentLines.join("\n") });
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const slugMatch = rawLine.match(/slug:\s*"([^"]+)"/);
    if (slugMatch?.[1]) {
      flush();
      currentSlug = slugMatch[1];
      currentLines = [];
      continue;
    }
    currentLines.push(rawLine);
  }
  flush();
  return blocks;
};

// Stringa tra doppi apici, tollerante alle virgolette escaped (\") che
// compaiono in alcune description (es. "il \"sentiero azzurro\"").
const extractQuoted = (block, field) => {
  const match = block.match(new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return match?.[1]?.replace(/\\"/g, '"');
};

const loadTrailMeta = async () => {
  const source = await readFile("src/data/trails/trails.ts");
  const map = new Map();
  for (const { slug, text } of splitIntoBlocksBySlug(source)) {
    const title = extractQuoted(text, "name");
    const description = extractQuoted(text, "desc");
    if (title) map.set(slug, { title: `Trail ${title} a Ellera`, description: description ?? DEFAULT_DESCRIPTION });
  }
  return map;
};

const loadNewsMeta = async () => {
  const source = await readFile("src/data/core/news.ts");
  const map = new Map();
  for (const { slug, text } of splitIntoBlocksBySlug(source)) {
    const title = extractQuoted(text, "title");
    const description = extractQuoted(text, "excerpt");
    if (title) map.set(slug, { title, description: description ?? DEFAULT_DESCRIPTION });
  }
  return map;
};

const loadEventMeta = async () => {
  const source = await readFile("src/data/events/events.ts");
  const map = new Map();
  for (const { slug, text } of splitIntoBlocksBySlug(source)) {
    // Solo eventi con dettaglio interno (stessa condizione di getEventRoutes
    // nel sitemap generator) hanno davvero una pagina /eventi/:slug da servire.
    if (!text.includes("detailContent:")) continue;
    const title = extractQuoted(text, "title");
    const description = extractQuoted(text, "desc");
    if (title) map.set(slug, { title, description: description ?? DEFAULT_DESCRIPTION });
  }
  return map;
};

const loadTradizioniMeta = async () => {
  const dir = path.join(projectRoot, "src", "content", "tradizioni");
  const map = new Map();
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return map;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    // I file .md in questo repo usano CRLF: \r?\n ovunque, non solo \n.
    const content = await fs.readFile(path.join(dir, entry.name), "utf8");
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const slug = frontmatter.match(/^slug:\s*(.+?)\r?$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
    const title = frontmatter.match(/^title:\s*(.+?)\r?$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
    const summary = frontmatter.match(/^summary:\s*(.+?)\r?$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (slug && title) map.set(slug, { title, description: summary ?? DEFAULT_DESCRIPTION });
  }
  return map;
};

// ---------------------------------------------------------------------------
// Rotte da generare: tutte quelle in sitemap.xml (già scritta in dist/ dal
// prebuild + vite build) più le pagine noindex che non ci sono di proposito.
// ---------------------------------------------------------------------------

const getSitemapRoutes = async () => {
  if (!existsSync(sitemapPath)) {
    console.warn("[page-shells] dist/sitemap.xml non trovato, uso solo STATIC_PAGES.");
    return [];
  }
  const xml = await fs.readFile(sitemapPath, "utf8");
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
  return locs
    .map((loc) => {
      try {
        return new URL(loc).pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async () => {
  const [trailMeta, newsMeta, eventMeta, tradizioniMeta, sitemapRoutes] = await Promise.all([
    loadTrailMeta(),
    loadNewsMeta(),
    loadEventMeta(),
    loadTradizioniMeta(),
    getSitemapRoutes(),
  ]);

  const routes = new Set(
    [...sitemapRoutes, ...Object.keys(STATIC_PAGES), "/privacy", "/regolamento"].filter(
      // Rotte come /la-pedaliamo-insieme-2026.html sono file statici a sé
      // stanti (vedi public/*.html), già completi di title/canonical propri:
      // non sono uno shell dist/<route>/index.html da generare qui.
      (route) => !path.extname(route)
    )
  );

  // Il pathname da sitemap.xml/new URL() arriva ancora percent-encoded
  // (es. "balom%C3%A0"), ma le mappe slug->meta sono chiavate con lo slug
  // unicode grezzo preso dai sorgenti ("balomà"): va decodificato prima
  // di cercarlo, altrimenti gli slug con accenti restano senza metadati.
  const decodeSlug = (raw) => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

  const resolveMeta = (route) => {
    if (STATIC_PAGES[route]) return STATIC_PAGES[route];

    const trailMatch = route.match(/^\/mtb\/(.+)$/);
    if (trailMatch) return trailMeta.get(decodeSlug(trailMatch[1]));

    const newsMatch = route.match(/^\/news\/(.+)$/);
    if (newsMatch) return newsMeta.get(decodeSlug(newsMatch[1]));

    const tradizioneMatch = route.match(/^\/tradizioni\/(.+)$/);
    if (tradizioneMatch) return tradizioniMeta.get(decodeSlug(tradizioneMatch[1]));

    const eventMatch = route.match(/^\/eventi\/(.+)$/);
    if (eventMatch) return eventMeta.get(decodeSlug(eventMatch[1]));

    return null;
  };

  const baseHtml = await fs.readFile(indexPath, "utf8");
  let written = 0;
  let canonicalOnly = 0;

  for (const route of routes) {
    const meta = resolveMeta(route);

    const dom = new JSDOM(baseHtml);
    const document = dom.window.document;

    const setMeta = (selector, content) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };

    const canonicalUrl = `${siteUrl}${route}`;

    if (meta) {
      const pageTitle = buildPageTitle(meta.title);
      const description = meta.description ?? DEFAULT_DESCRIPTION;
      const image = meta.image ?? DEFAULT_OG_IMAGE;

      document.title = pageTitle;
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:title"]', pageTitle);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[property="og:image"]', image);
      setMeta('meta[property="og:url"]', canonicalUrl);
      setMeta('meta[name="twitter:title"]', pageTitle);
      setMeta('meta[name="twitter:description"]', description);
      setMeta('meta[name="twitter:image"]', image);

      if (meta.noindex) {
        setMeta('meta[name="robots"]', "noindex,nofollow");
      }
    } else {
      canonicalOnly += 1;
    }

    // Il canonical si sistema SEMPRE, anche per rotte senza metadati custom:
    // è puramente meccanico (siteUrl + route) ed è la parte che risolve
    // direttamente "Google ha scelto una pagina canonica diversa".
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    const html = dom.serialize();

    if (route === "/") {
      await fs.writeFile(indexPath, html, "utf8");
    } else {
      const outputDir = path.join(distDir, route.replace(/^\//, ""));
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");
    }
    written += 1;
  }

  console.log(
    `[page-shells] ✓ ${written} pagine generate in dist/ (${written - canonicalOnly} con titolo/description dedicati, ${canonicalOnly} solo con canonical corretto)`
  );
};

main().catch((error) => {
  console.error("[page-shells] Errore:", error);
  process.exitCode = 1;
});
