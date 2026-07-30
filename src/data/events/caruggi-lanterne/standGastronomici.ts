export interface StandGastronomico {
  /** Lettera/identificativo usato in mappa */
  marker: string;
  /** Nome della zona o del punto */
  zona: string;
  /** Cosa si trova in quel punto */
  offerta: string[];
  /** Note aggiuntive (es. presenza palco, bar) */
  note?: string;
}

export const STAND_GASTRONOMICI: StandGastronomico[] = [
  {
    marker: "A",
    zona: "Beo",
    offerta: ["Panissa e vino", "Acciughe fritte"],
    note: "Bar con cocktail",
  },
  {
    marker: "B",
    zona: "Via Chiusa",
    offerta: ["Bruschette", "Frisceau", "Panino burro e acciughe"],
  },
  {
    marker: "C",
    zona: "Piazzetta",
    offerta: ["Trofie al pesto", "Polenta al ragù", "Pesche con il vino"],
    note: "Bar 2",
  },
  {
    marker: "D",
    zona: "Caruggio",
    offerta: ["Focaccette"],
  },
  {
    marker: "E",
    zona: "Fojachini",
    offerta: ["Carne alla griglia", "Patatine fritte", "Dolci"],
    note: "Bar 3",
  },
  {
    marker: "F",
    zona: "Piazza Nuova",
    offerta: ["Ravioli al ragù"],
    note: "Laboratorio creativo di ceramica",
  },
];
