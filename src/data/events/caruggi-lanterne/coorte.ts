import type { IconType } from "@/lib/icons";

export interface RealtaCoorte {
  nome: string;
  descrizione: string;
  logo?: string;
  /** Usata solo se manca il logo: icona di ripiego per la scheda nel carosello. */
  icon?: IconType;
}

export const COORTE: RealtaCoorte[] = [
  {
    nome: "Giochi di una volta",
    descrizione: "Spazio dedicato ai giochi tradizionali, proposti e gestiti dagli amici della Pro Loco Mioglia, per riscoprire il divertimento di un'altra epoca.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/proloco-mioglia.webp",
  },
  {
    nome: "Avis delle Albissole",
    descrizione: "Sezione locale dell'Associazione Volontari Italiani Sangue, presente con il suo punto informativo.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/avis-albisole.webp",
  },
  {
    nome: "Sorelle di corpo",
    descrizione: "Realtà del territorio attiva nella sensibilizzazione e nel supporto alla persona.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/sorelle-di-corpo.webp",
  },
  {
    nome: "Sportello Antiviolenza",
    descrizione: "Spazio di ascolto e confronto a cura dello sportello, aperto alla comunità.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/sportello-antiviolenza.webp",
  },
  {
    nome: "Ciclofficina Alfonsina 2.0",
    descrizione: "Officina sociale per la riparazione e la cura delle biciclette, aperta a tutti.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/ciclofficina.webp",
  },
  {
    nome: "Scuola di Ceramica",
    descrizione: "Spazio dedicato all'arte della ceramica tradizionale del nostro territorio.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/scuola-ceramica.webp",
  },
  {
    nome: "Lotteria",
    descrizione: "Il banchetto della lotteria della sagra: biglietti in vendita per tutta la durata dell'evento, con estrazione dei premi in serata.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/logo-lotteria.webp",
  },
  {
    nome: "Bancarelle Hobbistiche",
    descrizione: "Uno spazio comune con le bancarelle di hobbisti e artigiani locali, tra creazioni fatte a mano e piccolo artigianato.",
    logo: "/images/events/caruggi-lanterne/loghi-coorte/logo-hobby.webp",
  },
];
