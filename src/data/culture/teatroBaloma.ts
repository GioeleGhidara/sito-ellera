import { sincroresonanceImage } from "@/assets/images";

export type TeatroBalomaIconKey =
  | "calendar"
  | "film"
  | "handCoins"
  | "hardHat"
  | "heart"
  | "mail"
  | "music"
  | "sparkles"
  | "theater"
  | "users"
  | "wrench";

export interface TeatroBalomaHighlight {
  icon: TeatroBalomaIconKey;
  value: string;
  label: string;
  note: string;
}

export interface TeatroBalomaTimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface TeatroBalomaUseCase {
  icon: TeatroBalomaIconKey;
  title: string;
  description: string;
}

export interface TeatroBalomaNeed {
  title: string;
  description: string;
}

export interface TeatroBalomaSupportOption {
  icon: TeatroBalomaIconKey;
  title: string;
  description: string;
}

export interface TeatroBalomaRecentEvent {
  startDate: string;
  endDate?: string;
  date: string;
  title: string;
  host?: string;
  note?: string;
  /** Testo esteso mostrato nel popover di dettaglio. */
  description?: string;
  /** Locandina o immagine associata all'evento. */
  image?: string;
}

export const teatroBalomaIntro = {
  lead:
    "Costruito alla fine del Seicento come Oratorio della Confraternita di San Lorenzo, il Teatro Balomà è un ex cinema parrocchiale recuperato come spazio culturale polivalente, restituito alla comunità grazie al Comitato Ellerese.",
};

export const teatroBalomaHighlights: TeatroBalomaHighlight[] = [
  {
    icon: "users",
    value: "100",
    label: "posti a sedere",
    note: "Capienza raccolta ma adatta a eventi di comunità, incontri e piccole rassegne.",
  },
  {
    icon: "calendar",
    value: "2018→'23",
    label: "recupero per fasi",
    note: "Il rilancio è passato da primi lavori pre-Covid al completamento più ampio del teatro.",
  },
  {
    icon: "heart",
    value: "Affittabile",
    label: "eventi e prove",
    note: "Il Balomà può ospitare incontri, laboratori, presentazioni e attività culturali organizzate da realtà esterne.",
  },
  {
    icon: "sparkles",
    value: "Polivalente",
    label: "uso flessibile",
    note: "Spettacoli, yoga, mostre, riunioni e serate sonore convivono nello stesso spazio senza irrigidirlo in un unico formato.",
  },
];

export const teatroBalomaTimeline: TeatroBalomaTimelineEntry[] = [
  {
    year: "Fine '600",
    title: "Nasce l'Oratorio di S. Lorenzo",
    description: "Edificato dalla Confraternita di San Lorenzo come oratorio a navata unica con altare in muratura per le celebrazioni liturgiche e le assemblee dei confratelli.",
  },
  {
    year: "1830-1860",
    title: "Ampliamenti e vita civile",
    description: "Ampliamento della struttura con magazzini e sagrestia; i locali ospitano temporaneamente la sede municipale di Ellera e l'altare viene rinnovato in marmo.",
  },
  {
    year: "1960",
    title: "Asilo e Cinematografo",
    description: "Conversione degli spazi in asilo infantile e cinematografo parrocchiale, centro di aggregazione per le proiezioni e gli incontri della comunità.",
  },
  {
    year: "Anni '80",
    title: "Chiusura e dismissione",
    description: "Cessazione delle attività ricreative e chiusura della sala, con progressivo degrado dell'immobile.",
  },
  {
    year: "2000",
    title: "Iniziativa del Comitato Ellerese",
    description: "Il Comitato Ellerese avvia la raccolta fondi attraverso le sagre di paese e Caruggi e Lanterne per finanziare il recupero dell'edificio.",
  },
  {
    year: "Fine 2023",
    title: "Riapertura della sala",
    description: "Conclusione dei restauri e riapertura ufficiale della sala con una programmazione di spettacoli, concerti e incontri pubblici.",
  },
];

export const teatroBalomaUseCases: TeatroBalomaUseCase[] = [
  {
    icon: "theater",
    title: "Spettacoli e recital",
    description: "Rappresentazioni teatrali, letture sceniche, piccoli live e serate performative.",
  },
  {
    icon: "music",
    title: "Concerti e ascolti",
    description: "Dalle sonorità acustiche agli ascolti guidati, la sala accoglie rassegne musicali in una dimensione raccolta.",
  },
  {
    icon: "users",
    title: "Riunioni e convegni",
    description: "Spazio attrezzato per assemblee, incontri pubblici, conferenze e presentazioni.",
  },
  {
    icon: "sparkles",
    title: "Mostre e attività formative",
    description: "La sala ospita esposizioni temporanee, laboratori, corsi e attività per il benessere.",
  },
  {
    icon: "heart",
    title: "Prove e attività di comunità",
    description: "Ballo liscio, laboratori di teatro, prove aperte e iniziative associative locali.",
  },
  {
    icon: "film",
    title: "Proiezioni e cinema",
    description: "Mantenimento della vocazione originaria del cinema di paese con proiezioni e rassegne.",
  },
];

export const teatroBalomaNeeds: TeatroBalomaNeed[] = [
  {
    title: "Tendaggi teatrali e quadratura palco",
    description:
      "Fornitura e posa di tendaggi e quinte per delimitare lo spazio scenico e modulare il palco.",
  },
  {
    title: "Trattamento acustico",
    description: "Installazione di pannelli fonoassorbenti per migliorare la resa sonora durante concerti, conferenze e spettacoli.",
  },
  {
    title: "Completamento sedute e arredi",
    description: "Integrazione delle sedute per il pubblico e rifinitura degli elementi di arredo della sala.",
  },
  {
    title: "Riscaldamento invernale",
    description: "Potenziamento dell'impianto termico per garantire l'utilizzo continuativo della sala durante i mesi invernali.",
  },
];

export const teatroBalomaSupportOptions: TeatroBalomaSupportOption[] = [
  {
    icon: "handCoins",
    title: "Fai una donazione",
    description:
      "Il modo più diretto per aiutare il Balomà oggi è un bonifico al Comitato Ellerese dedicato al sostegno della sala.",
  },
  {
    icon: "users",
    title: "Organizza eventi con noi",
    description:
      "Il Balomà cresce davvero se ospita iniziative, persone e collaborazioni: proposte, rassegne, incontri, laboratori e supporto organizzativo aiutano a far vivere lo spazio e ad aumentare l'affluenza.",
  },
  {
    icon: "wrench",
    title: "Aiuta a curare gli spazi",
    description:
      "Lavori di riqualificazione, manutenzione, allestimenti, materiali e supporto pratico sono tra i modi più utili per rendere il Balomà sempre più accogliente e pronto per nuovi eventi.",
  },
];

export const teatroBalomaRecentEvents: TeatroBalomaRecentEvent[] = [
  {
    startDate: "2024-11-22",
    date: "22 novembre 2024",
    title: "Campane tibetane con tamburi sciamanici",
    host: "Doris Schönmann",
    description:
      "Un viaggio sciamanico e bagno di suoni con campane tibetane, gong e tamburi ancestrali. Doris Schönmann, sciamana naturale e operatrice olistica dal Ticino, ha guidato i partecipanti in un'esperienza immersiva di rilassamento profondo e connessione interiore. La serata si è conclusa con una lettura sciamanica interpretativa.",
  },
  {
    startDate: "2024-11-29",
    date: "29 novembre 2024",
    title: "I misteri della Liguria",
    host: "Giorgio Baietti",
    description:
      "Giorgio Baietti, scrittore e ricercatore, ha condotto una serata dedicata ai misteri storici e simbolici della Liguria: luoghi, società iniziatiche e tracce medievali che attraversano il territorio ligure. Baietti è noto al grande pubblico anche come ospite della trasmissione Freedom – Oltre il confine di Roberto Giacobbo.",
  },
  {
    startDate: "2024-12-13",
    date: "13 dicembre 2024",
    title: "Medianità pubblica",
    host: "Gerardo Palumbo",
    description:
      "Serata di medianità pubblica spirituale con Gerardo Palumbo, mediatore naturale capace di trasmettere emozioni profonde. Gerardo si è prestato per ricevere messaggi dall'Oltre specifici per alcuni dei partecipanti presenti in sala, in un'atmosfera raccolta e su prenotazione.",
  },
  {
    startDate: "2025-01-31",
    date: "31 gennaio 2025",
    title: "Storia di una chiesa francese",
    host: "Giorgio Baietti",
    description:
      "Giorgio Baietti ha condotto una ricerca dedicata a una chiesa francese, tra architettura medievale, simbolismo esoterico e ipotesi storiche. Un appuntamento nel solco della sua attività di studioso dei misteri del Medioevo.",
  },
  {
    startDate: "2025-02-14",
    date: "14 febbraio 2025",
    title: "Campane tibetane con tamburi sciamanici",
    host: "Doris Schönmann",
    description:
      "Seconda serata di viaggio sciamanico e bagno di suoni al Balomà con Doris Schönmann, sciamana naturale dal Ticino. Campane tibetane, gong e tamburi per un'esperienza sonora immersiva di rilassamento e connessione interiore.",
  },
  {
    startDate: "2025-03-07",
    date: "7 marzo 2025",
    title: "Concerto di piramidi in rame",
    host: "Chiara Casetta",
    note: "Una serata sonora dedicata alle frequenze e all'ascolto.",
    description:
      "Chiara Casetta, creatrice del progetto Pyramid Energy° e della Piramide Sonora AUDIN™, ha portato al Balomà le sue piramidi degli Astri. Le strutture in rame sono state posizionate nella sala per generare un campo energetico percepibile, armonizzando frequenze e vibrazioni attraverso l'ascolto diretto dei partecipanti.",
  },
  {
    startDate: "2025-03-28",
    date: "28 marzo 2025",
    title: "Medianità pubblica",
    host: "Gerardo Palumbo",
    description:
      "Seconda serata di medianità pubblica spirituale al Balomà con Gerardo Palumbo. Un evento su prenotazione, a numero chiuso, nel rispetto dei partecipanti e della qualità dell'esperienza.",
  },
  {
    startDate: "2025-04-04",
    date: "4 aprile 2025",
    title: "Presentazione libro",
    host: "Giorgio Baietti",
    description:
      "Giorgio Baietti ha presentato al Balomà uno dei suoi volumi dedicati ai misteri storici e all'esoterismo medievale. Una serata di incontro e discussione con uno dei ricercatori italiani più attivi sul tema delle società iniziatiche e dei luoghi simbolici.",
  },
  {
    startDate: "2025-10-03",
    date: "3 ottobre 2025",
    title: "I segreti dei Templari",
    host: "Giorgio Baietti",
    description:
      "Un viaggio affascinante tra storia, mistero e simbologia con Giorgio Baietti, scrittore e ricercatore. Una serata dedicata ai segreti dell'Ordine dei Cavalieri Templari: enigmi irrisolti, ipotesi storiche e tracce lasciate sul territorio. Ingresso a offerta minima su prenotazione.",
  },
  {
    startDate: "2025-10-24",
    date: "24 ottobre 2025",
    title: "Campane tibetane con tamburi sciamanici",
    host: "Doris Schönmann",
    description:
      "Terza serata di viaggio sciamanico e bagno di suoni al Balomà con Doris Schönmann, sciamana naturale e operatrice olistica dal Ticino. Un'esperienza immersiva attraverso campane tibetane, gong e tamburi ancestrali, in uno degli spazi più evocativi del borgo.",
  },
  {
    startDate: "2025-12-18",
    endDate: "2025-12-20",
    date: "18 e 20 dicembre 2025",
    title: "Danza con apericena",
    host: "Isabella Ferrigno / Passo Danza",
  },
  {
    startDate: "2026-04-17",
    endDate: "2026-04-18",
    date: "17 e 18 aprile 2026",
    title: "SincroResonance – Concerto di frequenze cosmiche",
    host: "Lorena Caramanico",
    note: "Appuntamenti previsti tra mattino e sera.",
    image: sincroresonanceImage,
    description:
      "Due giornate dedicate al suono e ai Codici del Tempo.\nUn'occasione per entrare in contatto con lo Tzolkin non attraverso la mente, ma attraverso la risonanza diretta del corpo.\n\n🎶 17 Aprile – Bagno di Suoni dei Codici del Tempo\nIl codice sincronico del giorno viene tradotto in sequenza armonica e suonato con campane di cristallo.\nUn'esperienza immersiva che favorisce rilassamento, centratura e armonizzazione.\nAl termine riceverai anche l'attivazione sonora delle tre note del tuo Kin di nascita.\n\n🎶 18 Aprile – Sessioni individuali (Melodia del Codice Originario)\nIl tuo tema natale Maya viene trasformato in una sequenza armonica unica, suonata e registrata.\nUna traccia sonora della tua frequenza originaria, da riascoltare nel tempo come strumento di riallineamento.",
  },
];

export const teatroBalomaContacts = {
  address: "Via Natale Rosselli 4, Ellera",
  email: "info@ellera.it",
  instagramUrl: "https://instagram.com/excinemateatro_baloma",
  instagramLabel: "@excinemateatro_baloma",
  supportEmail: "comitatoellera@gmail.com",
  supportIban: "IT62V0306909606100000415994",
  supportAccountHolder: "Comitato Ellerese",
  supportPaypalUrl: "https://paypal.me/comitatoellerese",
  supportNote:
    "Il Balomà cresce anche grazie a disponibilità, sostegno e collaborazioni: ogni iniziativa utile ad attivarlo ha valore.",
};