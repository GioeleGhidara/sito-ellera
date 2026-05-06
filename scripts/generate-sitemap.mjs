import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

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

const mode = getMode();
const loadedEnv = await loadEnv(mode);
const siteUrl = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  loadedEnv.SITE_URL ||
  loadedEnv.VITE_SITE_URL ||
  "https://www.ellera.it"
).replace(/\/+$/, "");

const siteNoIndex = /^(1|true|yes)$/i.test(
  process.env.SITE_NOINDEX ||
    process.env.VITE_SITE_NOINDEX ||
    loadedEnv.SITE_NOINDEX ||
    loadedEnv.VITE_SITE_NOINDEX ||
    ""
);

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

const unique = (items) => [...new Set(items)];

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const readFile = (relativePath) => fs.readFile(path.join(projectRoot, relativePath), "utf8");

const getMatches = (source, pattern) =>
  Array.from(source.matchAll(pattern), (match) => match[1]).filter(Boolean);

const getDetailedEventSlugs = (source) => {
  const slugs = [];
  let currentSlug = null;

  for (const line of source.split(/\r?\n/)) {
    const slugMatch = line.match(/slug:\s*"([^"]+)"/);
    if (slugMatch?.[1]) {
      currentSlug = slugMatch[1];
      continue;
    }

    if (currentSlug && (line.includes("detailContent:") || line.includes("externalUrl:"))) {
      slugs.push(currentSlug);
      currentSlug = null;
    }
  }

  return slugs;
};

const loadTradizioneSlugs = async () => {
  const dir = path.join(projectRoot, "src", "content", "tradizioni");
  const entries = await fs.readdir(dir, { withFileTypes: true });
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

const buildSitemapXml = (routes) => {
  const urls = routes
    .map((route) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const buildRobotsTxt = () =>
  siteNoIndex
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const main = async () => {
  const [trailsSource, newsSource, eventsSource, tradizioneSlugs] = await Promise.all([
    readFile("src/data/trails.ts"),
    readFile("src/data/news.ts"),
    readFile("src/data/events.ts"),
    loadTradizioneSlugs(),
  ]);

  const trailSlugs = getMatches(trailsSource, /slug:\s*"([^"]+)"/g);
  const newsSlugs = getMatches(newsSource, /slug:\s*"([^"]+)"/g);
  const eventSlugs = getDetailedEventSlugs(eventsSource);

  const routes = unique([
    ...staticRoutes,
    ...trailSlugs.map((slug) => `/mtb/${slug}`),
    ...eventSlugs.map((slug) => `/eventi/${slug}`),
    ...tradizioneSlugs.map((slug) => `/tradizioni/${slug}`),
    ...newsSlugs.map((slug) => `/news/${slug}`),
  ]);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), buildSitemapXml(routes), "utf8");
  await fs.writeFile(path.join(publicDir, "robots.txt"), buildRobotsTxt(), "utf8");
};

main().catch((error) => {
  console.error("Failed to generate sitemap/robots files:", error);
  process.exitCode = 1;
});
