import { trailTechnicalMetadataBySlug } from "./trailTechnicalMetadata";

export interface TrailData {
  slug: string;
  name: string;
  trailType: TrailType;
  difficulty: string;
  difficultyColor: string;
  difficultyEmoji: string;
  specs?: string;
  length?: string;
  elevation?: string;
  ascent?: string;
  descent?: string;
  estimatedTime?: string;
  travelDirection: TrailDirection;
  desc: string;
  characteristics: string;
  gpxPath?: string;
  gpxColor: string;
  trailforksUrl?: string;
}

export type TrailDirection = "downhill" | "uphill" | "bidirectional";
export type TrailType = "descent" | "climb" | "access";

export const TRAIL_DIRECTION_META: Record<
  TrailDirection,
  { label: string; icon: string; className: string }
> = {
  downhill: {
    label: "Solo discesa",
    icon: "\u2198",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  uphill: {
    label: "Solo salita",
    icon: "\u2197",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  bidirectional: {
    label: "Bidirezionale",
    icon: "\u2195",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const baseTrails: TrailData[] = [
  {
    slug: "dh-camilla",
    name: "DH Camilla",
    trailType: "descent",
    difficulty: "Tecnico / Downhill",
    difficultyColor: "bg-[#FF0000] text-white",
    difficultyEmoji: "\u{1F534}",
    specs: "Lunghezza ~1.5 km - Dislivello -277 m",
    length: "~1.5 km",
    elevation: "-277 m",
    estimatedTime: "~8 min",
    travelDirection: "downhill",
    desc: "Il re dei trail di Ellera. Fondo roccioso, gradoni e passaggi tecnici per biker esperti.",
    characteristics:
      "Discesa tecnica pura con fondo roccioso naturale, gradoni in pietra e passaggi stretti tra la vegetazione. Il terreno varia tra roccia viva e terra compatta, con sezioni esposte che richiedono concentrazione e padronanza della bici.",
    gpxPath: "/tracks/dh-camilla.gpx",
    gpxColor: "#FF0000",
    trailforksUrl: "https://www.trailforks.com/trails/dh-camilla/",
  },
  {
    slug: "seia",
    name: "Seia",
    trailType: "descent",
    difficulty: "Flow",
    difficultyColor: "bg-blue-600 text-white",
    difficultyEmoji: "\u{1F535}",
    specs: "Lunghezza 446.0 m - Salita +1 m - Discesa -76 m",
    length: "446.0 m",
    elevation: "-76 m",
    estimatedTime: "00:02:22",
    travelDirection: "downhill",
    desc: "Il sentiero flow per eccellenza. Veloce, divertente e panoramico.",
    characteristics:
      "Trail flow veloce e ritmato con curve naturali ben disegnate. Fondo prevalentemente in terra battuta con qualche radice. Tratti panoramici con vista sulla vallata e sul mare.",
    gpxPath: "/tracks/seia.gpx",
    gpxColor: "#0000FF",
    trailforksUrl: "https://www.trailforks.com/trails/seia/",
  },
  {
    slug: "scarsellun",
    name: "Scarsellun",
    trailType: "descent",
    difficulty: "Misto",
    difficultyColor: "bg-[#0000FF] text-white",
    difficultyEmoji: "\u{1F535}",
    specs: "Lunghezza 3.9 km - Salita +5 m - Discesa -427 m",
    length: "3.9 km",
    elevation: "-427 m",
    estimatedTime: "00:27:25",
    travelDirection: "downhill",
    desc: "Il sentiero più lungo e vario della trail area.",
    characteristics:
      "Alterna sezioni rocciose simili a quelle di Finale Ligure a tratti in terra battuta con sponde naturali. Passaggi tecnici intervallati da sezioni flow.",
    gpxPath: "/tracks/scarsellun.gpx",
    gpxColor: "#0000FF",
    trailforksUrl: "https://www.trailforks.com/trails/toretto-trail-scarsellun/",
  },
  {
    slug: "cresta-del-gallo",
    name: "Cresta del Gallo",
    trailType: "descent",
    difficulty: "Blu / Verde",
    difficultyColor: "bg-[#0000FF] text-white",
    difficultyEmoji: "\u{1F535}",
    specs: "Lunghezza ~1.3 km - Dislivello -87 m",
    length: "~1.3 km",
    elevation: "-87 m",
    estimatedTime: "~6 min",
    travelDirection: "downhill",
    desc: "Variante all-mountain panoramica verso la zona Boraxe.",
    characteristics:
      "Sentiero panoramico con discesa dolce e progressiva su fondo misto terra-roccia. Adatto anche a rider intermedi.",
    gpxPath: "/tracks/cresta-del-gallo.gpx",
    gpxColor: "#0000FF",
    trailforksUrl: "https://www.trailforks.com/trails/cresta-del-gallo/",
  },
  {
    slug: "beia",
    name: "Beià",
    trailType: "descent",
    difficulty: "Cresta",
    difficultyColor: "bg-blue-600 text-white",
    difficultyEmoji: "\u{1F535}",
    specs: "Lunghezza ~4.6 km - Dislivello -465 m",
    length: "~4.6 km",
    elevation: "-465 m",
    estimatedTime: "~20 min",
    travelDirection: "downhill",
    desc: "Percorso di cresta con vista mare costante.",
    characteristics:
      "Tracciato su crinale con panorami aperti su entrambi i versanti. Fondo naturale con tratti esposti.",
    gpxPath: "/tracks/beia.gpx",
    gpxColor: "#0000FF",
    trailforksUrl: "https://www.trailforks.com/trails/beia/",
  },
  {
    slug: "to-ellera-trails",
    name: "To Ellera Trails",
    trailType: "climb",
    difficulty: "Trasferimento / Risalita",
    difficultyColor: "bg-[#800080] text-white",
    difficultyEmoji: "\u{1F7E3}",
    specs: "Lunghezza ~4.4 km - Dislivello +258 m",
    length: "~4.4 km",
    elevation: "+258 m",
    estimatedTime: "~35 min",
    travelDirection: "uphill",
    desc: "Via principale per riguadagnare quota.",
    characteristics:
      "Risalita principale della trail area, interamente pedalabile su fondo sterrato ben battuto.",
    gpxPath: "/tracks/to-ellera-trails.gpx",
    gpxColor: "#800080",
    trailforksUrl: "https://www.trailforks.com/trails/to-ellera-trails/",
  },
  {
    slug: "rio-buraxe-climb",
    name: "Rio Buraxe Climb",
    trailType: "climb",
    difficulty: "Verde / Doubletrack",
    difficultyColor: "bg-[#00AA00] text-white",
    difficultyEmoji: "\u{1F7E2}",
    specs: "Lunghezza ~3.4 km - Dislivello +243 m",
    length: "~3.4 km",
    elevation: "+243 m",
    estimatedTime: "~30 min",
    travelDirection: "uphill",
    desc: "Nuova risalita pedalata lato Rio Buraxe.",
    characteristics:
      "Risalita su fondo misto (sterrato e tratti compatti) con pendenze regolari e qualche sezione più intensa.",
    gpxPath: "/tracks/rio-buraxe-climb.gpx",
    gpxColor: "#00AA00",
    trailforksUrl: "https://www.trailforks.com/trails/rio-buraxe-climb/",
  },
  {
    slug: "access-to-trails-cascinotti",
    name: "Access to Trails (Cascinotti)",
    trailType: "access",
    difficulty: "Trasferimento / Risalita",
    difficultyColor: "bg-[#800080] text-white",
    difficultyEmoji: "\u{1F7E3}",
    specs: "Lunghezza ~7.3 km - Dislivello +466 m",
    length: "~7.3 km",
    elevation: "+466 m",
    estimatedTime: "~55 min",
    travelDirection: "uphill",
    desc: "Risalita lunga verso l'alta quota con accesso ai sentieri dal lato Cascinotti.",
    characteristics:
      "Traccia di accesso su fondo misto (asfalto, sterrato e tratti di servizio) con sviluppo esteso e salita progressiva. Utile per raggiungere la parte alta della trail area in modo interamente pedalato.",
    gpxPath: "/tracks/access-to-trails-cascinotti.gpx",
    gpxColor: "#800080",
  },
  {
    slug: "access-to-trails-cerce",
    name: "Access to Trails (Cerce)",
    trailType: "access",
    difficulty: "Trasferimento / Risalita",
    difficultyColor: "bg-[#800080] text-white",
    difficultyEmoji: "\u{1F7E3}",
    specs: "Lunghezza ~5.5 km - Dislivello +465 m",
    length: "~5.5 km",
    elevation: "+465 m",
    estimatedTime: "~45 min",
    travelDirection: "uphill",
    desc: "Risalita diretta con accesso ai sentieri dal versante Cerce.",
    characteristics:
      "Traccia di accesso più compatta ma intensa, su fondo misto, adatta a chi vuole una salita più diretta per entrare rapidamente nel circuito dei sentieri.",
    gpxPath: "/tracks/access-to-trails-cerce.gpx",
    gpxColor: "#800080",
  },
];

export const trails: TrailData[] = baseTrails.map((trail) => ({
  ...trail,
  ...(trailTechnicalMetadataBySlug[trail.slug] ?? {}),
}));

export function getTrailBySlug(slug: string): TrailData | undefined {
  return (
    trails.find((t) => t.slug === slug) ??
    (slug === "risalita-cannavisse" || slug === "risalita-canavisse"
      ? trails.find((t) => t.slug === "to-ellera-trails")
      : undefined)
  );
}
