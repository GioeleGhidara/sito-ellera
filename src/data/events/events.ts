import {
  albiTrailAreaImage,
  albiTrailAreaLogo,
  barrabravaLogoSvg,
  caruggiEventImage,
  locandinaCaruggiELanterne,
  comuneAlbisolaSupLogoSvg,
  castagnataImage,
  castagnataHeroImage,
  heroImage,
  logoComitatoRidotto,
  quilianoBikeLogoSvg,
  sincroresonanceImage,
  locandinaPedaliamoInsieme,
  locandinaEbikeFest,
  chiesaSanBartolomeoEventImage,
  galleriaArteImage,
  locandinaCulturaInCammino,
  heroCulturaInCammino,
} from "@/assets/images";
import { EVENT_LOCATIONS } from "@/data/core/locations";

export interface EventOrganizer {
  name: string;
  url?: string;
  logo?: string;
  logoAlt?: string;
}

export type EventOrganizersSource = Pick<
  EventItem,
  "organizerLogo" | "organizerLogoAlt" | "organizerName" | "organizerUrl" | "organizers"
>;

export interface EventItem {
  slug: string;
  title: string;
  date: string; // Formato leggibile lungo
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD per eventi di più giorni
  startTime?: string; // Formato HH:mm (es. 19:00)
  endTime?: string; // Formato HH:mm (es. 23:59)
  image: string;
  desc: string;
  location: string;
  locationUrl?: string;
  status?: string;
  organizerName?: string;
  organizerUrl?: string;
  organizerLogo?: string;
  organizerLogoAlt?: string;
  organizers?: EventOrganizer[];
  posterPlaceholderLabel?: string;
  detailContent?: string;
  externalUrl?: string;
  showOnHome?: boolean;
  category?: EventCategory;
  dateToBeConfirmed?: boolean;
  heroImage?: string;
  heroImagePosition?: string;
}

export type EventCategory = "Cultura" | "Outdoor" | "Festa" | "Teatro" | "Altro";

const toTimestamp = (date: string) => {
  if (!date) return 0;
  const t = new Date(`${date}T00:00:00`).getTime();
  return isNaN(t) ? 0 : t;
};

const getReferenceDayTimestamp = (referenceDate: Date) => {
  const day = new Date(referenceDate);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

export const events: EventItem[] = ([
  {
    slug: "cultura-in-cammino",
    title: "Cultura in cammino – Ellera tra arte e natura",
    date: "11 Giugno 2026",
    startDate: "2026-06-11",
    startTime: "18:00",
    image: locandinaCulturaInCammino,
    heroImage: heroCulturaInCammino,
    desc: "Passeggiata guidata alla scoperta della Galleria all'aperto della ceramica d'arte e del sentiero azzurro con Monica Nicolini e il prof. Roberto Siri.",
    location: "Piazza Cairoli, Ellera",
    status: "In programma",
    organizerName: "Assessorato alla Cultura",
    organizers: [
      {
        name: "Assessorato alla Cultura",
      },
      {
        name: "Associazione Kalipè",
      },
    ],
    showOnHome: true,
    detailContent: `L'Assessorato alla Cultura organizza la passeggiata guidata **"Cultura in cammino – Ellera tra arte e natura"**, in collaborazione con l'associazione Kalipè.

**Data e orario:** Giovedì 11 giugno 2026, ore 18:00.

**Programma:**
- **Ritrovo:** Ore 18:00 in Piazza Cairoli a Ellera.
- **Tappa artistica:** Visita ad alcuni pannelli della Galleria all'aperto della ceramica d'arte.
- **Percorso a piedi:** Camminata lungo il sentiero azzurro fino alla Chiesa di San Bartolomeo.
- **Accompagnatori:** Monica Nicolini e il professor Roberto Siri.

Partecipazione libera senza obbligo di iscrizione.`,
    posterPlaceholderLabel: "Cultura in cammino",
    category: "Cultura",
  },
  {
    slug: "frequenze-cosmiche-baloma-2026",
    title: "Frequenze Cosmiche al Balomà",
    date: "17-18 Aprile 2026",
    startDate: "2026-04-17",
    endDate: "2026-04-18",
    image: sincroresonanceImage,
    desc: "Due giornate al Teatro Balomà con sessioni di ascolto armonico e bagni sonori con campane tibetane, gong e diapason.",
    location: EVENT_LOCATIONS.TEATRO_BALOMA.name,
    locationUrl: EVENT_LOCATIONS.TEATRO_BALOMA.url,
    status: "In programma",
    organizerName: "Teatro Balomà",
    category: "Teatro",
    showOnHome: false,
    detailContent: `Due giornate al **Teatro Balomà** dedicate a bagni di suono e sessioni di ascolto armonico.

Il programma prevede appuntamenti distribuiti tra mattino e sera:
- **Frequenze armoniche (432 Hz)** per favorire rilassamento e concentrazione;
- **Sessioni acustiche** con campane tibetane, campane di cristallo, diapason e gong.

Si consiglia abbigliamento comodo; è possibile portare un proprio tappetino.`,
  },
  {
    slug: "la-pedaliamo-insieme-2026",
    title: "La Pedaliamo Insieme",
    date: "31 Maggio 2026",
    startDate: "2026-05-31",
    startTime: "14:00",
    endTime: "19:00",
    image: locandinaPedaliamoInsieme,
    desc: "Pedalata in beneficenza tra Albisola Superiore ed Ellera con percorsi per tutti i livelli, incluso il giro famiglie su strada con passaggio nel golf.",
    location: EVENT_LOCATIONS.ALBISOLA_ELLERA.name,
    status: "In programma",
    organizerName: "Albi Trail Area",
    organizerLogo: albiTrailAreaLogo,
    organizerLogoAlt: "Logo Albi Trail Area",
    organizers: [
      {
        name: "Barrabrava",
        logo: barrabravaLogoSvg,
        logoAlt: "Logo Barrabrava",
      },
      {
        name: "Albi Trail Area",
        logo: albiTrailAreaLogo,
        logoAlt: "Logo Albi Trail Area",
      },
      {
        name: "Quiliano Bike",
        logo: quilianoBikeLogoSvg,
        logoAlt: "Logo Quiliano Bike",
      },
      {
        name: "Comune di Albisola Superiore",
        logo: comuneAlbisolaSupLogoSvg,
        logoAlt: "Logo Comune di Albisola Superiore",
      },
    ],
    posterPlaceholderLabel: "locandina",
    showOnHome: true,
    detailContent: `La Pedaliamo Insieme è una giornata di sport, solidarietà e natura tra Albisola Superiore ed Ellera.

- Percorsi per tutti i livelli
- Area bambini con Quiliano Bike
- Sosta e rinfresco a Ellera per i percorsi che transitano nel borgo
- Arrivo comune finale

**Programma**
- Ritrovo e registrazioni
- Formazione dei gruppi
- Partenza dei percorsi
- Area bambini con Quiliano Bike
- Sosta a **Piazza dell'Elce** per i percorsi che passano da Ellera
- Ritrovo conclusivo comune

**Percorsi**
- **Giro Rosso**: passaggio da Ellera con sosta in Piazza dell'Elce
- **Giro Verde**: percorso su forze proprie, senza passaggio da Ellera
- **Giro Bianco**: percorso su strada, adatto a famiglie e accompagnatori

**Organizzazione**
- **Barrabrava 41**: coordinamento operativo dell'evento
- **Comitato Ellerese**: accoglienza sul territorio e collegamento con il borgo
- **Quiliano Bike**: area bambini

Eventuali dettagli operativi aggiuntivi potranno essere aggiornati in questa scheda.`,
    category: "Outdoor",
    externalUrl: "/la-pedaliamo-insieme-2026.html",
  },
  {
    slug: "albi-trail-ebike-fest",
    title: "Albi Trail E-Bike Fest",
    date: "14 Giugno 2026",
    startDate: "2026-06-14",
    startTime: "08:30",
    endTime: "13:00",
    image: locandinaEbikeFest,
    heroImage: albiTrailAreaImage,
    heroImagePosition: "object-[center_25%]",
    desc: "Raduno esclusivo e-bike sui sentieri tecnici di Ellera. Giro accompagnato di 3h+ e pranzo finale con panino, birra e patatine.",
    location: EVENT_LOCATIONS.TRAIL_PRATO_FESTE.name,
    locationUrl: EVENT_LOCATIONS.TRAIL_PRATO_FESTE.url,
    status: "Concluso",
    organizerName: "Comitato Ellerese",
    organizerLogo: logoComitatoRidotto,
    organizers: [
      {
        name: "Comitato Ellerese",
        logo: logoComitatoRidotto,
      },
      {
        name: "Albi Trail Area",
        logo: albiTrailAreaLogo,
      },
      {
        name: "Comune di Albisola Superiore",
        logo: comuneAlbisolaSupLogoSvg,
      },
    ],
    showOnHome: true,
    detailContent: `Giro accompagnato tecnico sui sentieri della Albi Trail Area. 
  - **Ritrovo**: 08:30 al Prato Feste. 
  - **Prezzi**: €20 (giro + pranzo). 
  - **Menu**: Panino salsiccia/wurstel, patatine e birra (opzione vegana disponibile).`,
    posterPlaceholderLabel: "locandina",
    category: "Outdoor",
    externalUrl: "/archivio/albi-trail-ebike-fest-2026",
  },

  {
    slug: "caruggi-e-lanterne-2026",
    title: "Caruggi e Lanterne 2026",
    date: "21-22 Agosto 2026",
    startDate: "2026-08-21",
    endDate: "2026-08-22",
    startTime: "19:00",
    endTime: "23:59",
    image: locandinaCaruggiELanterne,
    desc: "Percorso enogastronomico tra i carruggi del centro storico illuminati da oltre 200 lanterne artigianali, con piatti tipici liguri e musica dal vivo.",
    location: EVENT_LOCATIONS.CARUGGI.name,
    locationUrl: EVENT_LOCATIONS.CARUGGI.url,
    category: "Festa",
    externalUrl: "/archivio/caruggi-e-lanterne-2026",
    detailContent: `**Caruggi e Lanterne** è l'appuntamento estivo che anima il centro storico di Ellera con oltre 200 lanterne artigianali accese lungo le vie del borgo.

**Cosa prevede la manifestazione:**
- **Percorso gastronomico:** stand con piatti della cucina ligure, focaccette, street food locale, vino e birra.
- **Musica dal vivo:** concerti e dj set distribuiti nelle piazzette e nei carruggi.
- **Aree ristoro:** tavoli all'aperto distribuiti lungo il tragitto.
- **Parcheggi:** aree sosta segnalate all'ingresso del paese, a pochi minuti a piedi dal centro storico.

Ingresso libero alle vie del borgo e agli spettacoli musicali.`,
  },
  {
    slug: "san-bartolomeo",
    title: "San Bartolomeo",
    date: "23 Agosto 2026",
    startDate: "2026-08-23",
    image: chiesaSanBartolomeoEventImage,
    desc: "Festa patronale di San Bartolomeo: messa e tradizionale falò della vigilia la sera del 23 agosto; messa solenne e processione il 24 agosto.",
    location: EVENT_LOCATIONS.CENTRO_STORICO.name,
    locationUrl: EVENT_LOCATIONS.CENTRO_STORICO.url,
    category: "Festa",
    detailContent: `Festa patronale di **San Bartolomeo Apostolo**, legata alla parrocchia eretta nel 1642.

**Domenica 23 agosto (Vigilia):**
- Santa Messa nella chiesa parrocchiale;
- Tradizionale accensione del grande Falò di San Bartolomeo;
- Punti ristoro a cura del Comitato Ellerese.

**Lunedì 24 agosto (Festa del Patrono):**
- Messa solenne in parrocchia;
- Processione lungo le vie del borgo con la cassa del Santo e i crocifissi tradizionali liguri.`,
  },
  {
    slug: "castagnata",
    title: "Castagnata",
    date: "Autunno 2026",
    startDate: "2026-10-01",
    image: castagnataImage,
    heroImage: castagnataHeroImage,
    heroImagePosition: "object-[center_25%]",
    desc: "Pomeriggio al Prato Feste con caldarroste preparate sulle padelle di rame, focaccette, vino e musica.",
    location: EVENT_LOCATIONS.PRATO_FESTE.name,
    locationUrl: EVENT_LOCATIONS.PRATO_FESTE.url,
    status: "Prossimamente",
    category: "Festa",
    dateToBeConfirmed: true,
    detailContent: `La tradizionale **Castagnata** autunnale organizzata dal Comitato Ellerese al Prato Feste.

**Menù e ristoro:**
- Caldarroste cotte a legna sulle tradizionali padelle forate di rame;
- Focaccette, dolci di castagne e panini caldi;
- Vino novello, birra e bibite.

L'evento si svolge all'aperto negli spazi attrezzati del Prato Feste con tavoli e posti a sedere. Data precisa e orari saranno comunicati a ridosso dell'evento in base all'andamento della raccolta nei boschi.`,
  },
] satisfies EventItem[]).sort((a, b) => toTimestamp(a.startDate) - toTimestamp(b.startDate));

export const getFeaturedEvent = (referenceDate = new Date()) => {
  const referenceDayTimestamp = getReferenceDayTimestamp(referenceDate);
  return events.find((e) => {
    const eventEnd = e.endDate || e.startDate;
    return toTimestamp(eventEnd) >= referenceDayTimestamp;
  });
};

export const getNextBikeEvent = (referenceDate = new Date()) => {
  const referenceDayTimestamp = getReferenceDayTimestamp(referenceDate);
  return events.find(
    (e) => {
      const eventEnd = e.endDate || e.startDate;
      return e.category === "Outdoor" && toTimestamp(eventEnd) >= referenceDayTimestamp;
    }
  );
};

export const getUpcomingEventsByCategory = (
  category: EventCategory,
  referenceDate = new Date(),
) => {
  const referenceDayTimestamp = getReferenceDayTimestamp(referenceDate);
  return events.filter(
    (event) => {
      const eventEnd = event.endDate || event.startDate;
      return event.category === category && toTimestamp(eventEnd) >= referenceDayTimestamp;
    }
  );
};

export const getEventBySlug = (slug: string) =>
  events.find((e) => e.slug === slug);

export const isEventPast = (event: EventItem, referenceDate = new Date()) => {
  const referenceDayTimestamp = getReferenceDayTimestamp(referenceDate);
  const eventEnd = event.endDate || event.startDate;
  return toTimestamp(eventEnd) < referenceDayTimestamp;
};

export const getEventOrganizers = (
  event: EventOrganizersSource,
  options?: { fallbackOrganizer?: EventOrganizer },
): EventOrganizer[] => {
  if (event.organizers && event.organizers.length > 0) {
    return event.organizers;
  }

  if (event.organizerName) {
    return [
      {
        name: event.organizerName,
        url: event.organizerUrl,
        logo: event.organizerLogo,
        logoAlt: event.organizerLogoAlt,
      },
    ];
  }

  return options?.fallbackOrganizer ? [options.fallbackOrganizer] : [];
};

export const hasEventDetail = (item: Pick<EventItem, "detailContent">) =>
  Boolean(item.detailContent?.trim());
