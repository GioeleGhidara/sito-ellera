export const ROUTES = {
  home: "/",
  trekking: "/trekking",
  albiTrailArea: "/albi-trail-area",
  meteo: "/meteo-allerte",
  mtb: "/mtb",
  teatroBaloma: "/teatro-baloma",
  teatroBalomaSupport: "/teatro-baloma/sostieni",
  galleriaArte: "/galleria-arte",
  storia: "/storia",
  comitato: "/comitato",
  chiSiamo: "/chi-siamo",
  eventi: "/eventi",
  // Eventi statici - path legacy diretto (redirect a .html in App.tsx)
  laPedaliamoInsieme2026: "/eventi/la-pedaliamo-insieme-2026",
  albiTrailEbikeFest: "/albi-trail-ebike-fest",
  albiTrailEbikeFestLegacy: "/eventi/albi-trail-ebike-fest",
  tradizioniStregheLegacy: "/tradizioni/streghe",
  servizi: "/servizi",
  tradizioni: "/tradizioni",
  news: "/news",
  attivitaLegacy: "/attivita",
  caruggiELanterne: "/caruggi-e-lanterne",
  privacy: "/privacy",
  regolamento: "/regolamento",
} as const;

export const tradizioneDetailPath = (slug: string) => `${ROUTES.tradizioni}/${slug}`;

export const newsDetailPath = (slug: string) => `${ROUTES.news}/${slug}`;

export const eventDetailPath = (slug: string) => `${ROUTES.eventi}/${slug}`;

export const serviziSectionPath = (section: "bus" | "mangiare" | "negozi") =>
  `${ROUTES.servizi}#${section}`;
