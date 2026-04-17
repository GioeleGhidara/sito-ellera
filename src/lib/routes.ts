export const ROUTES = {
  home: "/",
  trekking: "/trekking",
  albiTrailArea: "/albi-trail-area",
  meteo: "/meteo-allerte",
  mtb: "/mtb",
  teatroBaloma: "/teatro-baloma",
  teatroBalomaSupport: "/teatro-baloma/sostieni",
  galleriaArte: "/galleria-arte",
  comitato: "/comitato",
  chiSiamo: "/chi-siamo",
  eventi: "/eventi",
  // Eventi statici - path legacy diretto (redirect a .html in App.tsx)
  laPedaliamoAssieme2026: "/eventi/la-pedaliamo-assieme-2026",
  elleraBikeFest2026: "/eventi/ellera-bike-fest-2026",
  servizi: "/servizi",
  tradizioni: "/tradizioni",
  news: "/news",
  attivitaLegacy: "/attivita",
} as const;

export const tradizioneDetailPath = (slug: string) => `${ROUTES.tradizioni}/${slug}`;

export const newsDetailPath = (slug: string) => `${ROUTES.news}/${slug}`;

export const eventDetailPath = (slug: string) => `${ROUTES.eventi}/${slug}`;

export const serviziSectionPath = (section: "bus" | "mangiare" | "negozi") =>
  `${ROUTES.servizi}#${section}`;
