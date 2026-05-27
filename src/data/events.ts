import {
  albiTrailAreaImage,
  albiTrailAreaLogo,
  barrabravaLogoSvg,
  caruggiEventImage,
  caruggiLanterneImage,
  comuneAlbisolaSupLogoSvg,
  castagnataImage,
  castagnataHeroImage,
  heroImage,
  logoComitatoRidotto,
  quilianoBikeLogoSvg,
  sincroresonanceImage,
  locandinaPedaliamoInsieme,
  chiesaSanBartolomeoEventImage,
} from "@/assets/images";
import { EVENT_LOCATIONS } from "./locations";

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
    slug: "frequenze-cosmiche-baloma-2026",
    title: "Frequenze Cosmiche al Balomà",
    date: "17-18 Aprile 2026",
    startDate: "2026-04-17",
    endDate: "2026-04-18",
    image: sincroresonanceImage,
    desc: "Due giornate al Teatro Balomà dedicate a un concerto di frequenze cosmiche, con appuntamenti distribuiti tra mattino e sera all'interno della sala.",
    location: EVENT_LOCATIONS.TEATRO_BALOMA.name,
    locationUrl: EVENT_LOCATIONS.TEATRO_BALOMA.url,
    status: "In programma",
    organizerName: "Teatro Balomà",
    category: "Teatro",
    showOnHome: false,
    detailContent: `Rivivi il benessere e l'equilibrio interiore attraverso **SincroResonance**, due giornate interamente dedicate al potere delle frequenze cosmiche. All'interno della suggestiva cornice acustica del **Teatro Balomà**, potrai immergerti in una sessione di bagni di suono progettata per indurre un profondo stato di rilassamento fisico e mentale.

L'evento prevede diversi **appuntamenti distribuiti tra il mattino e la sera**, permettendoti di scegliere il momento ideale per la tua esperienza.

- **Frequenze a 432 Hz e superiori**: suoni armonici che favoriscono il riposo e la meditazione
- **Strumenti ancestrali**: campane tibetane, gong e diapason per cullare la mente
- **Benefici concreti**: riduzione dello stress, riequilibrio energetico e maggiore centratura personale

*Ti consigliamo di indossare abiti comodi e, se lo desideri, di portare un tappetino o una copertina personale per massimizzare il comfort durante la sessione.*`,
  },
  {
    slug: "la-pedaliamo-insieme-2026",
    title: "La Pedaliamo Insieme",
    date: "31 Maggio 2026",
    startDate: "2026-05-31",
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
    image: albiTrailAreaImage,
    desc: "Raduno esclusivo e-bike sui sentieri tecnici di Ellera. Giro guidato di 3h+ e pranzo finale con panino, birra e patatine.",
    location: EVENT_LOCATIONS.TRAIL_PRATO_FESTE.name,
    locationUrl: EVENT_LOCATIONS.TRAIL_PRATO_FESTE.url,
    status: "In arrivo",
    organizerName: "Comitato Ellerese",
    organizerLogo: logoComitatoRidotto,
    showOnHome: true,
    detailContent: `Giro guidato tecnico sui sentieri della Albi Trail Area. 
  - **Ritrovo**: 08:30 al Prato Feste. 
  - **Prezzi**: €20 (giro + pranzo). 
  - **Menu**: Panino salsiccia/wurstel, patatine e birra (opzione vegana disponibile).`,
    posterPlaceholderLabel: "locandina",
    category: "Outdoor",
    externalUrl: "/albi-trail-ebike-fest",
  },
  {
    slug: "caruggi-e-lanterne",
    title: "Caruggi e Lanterne",
    date: "21-22 Agosto 2026",
    startDate: "2026-08-21",
    endDate: "2026-08-22",
    image: caruggiLanterneImage,
    desc: "Il tradizionale percorso enogastronomico nei caruggi del borgo di Ellera. Tre serate dedicate al buon cibo, street food e convivialità. L'atmosfera magica delle lanterne è accompagnata da musica dal vivo di tutti i generi e rassegne d'arte come 'L'Arte del Fuoco'. Servizio navetta gratuito da Luceto dalle 19:00.",
    location: EVENT_LOCATIONS.CARUGGI.name,
    locationUrl: EVENT_LOCATIONS.CARUGGI.url,
    category: "Festa",
    detailContent: `L'evento estivo più atteso e suggestivo del borgo di Ellera torna ad accendere i cuori e le vie storiche. **Caruggi e Lanterne** non è solo un percorso enogastronomico, ma un vero e proprio tuffo nella tradizione, cullati dalla magica luce delle lanterne artigianali che decorano ogni angolo del paese.

**Cosa troverai:**
- **Percorso Gastronomico**: diverse "isole del gusto" sparse nei caruggi, dallo street-food tipico ai piatti della tradizione ligure, il tutto accompagnato da ottimo vino e birra artigianale.
- **Musica dal vivo**: ogni vicolo e piazzetta ospiterà musicisti e band di vari generi musicali, per farti cantare e ballare sotto le stelle.
- **Rassegna "L'Arte del Fuoco"**: artisti, artigiani e ceramisti esporranno le loro opere a cielo aperto, celebrando il legame profondo di Ellera con la lavorazione artistica e l'elemento del fuoco.

**Logistica e Servizi:**
- Servizio navetta gratuito attivo continuativamente da Luceto a partire dalle ore 19:00, per permetterti di raggiungere l'evento senza preoccupazioni di parcheggio.
- Ampi spazi per la consumazione ai tavoli.
- Ingresso libero alle esposizioni e agli eventi musicali.`,
  },
  {
    slug: "san-bartolomeo",
    title: "San Bartolomeo",
    date: "23 Agosto 2026",
    startDate: "2026-08-23",
    image: chiesaSanBartolomeoEventImage,
    desc: "La festa del patrono di Ellera, titolare della parrocchia inaugurata nel 1642. La sera del 22 agosto la comunità si ritrova per la messa e per l'annuale falò della vigilia, rito che accende la festa del 24 e richiama la tradizione contadina della Valle Sansobbia.",
    location: EVENT_LOCATIONS.CENTRO_STORICO.name,
    locationUrl: EVENT_LOCATIONS.CENTRO_STORICO.url,
    category: "Festa",
    detailContent: `Una ricorrenza che affonda le sue radici nella storia contadina della nostra comunità. Istituita poco dopo l'inaugurazione della parrocchia omonima nel 1642, la Festa di **San Bartolomeo** è il momento culminante dell'agosto ellerese, unendo devozione e convivialità in un'unica grande celebrazione.

**La Tradizione del Falò (Vigilia, 23 Agosto):**
La sera prima della vera e propria ricorrenza, l'intera Valle Sansobbia si riunisce per uno dei riti più antichi: l'accensione del grande Falò di San Bartolomeo. 
- Momento di aggregazione storica che una volta segnava il ritmo delle stagioni agricole.
- Punti di ristoro serali per brindare insieme attorno al fuoco.
- Santa Messa pre-falò presso la Parrocchia storica.

**La Festa del Patrono (24 Agosto):**
- **Celebrazioni religiose**: Messa solenne e processione per le vie del borgo, accompagnata dalla cassa del Santo ornata dai classici crocifissi liguri.

*Unisciti a noi per rivivere il folklore sano e genuino che da secoli caratterizza il cuore pulsante di Ellera.*`,
  },
  {
    slug: "castagnata",
    title: "Castagnata",
    date: "Autunno 2026",
    startDate: "2026-10-01",
    image: castagnataImage,
    heroImage: castagnataHeroImage,
    heroImagePosition: "object-[center_25%]",
    desc: "La tradizione autunnale per eccellenza. Il profumo delle caldarroste riempie le vie del borgo, accompagnato da vino novello e allegria.",
    location: EVENT_LOCATIONS.PRATO_FESTE.name,
    locationUrl: EVENT_LOCATIONS.PRATO_FESTE.url,
    status: "Prossimamente",
    category: "Festa",
    dateToBeConfirmed: true,
    detailContent: `L'autunno a Ellera si accoglie con la festa più calda e saporita della stagione: la **Castagnata** del Prato Feste! Quando l'aria si fa più fresca e i boschi circostanti cambiano colore, il borgo si ritrova per celebrare i sapori tipici e genuini dell'entroterra.

**Il Menù di Stagione:**
- **Caldarroste fumanti** preparate sul momento dai maestri fuochisti del Comitato sulle padelle di rame.
- **Vino novello** e caldo per accompagnare ogni assaggio scaldando l'atmosfera.
- **Dolci tipici** e altre specialità salate di stagione autunnale.

**L'Autunno in Compagnia:**
- Ampia area relax attrezzata e protetta presso il Prato Feste, perfetta per famiglie e compagnie numerose.
- Spazi all'aperto dove i bambini possono giocare in sicurezza godendosi la natura dorata di Ellera.
- Intrattenimento pomeridiano per accompagnare la degustazione in assoluto relax.

*La data esatta verrà confermata e annunciata nelle prossime settimane seguendo i ritmi della raccolta nei boschi, ma puoi star certo che l'atmosfera sarà quella di sempre: accogliente, festosa e... deliziosa!*`,
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
