export type Difficulty = "Facile" | "Medio" | "Impegnativo" | "Esperto";
export type RouteType = "anello" | "lineare";

export interface TrekkingRoute {
  id: string;
  name: string;
  subtitle: string;
  difficulty: Difficulty;
  type: RouteType;
  distanceKm?: number;
  elevationGain?: number;
  durationH?: string;
  signage?: string;
  desc: string;
  highlights?: string[];
  externalUrl?: string;
  color: string;
}

export const trekkingRoutes: TrekkingRoute[] = [
  {
    id: "mulini-colore",
    name: "Percorso dei Mulini da Colore",
    subtitle: "Lungo il torrente Sansobbia",
    difficulty: "Facile",
    type: "lineare",
    distanceKm: 6,
    elevationGain: 80,
    durationH: "2:30-3:00",
    desc: "Il percorso più storico di Ellera: si snoda lungo la valle del torrente Sansobbia toccando i principali mulini da colore che dal '500 rifornivano le fabbriche di ceramica di Albisola. Tra i mulini dell'Olmo, delle Chiappe, del Suffragio, del Campasso, del Remenun, di Marone e di Barban, ognuno con la propria storia. Un museo a cielo aperto tra acque e bosco.",
    highlights: [
      "Mulini storici del XVI-XX sec.",
      "Fiume Sansobbia",
      "Pannelli ceramici artistici",
      "Facile per famiglie",
    ],
    color: "bg-secondary",
  },
  {
    id: "crovaro-santuario",
    name: "Ellera - Crovaro - Santuario della Pace",
    subtitle: "Il sentiero dei pellegrini",
    difficulty: "Facile",
    type: "lineare",
    distanceKm: 7,
    elevationGain: 250,
    durationH: "2:00-2:30",
    desc: "Partenza dal Ponte Romano in Via Montenotte. Era il percorso che gli elleresi compivano in pellegrinaggio verso il Santuario di Nostra Signora della Pace di Savona, portando le casse lignee e il crocifisso in occasione della festa della Madonna. Un sentiero carico di storia e spiritualità tra boschi e terrazzamenti.",
    highlights: [
      "Partenza dal Ponte Romano",
      "Sentiero storico dei pellegrini",
      "Santuario N.S. della Pace",
      "Vista su Savona",
    ],
    color: "bg-secondary",
  },
  {
    id: "anello-ellera",
    name: "Anello di Ellera",
    subtitle: "Bric Brigna, Bric Beia, mulini e area carsica",
    difficulty: "Medio",
    type: "anello",
    distanceKm: 9,
    elevationGain: 450,
    durationH: "3:00-3:30",
    signage: "Losanga rossa",
    desc: "Anello classico che parte dalla Chiesa di San Bartolomeo e sale verso il Bric della Brigna attraverso una faggeta insolita per la bassa quota. Dal Bric Beia (548 m) si scende verso l'area carsica del Crivezzo con la Grotta del Picco e conformazioni ad arco, poi si rientra passando per gli antichi mulini da colore. Percorso vario e ben segnalato.",
    highlights: [
      "Bric Beia 548 m",
      "Faggeta a bassa quota",
      "Grotta del Picco",
      "Mulini da Colore nel ritorno",
    ],
    externalUrl: "https://leo-trekking.blogspot.com/2016/11/anello-di-ellera.html",
    color: "bg-accent",
  },
  {
    id: "luceto-bric-genova",
    name: "Luceto - Bric Genova - Ellera",
    subtitle: "Giro ad anello via crinale panoramico",
    difficulty: "Medio",
    type: "anello",
    distanceKm: 14.7,
    elevationGain: 500,
    durationH: "4:00-4:30",
    desc: "Collegamento storico tra la costa e l'entroterra che attraversa macchia mediterranea e terrazzamenti abbandonati. Dal Bric Genova il panorama spazia dalla costa savonese verso l'entroterra. Un anello che racconta il rapporto millenario tra uomo e territorio, tra muretti a secco e boschi di castagno.",
    highlights: [
      "Bric Genova con panorama sulla costa",
      "Terrazzamenti abbandonati",
      "Macchia mediterranea",
      "Partenza da Luceto",
    ],
    color: "bg-accent",
  },
  {
    id: "anello-seia",
    name: "Anello della Seia",
    subtitle: "Grande anello panoramico a ovest del borgo",
    difficulty: "Medio",
    type: "anello",
    elevationGain: 400,
    durationH: "3:30-4:00",
    desc: "Grande anello a ovest del borgo con vedute sulla Val Sansobbia e il comprensorio di Stella. Ideale per una mezza giornata in natura, il percorso alterna tratti boscosi ad aperture panoramiche verso la costa. Ottimo in primavera quando la vegetazione è nel pieno della fioritura.",
    highlights: [
      "Val Sansobbia",
      "Vista su Stella e comprensorio",
      "Ottimo in primavera",
      "Mezza giornata",
    ],
    color: "bg-accent",
  },
  {
    id: "ellera-greppino",
    name: "Ellera - Monte Greppino",
    subtitle: "Collegamento con l'Alta Via dei Monti Liguri",
    difficulty: "Impegnativo",
    type: "lineare",
    elevationGain: 700,
    durationH: "4:00-4:30",
    desc: "Da Ellera si sale attraverso Cian Cria, La Brigna, Rio Cercie, Le Cercie e Bric Beia fino a Casa Giberto, poi si prosegue verso il Bric Cascinotto e il Bric Arpetto fino alla sella nord-est del Monte Greppino. Sul Greppino si incontra l'Alta Via dei Monti Liguri, che percorre tutta la dorsale ligure dall'Appennino al mare.",
    highlights: [
      "Alta Via dei Monti Liguri",
      "Bric Beia e Bric Cascinotto",
      "Monte Greppino",
      "Lunga traversata",
    ],
    color: "bg-destructive",
  },
  {
    id: "sentiero-514",
    name: "Sentiero 514",
    subtitle: "Da Ellera al Passo San Giorgio",
    difficulty: "Impegnativo",
    type: "lineare",
    elevationGain: 650,
    durationH: "3:30-4:00",
    signage: "514 CAI",
    desc: "Salita tecnica verso il crinale con tratti panoramici sulla costa ligure. Il sentiero si snoda tra boschi di castagno e affioramenti rocciosi, offrendo scorci sulla Valle Sansobbia e sul mare. Il Passo San Giorgio è uno dei punti di accesso alla zona delle pale eoliche e all'Alta Via.",
    highlights: [
      "Crinale con vista mare",
      "Boschi di castagno",
      "Affioramenti rocciosi",
      "Accesso Alta Via",
    ],
    color: "bg-destructive",
  },
  {
    id: "anello-parco-eolico",
    name: "Anello Ellera - Parco Eolico - Monte S. Giorgio",
    subtitle: "Il grande anello sul crinale, vista Corsica e Alpi",
    difficulty: "Esperto",
    type: "anello",
    distanceKm: 16.5,
    elevationGain: 850,
    durationH: "7:00",
    signage: "Croce rossa -> Tre bolli rossi -> Bianco-rosso AV -> Quadrato rosso -> Due triangoli rossi",
    desc: "Il percorso più completo partendo da Ellera. Dal ponte (70 m) si sale verso Le Cercie, si raggiunge l'Alta Via dei Monti Liguri e si percorre il Parco Eolico fino al Monte San Giorgio (835 m). Il ritorno avviene dalla località Naso di Gatto lungo l'itinerario napoleonico, attraversando le posizioni della Battaglia di Montenotte del 1796. Nelle giornate limpide si vedono la Corsica e le Alpi Marittime.",
    highlights: [
      "Monte S. Giorgio 835 m",
      "Alta Via dei Monti Liguri",
      "Parco Eolico",
      "Itinerario napoleonico",
      "Vista Corsica e Alpi",
    ],
    externalUrl: "https://leo-trekking.blogspot.com/2019/11/ellera-parco-eolico-monte-s-giorgio.html",
    color: "bg-destructive",
  },
  {
    id: "sentiero-513",
    name: "Sentiero 513",
    subtitle: "Percorso multi-vetta sul crinale",
    difficulty: "Esperto",
    type: "lineare",
    signage: "513 CAI",
    desc: "Percorso panoramico riservato agli escursionisti esperti che collega diverse vette del crinale. Vista a 360 gradi dalla Corsica alle Alpi Marittime nelle giornate limpide. Da combinare con altri sentieri per itinerari di più giorni sull'Alta Via.",
    highlights: [
      "Vista 360 gradi",
      "Crinale multi-vetta",
      "Per esperti",
      "Collegabile all'Alta Via",
    ],
    color: "bg-destructive",
  },
];

export const difficultyOrder: Record<Difficulty, number> = {
  Facile: 0,
  Medio: 1,
  Impegnativo: 2,
  Esperto: 3,
};

export const difficultyColors: Record<Difficulty, string> = {
  Facile: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Medio: "bg-accent/10 text-accent border-accent/20",
  Impegnativo: "bg-orange-100 text-orange-800 border-orange-200",
  Esperto: "bg-destructive/10 text-destructive border-destructive/20",
};

export const routeTypeLabel: Record<RouteType, string> = {
  anello: "Anello",
  lineare: "Lineare",
};
