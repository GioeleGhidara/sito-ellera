import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("Errore: index.html non trovato nella cartella dist. Esegui prima la build.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, "utf-8");

// Configurazione delle pagine speciali con OG personalizzati
const customPages = [
  {
    route: "/albi-trail-ebike-fest",
    title: "Albi Trail E-Bike Fest 2026 | Ellera",
    description: "14 Giugno 2026 - Ride + pranzo sui sentieri dell'Albi Trail Area di Ellera. Iscriviti ora.",
    image: "https://www.ellera.it/og/ebike-fest-2026.jpg",
    url: "https://www.ellera.it/albi-trail-ebike-fest"
  },
  {
    route: "/eventi/la-pedaliamo-insieme-2026",
    title: "La Pedaliamo Insieme 2026 | Ellera",
    description: "31 Maggio 2026 - Una giornata di pedalata collettiva in beneficienza tra Albisola Superiore ed Ellera. Percorsi per tutti i livelli, area bambini e rinfresco finale.",
    image: "https://www.ellera.it/og/pedaliamo-insieme.jpg",
    url: "https://www.ellera.it/eventi/la-pedaliamo-insieme-2026"
  }
];

customPages.forEach(page => {
  // Usiamo JSDOM per manipolare l'HTML in modo sicuro e pulito
  const dom = new JSDOM(baseHtml);
  const document = dom.window.document;

  const setMeta = (selector, content) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", content);
  };

  document.title = page.title;
  setMeta('meta[name="description"]', page.description);
  
  setMeta('meta[property="og:title"]', page.title);
  setMeta('meta[property="og:description"]', page.description);
  setMeta('meta[property="og:image"]', page.image);
  setMeta('meta[property="og:url"]', page.url);
  
  setMeta('meta[name="twitter:title"]', page.title);
  setMeta('meta[name="twitter:description"]', page.description);
  setMeta('meta[name="twitter:image"]', page.image);

  // Crea la cartella per la rotta, ad es. dist/albi-trail-ebike-fest/
  const outputDir = path.join(distDir, page.route.replace(/^\//, ''));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Salva l'index.html specifico per questa rotta
  fs.writeFileSync(path.join(outputDir, "index.html"), dom.serialize(), "utf-8");
  console.log(`✅ Generata pagina statica SEO per: ${page.route}`);
});
