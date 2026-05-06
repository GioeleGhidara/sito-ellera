import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

// ---------------------------------------------------------------------------
// CLI / env helpers
// ---------------------------------------------------------------------------

const getMode = () => {
  const modeFlagIndex = process.argv.indexOf("--mode");
  if (modeFlagIndex >= 0 && process.argv[modeFlagIndex + 1]) {
    return process.argv[modeFlagIndex + 1];
  }
  return process.env.MODE || process.env.NODE_ENV || "production";
};

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

const loadEnv = async (mode) => {
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

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const mode = getMode();
const loadedEnv = await loadEnv(mode);

const siteUrl = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  loadedEnv.SITE_URL ||
  loadedEnv.VITE_SITE_URL ||
  "https://ellera.it"
).replace(/\/+$/, "");

const siteNoIndex = /^(1|true|yes)$/i.test(
  process.env.SITE_NOINDEX ||
  process.env.VITE_SITE_NOINDEX ||
  loadedEnv.SITE_NOINDEX ||
  loadedEnv.VITE_SITE_NOINDEX ||
  ""
);

// ---------------------------------------------------------------------------
// Static routes
// NOTE: trail detail pages use /mtb/<slug>, not /trekking (which is the list page)
// ---------------------------------------------------------------------------

const staticRoutes = [
  "/",
  "/trekking",
  "/albi-trail-area",
  "/teatro-baloma",
  "/galleria-arte",
  "/comitato",
  "/eventi",
  "/servizi",
  "/tradizioni",
  "/news",
];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const unique = (items) => [...new Set(items)];

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const readFile = (relativePath) =>
  fs.readFile(path.join(projectRoot, relativePath), "utf8");

const getMatches = (source, pattern) =>
  Array.from(source.matchAll(pattern), (match) => match[1]).filter(Boolean);

// ---------------------------------------------------------------------------
// Event routes parser
// Handles one event object at a time: accumulates all relevant fields before
// deciding which route (if any) to emit, so field order within the object
// never matters.
// ---------------------------------------------------------------------------

const getEventRoutes = (source) => {
  const routes = [];

  // Split into per-event blocks heuristically: a new "slug:" at the start of
  // a trimmed line signals the beginning of a new event entry.
  let currentSlug = null;
  let hasDetail = false;
  let externalUrl = null;

  const flush = () => {
    if (!currentSlug) return;
    if (externalUrl) {
      // Solo link interni (che iniziano con /) devono finire nella sitemap
      if (externalUrl.startsWith("/")) {
        routes.push(externalUrl);
      }
    } else if (hasDetail) {
      routes.push(`/eventi/${currentSlug}`);
    }
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    const slugMatch = line.match(/slug:\s*"([^"]+)"/);
    if (slugMatch?.[1]) {
      flush();
      currentSlug = slugMatch[1];
      hasDetail = false;
      externalUrl = null;
      continue;
    }

    if (line.includes("detailContent:")) hasDetail = true;

    const urlMatch = line.match(/externalUrl:\s*"([^"]+)"/);
    if (urlMatch?.[1]) externalUrl = urlMatch[1];
  }

  flush(); // last event
  return routes;
};

// ---------------------------------------------------------------------------
// Tradizioni slugs loader
// ---------------------------------------------------------------------------

const loadTradizioneSlugs = async () => {
  const dir = path.join(projectRoot, "src", "content", "tradizioni");

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`[sitemap] Directory not found, skipping tradizioni: ${dir}`);
      return [];
    }
    throw error;
  }

  const slugs = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const fileContent = await fs.readFile(path.join(dir, entry.name), "utf8");
    const match = fileContent.match(/^slug:\s*(.+)$/m);
    if (match?.[1]) {
      slugs.push(match[1].trim().replace(/^["']|["']$/g, ""));
    }
  }

  return slugs;
};

// ---------------------------------------------------------------------------
// XML / robots builders
// ---------------------------------------------------------------------------

const todayIso = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const buildSitemapXml = (routes) => {
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n    <lastmod>${todayIso}</lastmod>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const buildRobotsTxt = () =>
  siteNoIndex
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async () => {
  console.log(`[sitemap] mode=${mode}  siteUrl=${siteUrl}  noindex=${siteNoIndex}`);

  const [trailsSource, newsSource, eventsSource, tradizioneSlugs] = await Promise.all([
    readFile("src/data/trails.ts"),
    readFile("src/data/news.ts"),
    readFile("src/data/events.ts"),
    loadTradizioneSlugs(),
  ]);

  const trailSlugs = getMatches(trailsSource, /slug:\s*"([^"]+)"/g);
  const newsSlugs = getMatches(newsSource, /slug:\s*"([^"]+)"/g);
  const eventRoutes = getEventRoutes(eventsSource);

  const routes = unique([
    ...staticRoutes,
    ...trailSlugs.map((slug) => `/mtb/${slug}`),
    ...eventRoutes,
    ...tradizioneSlugs.map((slug) => `/tradizioni/${slug}`),
    ...newsSlugs.map((slug) => `/news/${slug}`),
  ]);

  console.log(
    `[sitemap] ${routes.length} URL trovati` +
    ` (trails: ${trailSlugs.length}, news: ${newsSlugs.length},` +
    ` eventi: ${eventRoutes.length}, tradizioni: ${tradizioneSlugs.length})`
  );

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), buildSitemapXml(routes), "utf8");
  await fs.writeFile(path.join(publicDir, "robots.txt"), buildRobotsTxt(), "utf8");

  console.log("[sitemap] ✓ public/sitemap.xml e public/robots.txt generati");
};

main().catch((error) => {
  console.error("[sitemap] Errore durante la generazione:", error);
  process.exitCode = 1;
});
